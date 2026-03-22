import { getTranslations, setRequestLocale } from 'next-intl/server';

import { getThemePage } from '@/core/theme';
import { ApQuestionList } from '@/shared/blocks/ap-prep';
import { getMetadata } from '@/shared/lib/seo';
import { DynamicPage } from '@/shared/types/blocks/landing';

export const generateMetadata = getMetadata({
  metadataKey: 'ap-prep.metadata',
  canonicalUrl: '/ap-prep',
});

export default async function UnitQuestionsPage({
  params,
}: {
  params: Promise<{ locale: string; examSlug: string; unitSlug: string }>;
}) {
  const { locale, examSlug, unitSlug } = await params;
  setRequestLocale(locale);

  const tl = await getTranslations('landing');

  const page: DynamicPage = {
    sections: {
      content: {
        component: <ApQuestionList examSlug={examSlug} unitSlug={unitSlug} />,
      },
      cta: tl.raw('cta'),
    },
  };

  const Page = await getThemePage('dynamic-page');

  return <Page locale={locale} page={page} />;
}
