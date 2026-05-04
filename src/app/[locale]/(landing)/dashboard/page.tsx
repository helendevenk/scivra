import { setRequestLocale } from 'next-intl/server';

import { DashboardClient } from '@/shared/blocks/dashboard/dashboard-client';
import { LandingAppShell } from '@/shared/components/layout/landing-app-shell';
import { getMetadata } from '@/shared/lib/seo';

export const generateMetadata = getMetadata({
  metadataKey: 'user-dashboard.metadata',
  canonicalUrl: '/dashboard',
});

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <LandingAppShell>
      <DashboardClient />
    </LandingAppShell>
  );
}
