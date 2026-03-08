import { respData, respErr } from '@/shared/lib/resp';
import { getUserInfo } from '@/shared/models/user';
import { getRemainingCredits, consumeCredits } from '@/shared/models/credit';
import {
  createUpgGeneration,
  NewUpgGeneration,
} from '@/shared/models/upg_generation';
import {
  getDailyQuotaCount,
  incrementDailyQuota,
} from '@/shared/models/upg_daily_quota';
import { getCurrentSubscription } from '@/shared/models/subscription';
import { subscriptionToTier } from '@/shared/lib/experiments/access';
import { callOpenRouter } from '@/shared/lib/upg/openrouter-client';
import { getSystemPrompt, buildUserPrompt } from '@/shared/lib/upg/system-prompt';
import { sanitizeHtml } from '@/shared/lib/upg/html-sanitizer';
import { checkQuality } from '@/shared/lib/upg/quality-checker';
import { selectModel } from '@/shared/lib/upg/model-selector';
import {
  UPG_CREDITS_PER_GENERATION,
  UPG_CREDITS_PER_REGENERATION,
  UPG_FREE_DAILY_LIMIT,
  UPG_PRO_DAILY_LIMIT,
} from '@/shared/lib/upg/constants';
import { getUuid } from '@/shared/lib/hash';
import { createHash } from 'crypto';

// --- Anonymous rate limiter (in-memory, IP-based, 1/day) ---
const anonymousUsage = new Map<string, number>(); // IP hash -> timestamp (day start)

function getToday(): number {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
}

function cleanExpiredAnonymous() {
  const today = getToday();
  for (const [key, dayStart] of anonymousUsage) {
    if (dayStart < today) {
      anonymousUsage.delete(key);
    }
  }
}

// Clean up once per hour
let lastCleanup = 0;
function maybeCleanup() {
  const now = Date.now();
  if (now - lastCleanup > 3600_000) {
    lastCleanup = now;
    cleanExpiredAnonymous();
  }
}

function hashIp(ip: string): string {
  return createHash('sha256').update(ip).digest('hex').slice(0, 16);
}

// --- Concurrency lock (per-user in-memory Set) ---
const activeUsers = new Set<string>();

export async function POST(request: Request) {
  let lockKey: string | null = null;

  try {
    // 1. Parse & validate params
    const body = await request.json();
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
    const language: 'zh' | 'en' = body.language === 'en' ? 'en' : 'zh';
    const isRegenerate = body.isRegenerate === true;
    const creditsToConsume = isRegenerate ? UPG_CREDITS_PER_REGENERATION : UPG_CREDITS_PER_GENERATION;

    if (prompt.length < 2 || prompt.length > 500) {
      return respErr('Prompt length must be between 2 and 500 characters');
    }

    // 2. Auth (optional — anonymous allowed)
    const user = await getUserInfo();
    const userId = user?.id ?? null;

    // 3. Rate limiting
    const todayStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    if (!userId) {
      // Anonymous: IP-based, 1/day
      maybeCleanup();
      const forwarded = request.headers.get('x-forwarded-for');
      const realIp = request.headers.get('x-real-ip');
      const ip = forwarded?.split(',')[0]?.trim() || realIp || 'unknown';
      const ipHash = hashIp(ip);
      const today = getToday();

      if (anonymousUsage.get(ipHash) === today) {
        return respErr('Anonymous users can generate once per day. Please sign in for more.');
      }

      // Mark usage upfront (will be set after success, but check is here)
      // We'll set it after success below
    } else {
      // Logged-in user: check daily quota
      const sub = await getCurrentSubscription(userId);
      const tier = subscriptionToTier(sub?.planName ?? null);

      if (tier !== 'max') {
        const dailyCount = await getDailyQuotaCount(userId, todayStr);
        const limit = tier === 'pro' ? UPG_PRO_DAILY_LIMIT : UPG_FREE_DAILY_LIMIT;
        if (dailyCount >= limit) {
          return respErr(`Daily generation limit reached (${limit}/day). ${tier === 'free' ? 'Upgrade to Pro for more.' : 'Try again tomorrow.'}`);
        }
      }

      // 4. Credits pre-check (logged-in only, check without deducting)
      const remaining = await getRemainingCredits(userId);
      if (remaining < creditsToConsume) {
        return respErr(`Insufficient credits. Need ${creditsToConsume}, have ${remaining}.`);
      }
    }

    // 5. Concurrency lock
    const forwarded2 = request.headers.get('x-forwarded-for');
    const realIp2 = request.headers.get('x-real-ip');
    const anonIp = forwarded2?.split(',')[0]?.trim() || realIp2 || 'unknown';
    lockKey = userId || `anon-${hashIp(anonIp)}`;
    if (activeUsers.has(lockKey)) {
      return respErr('A generation is already in progress. Please wait.');
    }
    activeUsers.add(lockKey);

    // 6. AI generation
    const model = selectModel();
    const systemPrompt = getSystemPrompt();
    const userPrompt = buildUserPrompt(prompt, language);

    const aiResult = await callOpenRouter({
      model,
      systemPrompt,
      userPrompt,
    });

    // 7. Post-processing
    const { sanitized: htmlContent, issues: sanitizeIssues } = sanitizeHtml(aiResult.html);
    const qualityResult = checkQuality(htmlContent);

    if (!qualityResult.passed) {
      // Quality check failed — record as failed, no credits deducted
      const promptHash = createHash('sha256').update(prompt).digest('hex');
      await createUpgGeneration({
        id: getUuid(),
        userId,
        prompt,
        promptHash,
        language,
        htmlContent,
        model,
        provider: 'openrouter',
        inputTokens: aiResult.inputTokens,
        outputTokens: aiResult.outputTokens,
        costCredits: 0,
        status: 'failed',
        errorMessage: `Quality check failed: ${qualityResult.issues.join('; ')}`,
        isPublic: false,
        viewCount: 0,
        shareCount: 0,
        downloadCount: 0,
      });

      return respErr(`Generation quality check failed: ${qualityResult.issues.join('; ')}`);
    }

    // 8. Success: consume credits + create record + increment quota
    const promptHash = createHash('sha256').update(prompt).digest('hex');
    const htmlSize = new TextEncoder().encode(htmlContent).length;
    let creditId: string | null = null;

    if (userId) {
      const creditResult = await consumeCredits({
        userId,
        credits: creditsToConsume,
        scene: isRegenerate ? 'upg-regenerate' : 'upg-generate',
        description: `UPG ${isRegenerate ? 'regeneration' : 'generation'}: ${prompt.slice(0, 50)}`,
      });
      creditId = creditResult?.id ?? null;
    }

    const generationData: NewUpgGeneration = {
      id: getUuid(),
      userId,
      prompt,
      promptHash,
      language,
      htmlContent,
      htmlSize,
      model,
      provider: 'openrouter',
      inputTokens: aiResult.inputTokens,
      outputTokens: aiResult.outputTokens,
      costCredits: userId ? creditsToConsume : 0,
      creditId,
      status: 'completed',
      isPublic: false,
      viewCount: 0,
      shareCount: 0,
      downloadCount: 0,
    };

    const generation = await createUpgGeneration(generationData);

    if (userId) {
      await incrementDailyQuota(userId, todayStr);
    } else {
      // Mark anonymous usage
      const forwarded = request.headers.get('x-forwarded-for');
      const realIp = request.headers.get('x-real-ip');
      const ip = forwarded?.split(',')[0]?.trim() || realIp || 'unknown';
      anonymousUsage.set(hashIp(ip), getToday());
    }

    return respData({
      id: generation.id,
      status: generation.status,
      htmlContent: generation.htmlContent,
    });
  } catch (e: any) {
    console.error('UPG generate failed:', e);

    // Try to record failed generation
    try {
      const body = await request.clone().json().catch(() => ({}));
      const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : '';
      if (prompt) {
        const user = await getUserInfo().catch(() => null);
        const promptHash = createHash('sha256').update(prompt).digest('hex');
        await createUpgGeneration({
          id: getUuid(),
          userId: user?.id ?? null,
          prompt,
          promptHash,
          language: body.language === 'en' ? 'en' : 'zh',
          model: selectModel(),
          provider: 'openrouter',
          status: 'failed',
          errorMessage: e.message?.slice(0, 500),
          isPublic: false,
          viewCount: 0,
          shareCount: 0,
          downloadCount: 0,
        });
      }
    } catch {
      // Ignore secondary errors
    }

    return respErr(e.message || 'Generation failed');
  } finally {
    // Release concurrency lock
    if (lockKey) {
      activeUsers.delete(lockKey);
    }
  }
}
