import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { findUpgGenerationById } from '@/shared/models/upg_generation';
import { EmbedWatermark } from '@/shared/blocks/gallery/embed-watermark';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  return {
    title: 'Embedded Visualization',
    robots: 'noindex',
  };
}

export default async function EmbedPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const generation = await findUpgGenerationById(id);

  // Only public generations can be embedded
  if (!generation || !generation.isPublic || !generation.htmlContent) {
    notFound();
  }

  return (
    <div className="relative w-full h-screen bg-background">
      <iframe
        srcDoc={generation.htmlContent}
        className="w-full h-full border-0"
        sandbox="allow-scripts allow-same-origin"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        title={generation.prompt}
      />
      <EmbedWatermark id={id} />
    </div>
  );
}
