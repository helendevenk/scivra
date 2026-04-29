import { getTranslations, setRequestLocale } from 'next-intl/server';

import { getThemePage } from '@/core/theme';
import { GalleryList } from '@/shared/blocks/gallery';
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
  metadataKey: 'gallery.metadata',
  canonicalUrl: '/gallery',
});

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('gallery');
  const tl = await getTranslations('landing');

  const page: DynamicPage = {
    sections: {
      hero: {
        title: t('page.title'),
        description: t('page.description'),
      },
      gallery: {
        component: <GalleryList />,
      },
      cta: tl.raw('cta'),
    },
  };

  const Page = await getThemePage('dynamic-page');

  const siteUrl = getSiteUrl();
  const galleryUrl = getAbsoluteUrl(getLocalizedPath('/gallery', locale));

  const webPageJsonLd = buildWebPageJsonLd({
    name: t('page.title'),
    description: t('page.description'),
    url: galleryUrl,
    siteUrl,
    siteName: 'Scivra',
    locale,
  });

  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: 'Home', url: siteUrl },
    { name: 'Gallery', url: galleryUrl },
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
