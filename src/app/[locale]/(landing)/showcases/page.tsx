import { getTranslations, setRequestLocale } from 'next-intl/server';

import { getThemePage } from '@/core/theme';
import {
  getAbsoluteUrl,
  getLocalizedPath,
  getMetadata,
  getSiteUrl,
} from '@/shared/lib/seo';
import {
  buildBreadcrumbJsonLd,
  buildWebPageJsonLd,
  serializeJsonLd,
} from '@/shared/lib/seo/json-ld';
import { DynamicPage } from '@/shared/types/blocks/landing';

export const revalidate = 3600;

export const generateMetadata = getMetadata({
  metadataKey: 'showcases.metadata',
  canonicalUrl: '/showcases',
});

export default async function ShowcasesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // load landing data
  const tl = await getTranslations('landing');

  // load showcases data
  const t = await getTranslations('showcases');

  const page: DynamicPage = {
    sections: {
      showcases: t.raw('showcases'),
      cta: tl.raw('cta'),
    },
  };

  // load page component
  const Page = await getThemePage('dynamic-page');

  const siteUrl = getSiteUrl();
  const showcasesUrl = getAbsoluteUrl(getLocalizedPath('/showcases', locale));
  const tMeta = await getTranslations('showcases.metadata');

  const webPageJsonLd = buildWebPageJsonLd({
    name: tMeta('title'),
    description: tMeta('description'),
    url: showcasesUrl,
    siteUrl,
    siteName: 'Scivra',
    locale,
  });

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', url: siteUrl },
    { name: 'Showcases', url: showcasesUrl },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(webPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />
      <Page locale={locale} page={page} />
    </>
  );
}
