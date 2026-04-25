import { setRequestLocale } from 'next-intl/server';

import { GalleryDetailClient } from '@/shared/blocks/gallery/gallery-detail';
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

  return <GalleryDetailClient id={id} />;
}
