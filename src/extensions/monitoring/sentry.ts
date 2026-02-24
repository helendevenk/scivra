/**
 * Sentry error monitoring integration.
 *
 * MVP placeholder — logs to console when SENTRY_DSN is not configured.
 * Replace the placeholder branch with @sentry/nextjs once the SDK is installed.
 */

type ErrorContext = Record<string, unknown>;

function getSentryDsn(): string | null {
  const dsn =
    process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN ?? null;
  return dsn?.trim() || null;
}

/**
 * Capture a server-side error. Safe to call from API routes, server actions,
 * and middleware — never throws.
 */
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

    // TODO: Replace with Sentry.captureException(error, { extra: context })
    // once @sentry/nextjs is installed and configured.
    console.error('[sentry-placeholder]', context, error);
  } catch {
    // Monitoring must never break the app.
    console.error('[sentry-fallback]', error);
  }
}

/**
 * Capture a client-side error. Safe to call from React error boundaries
 * and event handlers — never throws.
 */
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

    // TODO: Replace with Sentry.captureException(error, { extra: context })
    console.error('[sentry-placeholder]', context, error);
  } catch {
    console.error('[sentry-fallback]', error);
  }
}
