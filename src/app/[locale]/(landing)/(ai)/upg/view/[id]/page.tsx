import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { getUserInfo } from '@/shared/models/user';

import { findUpgGenerationById } from '@/shared/models/upg_generation';
import { UpgViewClient } from './client';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  const generation = await findUpgGenerationById(id);
  if (!generation) {
    return { title: 'Not Found' };
  }

  return {
    title: `${generation.prompt} - UPG`,
    description: `Interactive visualization: ${generation.prompt}`,
  };
}

export default async function UpgViewPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const generation = await findUpgGenerationById(id);
  if (!generation || !generation.htmlContent) {
    notFound();
  }

  const user = await getUserInfo();
  const isOwner = user?.id === generation.userId;

  return (
    <UpgViewClient
      id={generation.id}
      prompt={generation.prompt}
      htmlContent={generation.htmlContent}
      isPublic={generation.isPublic ?? false}
      isOwner={isOwner}
      language={(generation.language as 'zh' | 'en') || 'en'}
      isLoggedIn={!!user}
    />
  );
}
