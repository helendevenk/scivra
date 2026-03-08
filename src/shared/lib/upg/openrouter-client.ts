import { getAllConfigs } from '@/shared/models/config';
import {
  UPG_DEFAULT_MAX_TOKENS,
  UPG_DEFAULT_TEMPERATURE,
  UPG_MAX_GENERATION_TIME_MS,
  UPG_OPENROUTER_DEFAULT_BASE_URL,
} from './constants';

export interface CallOpenRouterParams {
  model: string;
  systemPrompt: string;
  userPrompt: string;
  maxTokens?: number;
  temperature?: number;
  stream?: boolean; // V0.2 reserved
}

export interface CallOpenRouterResult {
  html: string;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
}

export class OpenRouterError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly errorType: 'invalid_key' | 'rate_limit' | 'server_error' | 'timeout' | 'unknown'
  ) {
    super(message);
    this.name = 'OpenRouterError';
  }
}

function classifyError(status: number): OpenRouterError['errorType'] {
  if (status === 401 || status === 403) return 'invalid_key';
  if (status === 429) return 'rate_limit';
  if (status >= 500) return 'server_error';
  return 'unknown';
}

export async function callOpenRouter(params: CallOpenRouterParams): Promise<CallOpenRouterResult> {
  const configs = await getAllConfigs();
  const apiKey = configs.openrouter_api_key;
  if (!apiKey) {
    throw new OpenRouterError('OpenRouter API key not configured', 401, 'invalid_key');
  }

  const baseUrl = configs.openrouter_base_url || UPG_OPENROUTER_DEFAULT_BASE_URL;
  const url = `${baseUrl.replace(/\/+$/, '')}/chat/completions`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), UPG_MAX_GENERATION_TIME_MS);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: params.model,
        messages: [
          { role: 'system', content: params.systemPrompt },
          { role: 'user', content: params.userPrompt },
        ],
        max_tokens: params.maxTokens ?? UPG_DEFAULT_MAX_TOKENS,
        temperature: params.temperature ?? UPG_DEFAULT_TEMPERATURE,
        stream: false,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorType = classifyError(response.status);
      let detail = '';
      try {
        const body = await response.json();
        detail = body?.error?.message || JSON.stringify(body);
      } catch {
        detail = response.statusText;
      }
      throw new OpenRouterError(
        `OpenRouter API error (${response.status}): ${detail}`,
        response.status,
        errorType
      );
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content ?? '';
    const usage = data?.usage ?? {};

    return {
      html: content,
      inputTokens: usage.prompt_tokens ?? 0,
      outputTokens: usage.completion_tokens ?? 0,
      costUsd: typeof usage.total_cost === 'number' ? usage.total_cost : 0,
    };
  } catch (err: any) {
    if (err instanceof OpenRouterError) throw err;
    if (err?.name === 'AbortError') {
      throw new OpenRouterError(
        `OpenRouter request timed out after ${UPG_MAX_GENERATION_TIME_MS}ms`,
        408,
        'timeout'
      );
    }
    throw new OpenRouterError(
      `OpenRouter request failed: ${err?.message ?? 'unknown error'}`,
      0,
      'unknown'
    );
  } finally {
    clearTimeout(timeout);
  }
}
