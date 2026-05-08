import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as Sentry from '@sentry/nextjs';
import { captureServerError, captureClientError } from '@/extensions/monitoring/sentry';

vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn(),
}));

describe('sentry monitoring', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;
  const captureExceptionMock = vi.mocked(Sentry.captureException);

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    captureExceptionMock.mockClear();
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
      expect(captureExceptionMock).not.toHaveBeenCalled();
    });

    it('captures exception when SENTRY_DSN is set', () => {
      const error = new Error('test');
      process.env.SENTRY_DSN = 'https://fake@sentry.io/123';
      captureServerError(error);
      expect(captureExceptionMock).toHaveBeenCalledWith(error, { extra: {} });
      expect(consoleErrorSpy).not.toHaveBeenCalled();
    });

    it('uses NEXT_PUBLIC_SENTRY_DSN as fallback', () => {
      const error = new Error('test');
      process.env.NEXT_PUBLIC_SENTRY_DSN = 'https://fake@sentry.io/456';
      captureServerError(error);
      expect(captureExceptionMock).toHaveBeenCalledWith(error, { extra: {} });
      expect(consoleErrorSpy).not.toHaveBeenCalled();
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
      expect(captureExceptionMock).not.toHaveBeenCalled();
    });

    it('never throws', () => {
      expect(() => captureClientError(null)).not.toThrow();
    });
  });
});
