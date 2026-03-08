'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';

import { Button } from '@/shared/components/ui/button';

type ConsentStatus = 'pending' | 'accepted' | 'rejected';

const CONSENT_STORAGE_KEY = 'cookie_consent';

function isEEARegion(): boolean {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return tz.startsWith('Europe/');
  } catch {
    return true;
  }
}

async function recordConsent(eventType: 'cookie_accept' | 'cookie_reject') {
  try {
    await fetch('/api/compliance/consent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType,
        policyVersion: '1.0',
        regionCode: Intl.DateTimeFormat().resolvedOptions().timeZone,
      }),
    });
  } catch {
    // 静默失败，不阻塞用户体验
  }
}

export function CookieConsentBanner() {
  const t = useTranslations('common.cookie_consent');
  const [status, setStatus] = useState<ConsentStatus>('pending');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (stored === 'accepted' || stored === 'rejected') {
      setStatus(stored);
      return;
    }
    if (isEEARegion()) {
      setVisible(true);
    }
  }, []);

  const handleAccept = useCallback(() => {
    localStorage.setItem(CONSENT_STORAGE_KEY, 'accepted');
    setStatus('accepted');
    setVisible(false);
    recordConsent('cookie_accept');
  }, []);

  const handleReject = useCallback(() => {
    localStorage.setItem(CONSENT_STORAGE_KEY, 'rejected');
    setStatus('rejected');
    setVisible(false);
    recordConsent('cookie_reject');
  }, []);

  if (!visible || status !== 'pending') return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4"
      role="banner"
      aria-label="Cookie consent"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {t('message')}{' '}
          <a
            href="/cookie-policy"
            className="underline hover:text-foreground transition-colors"
          >
            {t('policy_link')}
          </a>
          .
        </p>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" onClick={handleReject}>
            {t('reject')}
          </Button>
          <Button size="sm" onClick={handleAccept}>
            {t('accept')}
          </Button>
        </div>
      </div>
    </div>
  );
}
