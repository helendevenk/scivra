import { getTranslations, setRequestLocale } from 'next-intl/server';

import { getThemePage } from '@/core/theme';
import {
  buildFaqPageJsonLd,
  buildOrganizationJsonLd,
  buildWebsiteSearchActionJsonLd,
  serializeJsonLd,
} from '@/shared/lib/seo/json-ld';
import { getSiteUrl } from '@/shared/lib/seo';
import { DynamicPage, Section } from '@/shared/types/blocks/landing';

export const revalidate = 3600;

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('landing');

  const showSections = [
    'hero',
    'experiment_showcase',
    'grade_levels',
    'upg_section',
    'stats',
    'testimonials',
    'faq',
    'cta',
  ];

  // build page sections
  const page: DynamicPage = {
    sections: showSections.reduce<Record<string, Section>>((acc, section) => {
      const sectionData = t.raw(section) as Section;
      if (sectionData) {
        acc[section] = sectionData;
      }
      return acc;
    }, {}),
  };

  // load page component
  const Page = await getThemePage('dynamic-page');

  const siteUrl = getSiteUrl();
  const siteName = 'Scivra';

  const websiteJsonLd = buildWebsiteSearchActionJsonLd({ siteUrl, siteName });
  const organizationJsonLd = buildOrganizationJsonLd({ siteUrl, siteName });

  const faqSection = t.raw('faq') as
    | { items?: Array<{ question: string; answer: string }> }
    | null;
  const faqJsonLd = buildFaqPageJsonLd(faqSection?.items);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(organizationJsonLd) }}
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
