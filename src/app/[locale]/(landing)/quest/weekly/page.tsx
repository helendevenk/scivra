import { getTranslations, setRequestLocale } from 'next-intl/server';

import { getThemePage } from '@/core/theme';
import { WeeklyChallenge } from '@/shared/blocks/quest';
import { getMetadata } from '@/shared/lib/seo';
import { DynamicPage } from '@/shared/types/blocks/landing';

export const revalidate = 60;

export const generateMetadata = getMetadata({
  metadataKey: 'quest.weekly.metadata_title',
  canonicalUrl: '/quest/weekly',
});

export default async function WeeklyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('quest');
  const tl = await getTranslations('landing');

  const page: DynamicPage = {
    sections: {
      hero: {
        title: t('weekly.title'),
        description: t('weekly.description'),
      },
      weekly: {
        component: <WeeklyChallenge />,
      },
      cta: tl.raw('cta'),
    },
  };

  const Page = await getThemePage('dynamic-page');

  return <Page locale={locale} page={page} />;
}
