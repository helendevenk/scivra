import { getTranslations, setRequestLocale } from 'next-intl/server';

import { getThemePage } from '@/core/theme';
import { ApQuestionWorkspace } from '@/shared/blocks/ap-prep';
import { getMetadata } from '@/shared/lib/seo';
import { DynamicPage } from '@/shared/types/blocks/landing';

export const generateMetadata = getMetadata({
  metadataKey: 'ap-prep.metadata',
  canonicalUrl: '/ap-prep',
});

export default async function QuestionWorkspacePage({
  params,
}: {
  params: Promise<{
    locale: string;
    examSlug: string;
    unitSlug: string;
    questionId: string;
  }>;
}) {
  const { locale, examSlug, unitSlug, questionId } = await params;
  setRequestLocale(locale);

  const tl = await getTranslations('landing');

  const page: DynamicPage = {
    sections: {
      content: {
        component: (
          <ApQuestionWorkspace
            questionId={questionId}
            examSlug={examSlug}
            unitSlug={unitSlug}
          />
        ),
      },
      cta: tl.raw('cta'),
    },
  };

  const Page = await getThemePage('dynamic-page');

  return <Page locale={locale} page={page} />;
}
