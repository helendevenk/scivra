import * as Sentry from '@sentry/nextjs';

type ErrorContext = Record<string, unknown>;

function getSentryDsn(): string | null {
  const dsn =
    process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN ?? null;
  return dsn?.trim() || null;
}

export function captureServerError(
  error: unknown,
  context: ErrorContext = {}
): void {
  try {
    const dsn = getSentryDsn();
    if (!dsn) {
      console.error('[server-error]', context, error);
      return;
    }
    Sentry.captureException(error, { extra: context });
  } catch {
    console.error('[sentry-fallback]', error);
  }
}

export function captureClientError(
  error: unknown,
  context: ErrorContext = {}
): void {
  try {
    const dsn = getSentryDsn();
    if (!dsn) {
      console.error('[client-error]', context, error);
      return;
    }
    Sentry.captureException(error, { extra: context });
  } catch {
    console.error('[sentry-fallback]', error);
  }
}
