import { getTranslations, setRequestLocale } from 'next-intl/server';

import { getThemePage } from '@/core/theme';
import { ApExamList, ApPrepHero } from '@/shared/blocks/ap-prep';
import {
  getAbsoluteUrl,
  getLocalizedPath,
  getMetadata,
  getSiteUrl,
} from '@/shared/lib/seo';
import {
  buildBreadcrumbJsonLd,
  buildWebPageJsonLd,
} from '@/shared/lib/seo/json-ld';
import { DynamicPage } from '@/shared/types/blocks/landing';

export const revalidate = 60;

export const generateMetadata = getMetadata({
  metadataKey: 'ap-prep.metadata',
  canonicalUrl: '/ap-prep',
});

export default async function ApPrepPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const tl = await getTranslations('landing');

  const page: DynamicPage = {
    sections: {
      // key deliberately not "hero" — dynamic-page.tsx has a dedicated `case 'hero'`
      // that renders the default Hero block and ignores section.component.
      // Using a non-reserved key routes through the `default` case which honors component.
      ap_prep_hero: {
        component: <ApPrepHero />,
      },
      exams: {
        component: <ApExamList />,
      },
      cta: tl.raw('cta'),
    },
  };

  const Page = await getThemePage('dynamic-page');

  const siteUrl = getSiteUrl();
  const apPrepUrl = getAbsoluteUrl(getLocalizedPath('/ap-prep', locale));
  const tMeta = await getTranslations('ap-prep.metadata');

  const webPageJsonLd = buildWebPageJsonLd({
    name: tMeta('title'),
    description: tMeta('description'),
    url: apPrepUrl,
    siteUrl,
    siteName: 'Scivra',
    locale,
  });

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', url: siteUrl },
    { name: 'AP Exam Prep', url: apPrepUrl },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Page locale={locale} page={page} />
    </>
  );
}
