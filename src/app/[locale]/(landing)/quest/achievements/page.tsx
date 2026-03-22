import { getTranslations, setRequestLocale } from 'next-intl/server';

import { getThemePage } from '@/core/theme';
import { AchievementWall } from '@/shared/blocks/quest';
import { getMetadata } from '@/shared/lib/seo';
import { DynamicPage } from '@/shared/types/blocks/landing';

export const revalidate = 60;

export const generateMetadata = getMetadata({
  metadataKey: 'quest.achievements.metadata_title',
  canonicalUrl: '/quest/achievements',
});

export default async function AchievementsPage({
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
        title: t('achievements.title'),
        description: t('achievements.description'),
      },
      achievements: {
        component: <AchievementWall />,
      },
      cta: tl.raw('cta'),
    },
  };

  const Page = await getThemePage('dynamic-page');

  return <Page locale={locale} page={page} />;
}
