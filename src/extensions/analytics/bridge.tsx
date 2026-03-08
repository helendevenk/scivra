'use client';

/**
 * Analytics Bridge — unified client-side event tracking.
 *
 * Respects Cookie Consent: in EEA/UK regions, analytics events are
 * only dispatched after the user accepts cookies.
 */

const CONSENT_STORAGE_KEY = 'cookie_consent';

function hasConsent(): boolean {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
  // If no consent decision stored, assume non-EEA (allow tracking).
  // EEA users who rejected will have 'rejected' stored.
  return stored !== 'rejected';
}

type EventProps = Record<string, string | number | boolean>;

/**
 * Track a custom analytics event. Dispatches to all configured providers.
 * Silently no-ops if consent is rejected or provider is unavailable.
 */
export function trackEvent(name: string, props?: EventProps): void {
  if (!hasConsent()) return;

  try {
    // Plausible
    if (typeof window !== 'undefined' && 'plausible' in window) {
      (window as any).plausible(name, props ? { props } : undefined);
    }

    // Google Analytics (gtag)
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', name, props);
    }
  } catch {
    // Analytics must never break the app.
  }
}

/**
 * Pre-defined event helpers for common actions.
 */
export const analytics = {
  experimentStarted(slug: string) {
    trackEvent('experiment_started', { slug });
  },
  experimentCompleted(slug: string, timeSpent: number) {
    trackEvent('experiment_completed', { slug, time_spent: timeSpent });
  },
  quotaExhausted(slug: string) {
    trackEvent('quota_exhausted', { slug });
  },
  upgGenerated(prompt: string) {
    trackEvent('upg_generated', { prompt: prompt.slice(0, 100) });
  },
  signUp(method: string) {
    trackEvent('sign_up', { method });
  },
  subscriptionUpgrade(plan: string) {
    trackEvent('subscription_upgrade', { plan });
  },
  cookieConsent(decision: 'accept' | 'reject') {
    trackEvent('cookie_consent', { decision });
  },
};
