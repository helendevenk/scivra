/**
 * UPG Reviewer — calls PackyAPI (OpenAI-compatible) for 6-dimension review
 *
 * Config: PACKY_API_KEY + PACKY_API_BASE_URL in .env
 * Fallback: none — if PackyAPI is down, review is skipped (non-blocking)
 */

import { REVIEW_SYSTEM_PROMPT, buildReviewUserPrompt } from './review-prompt';

export interface ReviewDimension {
  verdict: 'pass' | 'warn' | 'fail';
  notes: string;
}

export interface ReviewResult {
  verdict: 'pass' | 'pass_with_notes' | 'fail';
  dimensions: {
    physics_accuracy: ReviewDimension;
    interactivity: ReviewDimension;
    visual_quality: ReviewDimension;
    educational_content: ReviewDimension;
    code_quality: ReviewDimension;
    accessibility_ux: ReviewDimension;
  };
  critical_issues: string[];
  suggestions: string[];
}

function getConfig() {
  const apiKey = process.env.PACKY_API_KEY;
  const baseUrl = process.env.PACKY_API_BASE_URL || 'https://www.packyapi.com/v1';
  if (!apiKey) {
    throw new Error('PACKY_API_KEY is not configured');
  }
  return { apiKey, baseUrl };
}

export async function reviewExperiment(
  html: string,
  topic: string,
  discipline: string,
  model: string = 'gpt-4o'
): Promise<ReviewResult> {
  const { apiKey, baseUrl } = getConfig();

  const userPrompt = buildReviewUserPrompt(html, topic, discipline);

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: REVIEW_SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.1,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`PackyAPI review failed (${response.status}): ${text}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('PackyAPI returned empty response');
  }

  // Parse JSON from response (may be wrapped in ```json blocks)
  const jsonStr = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const result = JSON.parse(jsonStr) as ReviewResult;

  // Validate structure
  if (!result.verdict || !result.dimensions) {
    throw new Error('Invalid review result structure');
  }

  return result;
}

/**
 * Check if review API is configured
 */
export function isReviewConfigured(): boolean {
  return !!process.env.PACKY_API_KEY;
}
