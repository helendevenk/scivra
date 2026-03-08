'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Link } from '@/core/i18n/navigation';

type PaywallGateProps = {
  isVisible: boolean;
  isLoggedIn: boolean;
  onClose?: () => void;
};

export function PaywallGate({
  isVisible,
  isLoggedIn,
  onClose,
}: PaywallGateProps) {
  const t = useTranslations('common.paywall');

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <Card className="relative w-full max-w-md mx-4">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <CardHeader className="text-center">
          <Badge variant="destructive" className="mx-auto mb-2 w-fit">
            {t('badge')}
          </Badge>
          <CardTitle className="text-lg">{t('title')}</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">{t('description')}</p>
          <Button asChild className="w-full">
            <Link href="/pricing">{t('upgrade')}</Link>
          </Button>
          {!isLoggedIn && (
            <Button asChild variant="outline" className="w-full">
              <Link href="/sign-in">{t('sign_in')}</Link>
            </Button>
          )}
          <p className="text-xs text-muted-foreground">{t('reset_hint')}</p>
        </CardContent>
      </Card>
    </div>
  );
}
