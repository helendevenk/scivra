import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { captureServerError, captureClientError } from '@/extensions/monitoring/sentry';

describe('sentry monitoring', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    delete process.env.SENTRY_DSN;
    delete process.env.NEXT_PUBLIC_SENTRY_DSN;
  });

  describe('captureServerError', () => {
    it('logs to console when no DSN configured', () => {
      captureServerError(new Error('test'), { route: '/api/test' });
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[server-error]',
        { route: '/api/test' },
        expect.any(Error)
      );
    });

    it('logs sentry-placeholder when DSN is set', () => {
      process.env.SENTRY_DSN = 'https://fake@sentry.io/123';
      captureServerError(new Error('test'));
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[sentry-placeholder]',
        {},
        expect.any(Error)
      );
    });

    it('uses NEXT_PUBLIC_SENTRY_DSN as fallback', () => {
      process.env.NEXT_PUBLIC_SENTRY_DSN = 'https://fake@sentry.io/456';
      captureServerError(new Error('test'));
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[sentry-placeholder]',
        {},
        expect.any(Error)
      );
    });

    it('never throws', () => {
      expect(() => captureServerError(null)).not.toThrow();
      expect(() => captureServerError(undefined)).not.toThrow();
      expect(() => captureServerError('string error')).not.toThrow();
    });
  });

  describe('captureClientError', () => {
    it('logs to console when no DSN configured', () => {
      captureClientError(new Error('ui crash'), { component: 'App' });
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[client-error]',
        { component: 'App' },
        expect.any(Error)
      );
    });

    it('never throws', () => {
      expect(() => captureClientError(null)).not.toThrow();
    });
  });
});
