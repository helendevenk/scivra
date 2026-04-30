import { getTranslations, setRequestLocale } from 'next-intl/server';

import { getThemePage } from '@/core/theme';
import { UpgGenerator, UpgHero } from '@/shared/blocks/upg';
import {
  getAbsoluteUrl,
  getLocalizedPath,
  getMetadata,
  getSiteUrl,
} from '@/shared/lib/seo';
import {
  buildBreadcrumbJsonLd,
  buildFaqPageJsonLd,
  buildSoftwareApplicationJsonLd,
  serializeJsonLd,
} from '@/shared/lib/seo/json-ld';
import { DynamicPage } from '@/shared/types/blocks/landing';

export const revalidate = 3600;

export const generateMetadata = getMetadata({
  metadataKey: 'upg.metadata',
  canonicalUrl: '/upg',
});

export default async function UpgPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('upg');

  const tl = await getTranslations('landing');

  const page: DynamicPage = {
    sections: {
      // key deliberately not "hero" — dynamic-page.tsx has a dedicated `case 'hero'`
      // that renders the default Hero block and ignores section.component.
      // Using a non-reserved key routes through the `default` case which honors component.
      upg_hero: {
        component: <UpgHero />,
      },
      generator: {
        component: (
          <UpgGenerator
            srOnlyTitle={t('hero.title')}
          />
        ),
      },
      faq: t.raw('faq'),
      cta: tl.raw('cta'),
    },
  };

  const Page = await getThemePage('dynamic-page');

  const siteUrl = getSiteUrl();
  const upgUrl = getAbsoluteUrl(getLocalizedPath('/upg', locale));

  const softwareApplicationJsonLd = buildSoftwareApplicationJsonLd({
    name: 'Scivra UPG — Universal Principle Generator',
    description:
      'Describe any science concept in plain English. Scivra UPG generates an interactive 3D visualization with formulas, knowledge cards, and quizzes.',
    url: upgUrl,
    applicationCategory: 'EducationalApplication',
    priceRange: 'Free / Pro / Max',
  });

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', url: siteUrl },
    { name: 'AI Lab', url: upgUrl },
  ]);

  const faqSection = t.raw('faq') as
    | { items?: Array<{ question: string; answer: string }> }
    | null;
  const faqJsonLd = buildFaqPageJsonLd(faqSection?.items);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(softwareApplicationJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqJsonLd) }}
        />
      )}
      <Page locale={locale} page={page} />
    </>
  );
}
