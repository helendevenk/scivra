import { setRequestLocale } from 'next-intl/server';

import { getMetadata } from '@/shared/lib/seo';
import { DashboardClient } from '@/shared/blocks/dashboard/dashboard-client';

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

  return <DashboardClient />;
}
