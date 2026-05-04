import { setRequestLocale } from 'next-intl/server';

import { GalleryDetailClient } from '@/shared/blocks/gallery/gallery-detail';
import { LandingAppShell } from '@/shared/components/layout/landing-app-shell';
import { getMetadata } from '@/shared/lib/seo';

export const generateMetadata = getMetadata({
  noIndex: true,
});

export default async function GalleryDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return (
    <LandingAppShell>
      <GalleryDetailClient id={id} />
    </LandingAppShell>
  );
}
