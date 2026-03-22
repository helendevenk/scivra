import { NextRequest } from 'next/server';

import { respData, respErr } from '@/shared/lib/resp';
import { getUserInfo } from '@/shared/models/user';
import { getAllConfigs } from '@/shared/models/config';
import { getCurrentSubscription } from '@/shared/models/subscription';
import { subscriptionToTier } from '@/shared/lib/experiments/access';
import { db } from '@/core/db';
import { autopilotSession } from '@/config/db/schema';
import { eq, and } from 'drizzle-orm';
import { callAnthropic } from '@/shared/lib/upg/anthropic-client';
import {
  AUTOPILOT_MODEL,
  AUTOPILOT_MAX_TOKENS,
  AUTOPILOT_TEMPERATURE,
} from '@/shared/lib/autopilot/constants';
import {
  getTutorSystemPrompt,
  buildTutorUserPrompt,
} from '@/shared/lib/autopilot/tutor-prompt';
import type { AutopilotStepRequest, AutopilotStepResponse } from '@/shared/lib/autopilot/types';

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  const user = await getUserInfo();
  if (!user) {
    return respErr('Login required to use AI Tutor');
  }

  let body: AutopilotStepRequest;
  try {
    body = await request.json();
  } catch {
    return respErr('Invalid request body');
  }

  const { generationId, sessionId, task, history, visualizationState, stepNumber, language } = body;

  if (!generationId || !sessionId || !task || stepNumber === undefined) {
    return respErr('Missing required fields');
  }

  // Determine user tier (Pro/Max users get unlimited autopilot sessions)
  const sub = await getCurrentSubscription(user.id);
  const tier = subscriptionToTier(sub?.planName ?? null);
  const isPro = tier === 'pro' || tier === 'max';

  // Quota check for Free users: 1 session per visualization
  if (!isPro) {
    const existing = await db()
      .select({ id: autopilotSession.id })
      .from(autopilotSession)
      .where(
        and(
          eq(autopilotSession.userId, user.id),
          eq(autopilotSession.generationId, generationId)
        )
      )
      .limit(1);

    if (existing.length > 0 && stepNumber === 0) {
      return respErr('Free users get 1 guided session per visualization. Upgrade to Pro for unlimited sessions.');
    }
  }

  // Create session record on step 0
  if (stepNumber === 0) {
    await db()
      .insert(autopilotSession)
      .values({
        id: sessionId,
        userId: user.id,
        generationId,
        status: 'active',
        totalSteps: 0,
        language,
        completedQuiz: false,
        quizCorrect: 0,
        createdAt: new Date(),
      })
      .onConflictDoNothing();
  }

  // Build prompts
  const systemPrompt = getTutorSystemPrompt(language);
  const userPrompt = buildTutorUserPrompt(task, history, visualizationState, stepNumber);

  // Call LLM
  const configs = await getAllConfigs();
  const apiKey = process.env.OPENROUTER_API_KEY || configs.openrouter_api_key;
  const baseUrl = process.env.OPENROUTER_BASE_URL || configs.openrouter_base_url;

  if (!apiKey) {
    return respErr('AI service not configured');
  }

  let rawText: string;
  try {
    const result = await callAnthropic(apiKey, {
      model: AUTOPILOT_MODEL,
      systemPrompt,
      userPrompt,
      maxTokens: AUTOPILOT_MAX_TOKENS,
      temperature: AUTOPILOT_TEMPERATURE,
      baseUrl,
    });
    rawText = result.html; // callAnthropic returns content in .html field
  } catch (err: any) {
    return respErr(`AI call failed: ${err?.message ?? 'unknown error'}`);
  }

  // Parse LLM JSON output
  let parsed: AutopilotStepResponse;
  try {
    // Strip potential markdown fences
    const cleaned = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    const obj = JSON.parse(cleaned);
    parsed = {
      reflection: {
        evaluation_previous_goal: obj.evaluation_previous_goal ?? '',
        memory: obj.memory ?? '',
        next_goal: obj.next_goal ?? '',
      },
      action: obj.action ?? { tutor_speak: { message: rawText.slice(0, 200) } },
    };
  } catch {
    // Fallback: wrap raw text as tutor_speak
    parsed = {
      reflection: { evaluation_previous_goal: '', memory: '', next_goal: '' },
      action: { tutor_speak: { message: rawText.slice(0, 300) } },
    };
  }

  // Update session on done
  const actionName = Object.keys(parsed.action)[0];
  if (actionName === 'done') {
    await db()
      .update(autopilotSession)
      .set({
        status: 'completed',
        totalSteps: stepNumber,
        completedAt: new Date(),
        durationMs: undefined,
      })
      .where(eq(autopilotSession.id, sessionId));
  } else if (stepNumber > 0 && stepNumber % 5 === 0) {
    // Periodic step count update
    await db()
      .update(autopilotSession)
      .set({ totalSteps: stepNumber })
      .where(eq(autopilotSession.id, sessionId));
  }

  return respData(parsed);
}
