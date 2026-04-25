import {
  UPG_DEFAULT_MAX_TOKENS,
  UPG_DEFAULT_TEMPERATURE,
  UPG_MAX_GENERATION_TIME_MS,
} from './constants';

export interface CallAnthropicParams {
  model: string;
  systemPrompt: string;
  userPrompt: string;
  maxTokens?: number;
  temperature?: number;
  baseUrl?: string;
}

export interface CallAnthropicResult {
  html: string;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
}

export class AnthropicError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly errorType: 'invalid_key' | 'rate_limit' | 'server_error' | 'timeout' | 'unknown'
  ) {
    super(message);
    this.name = 'AnthropicError';
  }
}

export async function callAnthropic(
  apiKey: string,
  params: CallAnthropicParams
): Promise<CallAnthropicResult> {
  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(),
    UPG_MAX_GENERATION_TIME_MS
  );

  try {
    const baseUrl = (
      params.baseUrl || process.env.ANTHROPIC_BASE_URL || 'https://open.bigmodel.cn/api/anthropic'
    ).replace(/\/+$/, '');

    // Some proxies require Bearer auth instead of x-api-key
    const isProxy = !baseUrl.includes('api.anthropic.com');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01',
    };
    if (isProxy) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    } else {
      headers['x-api-key'] = apiKey;
    }

    const response = await fetch(`${baseUrl}/v1/messages`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: params.model,
        max_tokens: params.maxTokens ?? UPG_DEFAULT_MAX_TOKENS,
        temperature: params.temperature ?? UPG_DEFAULT_TEMPERATURE,
        system: params.systemPrompt,
        messages: [{ role: 'user', content: params.userPrompt }],
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      let detail = '';
      try {
        const body = await response.json();
        detail = body?.error?.message || JSON.stringify(body);
      } catch {
        detail = response.statusText;
      }
      const errorType =
        response.status === 401 || response.status === 403
          ? 'invalid_key'
          : response.status === 429 || response.status === 402
            ? 'rate_limit'
            : response.status >= 500
              ? 'server_error'
              : 'unknown';
      throw new AnthropicError(
        `Anthropic API error (${response.status}): ${detail}`,
        response.status,
        errorType
      );
    }

    const data = await response.json();
    const content =
      data?.content?.find((c: any) => c.type === 'text')?.text ?? '';
    const usage = data?.usage ?? {};

    return {
      html: content,
      inputTokens: usage.input_tokens ?? 0,
      outputTokens: usage.output_tokens ?? 0,
      costUsd: 0,
    };
  } catch (err: unknown) {
    if (err instanceof AnthropicError) throw err;
    const isAbort =
      (err instanceof Error && err.name === 'AbortError') ||
      (typeof err === 'object' && err !== null && 'name' in err && (err as { name: string }).name === 'AbortError');
    if (isAbort) {
      throw new AnthropicError(
        `Anthropic request timed out after ${UPG_MAX_GENERATION_TIME_MS}ms`,
        408,
        'timeout'
      );
    }
    const message = err instanceof Error ? err.message : 'unknown error';
    throw new AnthropicError(
      `Anthropic request failed: ${message}`,
      0,
      'unknown'
    );
  } finally {
    clearTimeout(timeout);
  }
}
