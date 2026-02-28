'use client';

import { useTranslations } from 'next-intl';
import { Lock } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Link } from '@/core/i18n/navigation';

interface NodePaywallProps {
  reason: 'login_required' | 'subscription_required';
}

export function NodePaywall({ reason }: NodePaywallProps) {
  const t = useTranslations('learn');

  const isLogin = reason === 'login_required';

  return (
    <div className="mx-auto flex max-w-md items-center justify-center px-4 py-24">
      <Card className="w-full border-neon-cyan/10 bg-surface-dark">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Lock className="h-6 w-6 text-muted-foreground" />
          </div>
          <CardTitle className="text-lg">
            {isLogin
              ? t('paywall.login_title')
              : t('paywall.subscribe_title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            {isLogin
              ? t('paywall.login_description')
              : t('paywall.subscribe_description')}
          </p>
          <Button asChild className="w-full">
            {isLogin ? (
              <Link href="/sign-in">{t('paywall.login_action')}</Link>
            ) : (
              <Link href="/pricing">{t('paywall.subscribe_action')}</Link>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
