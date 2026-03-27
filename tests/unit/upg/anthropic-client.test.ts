import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  callAnthropic,
  AnthropicError,
  type CallAnthropicParams,
} from '@/shared/lib/upg/anthropic-client';

// ── Mock constants ──
vi.mock('@/shared/lib/upg/constants', () => ({
  UPG_DEFAULT_MAX_TOKENS: 16000,
  UPG_DEFAULT_TEMPERATURE: 0.7,
  UPG_MAX_GENERATION_TIME_MS: 300000,
}));

// ── Helpers ──

const originalFetch = global.fetch;

function baseParams(overrides?: Partial<CallAnthropicParams>): CallAnthropicParams {
  return {
    model: 'claude-sonnet-4-6',
    systemPrompt: 'You are a physics tutor.',
    userPrompt: 'Explain gravity.',
    ...overrides,
  };
}

function mockFetchResponse(body: unknown, status = 200) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    json: () => Promise.resolve(body),
  });
}

function successBody(text = '<html>result</html>') {
  return {
    content: [{ type: 'text', text }],
    usage: { input_tokens: 100, output_tokens: 500 },
  };
}

describe('callAnthropic', () => {
  beforeEach(() => {
    delete process.env.ANTHROPIC_BASE_URL;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  // 1. Successful response parsing
  it('should parse a successful API response', async () => {
    global.fetch = mockFetchResponse(successBody('<html>physics</html>'));

    const result = await callAnthropic('test-key', baseParams());

    expect(result.html).toBe('<html>physics</html>');
    expect(result.inputTokens).toBe(100);
    expect(result.outputTokens).toBe(500);
    expect(result.costUsd).toBe(0);
  });

  // 2. Uses x-api-key for direct Anthropic API
  it('should use x-api-key header for api.anthropic.com', async () => {
    global.fetch = mockFetchResponse(successBody());

    await callAnthropic('sk-123', baseParams({ baseUrl: 'https://api.anthropic.com' }));

    const fetchCall = vi.mocked(global.fetch).mock.calls[0];
    const headers = (fetchCall[1] as RequestInit).headers as Record<string, string>;
    expect(headers['x-api-key']).toBe('sk-123');
    expect(headers['Authorization']).toBeUndefined();
  });

  // 3. Uses Bearer auth for proxy URLs
  it('should use Bearer auth for proxy base URLs', async () => {
    global.fetch = mockFetchResponse(successBody());

    await callAnthropic('sk-123', baseParams({ baseUrl: 'https://openrouter.ai/api/v1' }));

    const fetchCall = vi.mocked(global.fetch).mock.calls[0];
    const headers = (fetchCall[1] as RequestInit).headers as Record<string, string>;
    expect(headers['Authorization']).toBe('Bearer sk-123');
    expect(headers['x-api-key']).toBeUndefined();
  });

  // 4. HTTP 401 → invalid_key
  it('should throw AnthropicError with invalid_key for 401', async () => {
    global.fetch = mockFetchResponse(
      { error: { message: 'Invalid API key' } },
      401
    );

    try {
      await callAnthropic('bad-key', baseParams());
      expect.fail('Should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(AnthropicError);
      const ae = err as AnthropicError;
      expect(ae.statusCode).toBe(401);
      expect(ae.errorType).toBe('invalid_key');
    }
  });

  // 5. HTTP 403 → invalid_key
  it('should throw AnthropicError with invalid_key for 403', async () => {
    global.fetch = mockFetchResponse({ error: { message: 'Forbidden' } }, 403);

    try {
      await callAnthropic('bad-key', baseParams());
      expect.fail('Should have thrown');
    } catch (err) {
      const ae = err as AnthropicError;
      expect(ae.errorType).toBe('invalid_key');
    }
  });

  // 6. HTTP 429 → rate_limit
  it('should throw AnthropicError with rate_limit for 429', async () => {
    global.fetch = mockFetchResponse(
      { error: { message: 'Rate limited' } },
      429
    );

    try {
      await callAnthropic('key', baseParams());
      expect.fail('Should have thrown');
    } catch (err) {
      const ae = err as AnthropicError;
      expect(ae.statusCode).toBe(429);
      expect(ae.errorType).toBe('rate_limit');
    }
  });

  // 7. HTTP 402 → rate_limit
  it('should throw AnthropicError with rate_limit for 402', async () => {
    global.fetch = mockFetchResponse(
      { error: { message: 'Payment required' } },
      402
    );

    try {
      await callAnthropic('key', baseParams());
      expect.fail('Should have thrown');
    } catch (err) {
      const ae = err as AnthropicError;
      expect(ae.statusCode).toBe(402);
      expect(ae.errorType).toBe('rate_limit');
    }
  });

  // 8. HTTP 500 → server_error
  it('should throw AnthropicError with server_error for 500', async () => {
    global.fetch = mockFetchResponse(
      { error: { message: 'Internal error' } },
      500
    );

    try {
      await callAnthropic('key', baseParams());
      expect.fail('Should have thrown');
    } catch (err) {
      const ae = err as AnthropicError;
      expect(ae.statusCode).toBe(500);
      expect(ae.errorType).toBe('server_error');
    }
  });

  // 9. AbortError → timeout
  it('should throw AnthropicError with timeout for AbortError', async () => {
    const abortError = new DOMException('The operation was aborted', 'AbortError');
    global.fetch = vi.fn().mockRejectedValue(abortError);

    try {
      await callAnthropic('key', baseParams());
      expect.fail('Should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(AnthropicError);
      const ae = err as AnthropicError;
      expect(ae.errorType).toBe('timeout');
      expect(ae.statusCode).toBe(408);
    }
  });

  // 10. Network failure → unknown
  it('should throw AnthropicError with unknown for network failure', async () => {
    global.fetch = vi.fn().mockRejectedValue(new TypeError('fetch failed'));

    try {
      await callAnthropic('key', baseParams());
      expect.fail('Should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(AnthropicError);
      const ae = err as AnthropicError;
      expect(ae.errorType).toBe('unknown');
      expect(ae.statusCode).toBe(0);
      expect(ae.message).toContain('fetch failed');
    }
  });

  // 11. Missing content in response → empty html
  it('should return empty html when response has no text content', async () => {
    global.fetch = mockFetchResponse({
      content: [{ type: 'image', source: {} }],
      usage: { input_tokens: 50, output_tokens: 0 },
    });

    const result = await callAnthropic('key', baseParams());

    expect(result.html).toBe('');
  });

  // 12. Strips trailing slashes from baseUrl
  it('should strip trailing slashes from baseUrl', async () => {
    global.fetch = mockFetchResponse(successBody());

    await callAnthropic('key', baseParams({ baseUrl: 'https://api.anthropic.com///' }));

    const fetchCall = vi.mocked(global.fetch).mock.calls[0];
    expect(fetchCall[0]).toBe('https://api.anthropic.com/v1/messages');
  });

  // 13. Error response with non-JSON body
  it('should handle non-JSON error response body', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
      statusText: 'Service Unavailable',
      json: () => Promise.reject(new Error('not JSON')),
    });

    try {
      await callAnthropic('key', baseParams());
      expect.fail('Should have thrown');
    } catch (err) {
      const ae = err as AnthropicError;
      expect(ae.statusCode).toBe(503);
      expect(ae.errorType).toBe('server_error');
      expect(ae.message).toContain('Service Unavailable');
    }
  });
});
