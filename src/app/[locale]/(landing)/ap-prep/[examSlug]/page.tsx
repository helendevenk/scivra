import { getTranslations, setRequestLocale } from 'next-intl/server';

import { getThemePage } from '@/core/theme';
import { ApUnitList } from '@/shared/blocks/ap-prep';
import { getMetadata } from '@/shared/lib/seo';
import { DynamicPage } from '@/shared/types/blocks/landing';

export const generateMetadata = getMetadata({
  metadataKey: 'ap-prep.metadata',
  canonicalUrl: '/ap-prep',
});

export default async function ExamDetailPage({
  params,
}: {
  params: Promise<{ locale: string; examSlug: string }>;
}) {
  const { locale, examSlug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('ap-prep');
  const tl = await getTranslations('landing');

  const page: DynamicPage = {
    sections: {
      content: {
        component: <ApUnitList examSlug={examSlug} />,
      },
      cta: tl.raw('cta'),
    },
  };

  const Page = await getThemePage('dynamic-page');

  return <Page locale={locale} page={page} />;
}
