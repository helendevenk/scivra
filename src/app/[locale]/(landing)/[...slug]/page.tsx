import { notFound, permanentRedirect } from 'next/navigation';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';

import { getThemePage } from '@/core/theme';
import { envConfigs } from '@/config';
import { getAbsoluteUrl, getLocalizedPath, getSiteUrl } from '@/shared/lib/seo';
import {
  buildBreadcrumbJsonLd,
  buildWebPageJsonLd,
  serializeJsonLd,
} from '@/shared/lib/seo/json-ld';
import { getLocalPage } from '@/shared/models/post';

const STATIC_BREADCRUMB_LABELS: Record<string, string> = {
  'children-privacy': "Children's Privacy",
  'cookie-policy': 'Cookie Policy',
  'data-deletion': 'Data Deletion',
  about: 'About',
  contact: 'Contact',
};

function humanize(slug: string) {
  return STATIC_BREADCRUMB_LABELS[slug] ??
    slug
      .split('-')
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ');
}

export const revalidate = 3600;

function getLegacyLocaleRedirectPath(slug: string, locale: string) {
  if (slug === 'en' || slug === 'zh') {
    return getLocalizedPath('/', locale);
  }

  if (slug.startsWith('en/') || slug.startsWith('zh/')) {
    const normalizedSlug = slug.split('/').slice(1).join('/');
    return getLocalizedPath(`/${normalizedSlug}`, locale);
  }

  return null;
}

function getNestedValue(
  obj: Record<string, unknown>,
  path: string[]
): Record<string, unknown> | null {
  let current: unknown = obj;

  for (const segment of path) {
    if (
      !current ||
      typeof current !== 'object' ||
      !(segment in current)
    ) {
      return null;
    }

    current = (current as Record<string, unknown>)[segment];
  }

  return current && typeof current === 'object'
    ? (current as Record<string, unknown>)
    : null;
}

// dynamic page metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  // metadata values
  let title = '';
  let description = '';
  let canonicalUrl = '';

  // 1. try to get static page metadata from
  // content/pages/**/*.mdx

  // static page slug
  const staticPageSlug =
    typeof slug === 'string' ? slug : (slug as string[]).join('/') || '';

  // filter invalid slug
  if (staticPageSlug.includes('.')) {
    return;
  }

  const redirectPath = getLegacyLocaleRedirectPath(staticPageSlug, locale);
  if (redirectPath) {
    return {
      alternates: {
        canonical: getAbsoluteUrl(redirectPath),
      },
    };
  }

  // build canonical url
  canonicalUrl =
    getAbsoluteUrl(getLocalizedPath(`/${staticPageSlug}`, locale));

  // get static page content
  const staticPage = await getLocalPage({ slug: staticPageSlug, locale });

  // return static page metadata
  if (staticPage) {
    title = staticPage.title || '';
    description = staticPage.description || '';

    return {
      title,
      description,
      alternates: {
        canonical: canonicalUrl,
      },
    };
  }

  // 2. static page not found, try to get dynamic page metadata from
  // src/config/locale/messages/{locale}/pages/**/*.json

  // dynamic page slug
  const dynamicPageSlug =
    typeof slug === 'string' ? slug : (slug as string[]).join('.') || '';
  const messages = await getMessages({ locale });
  const pageMessages = getNestedValue(messages as Record<string, unknown>, [
    'pages',
    ...dynamicPageSlug.split('.'),
  ]);

  // return dynamic page metadata
  const metadata = getNestedValue(pageMessages ?? {}, ['metadata']);
  if (metadata) {
    title = typeof metadata.title === 'string' ? metadata.title : '';
    description =
      typeof metadata.description === 'string'
        ? metadata.description
        : '';

    return {
      title,
      description,
      alternates: {
        canonical: canonicalUrl,
      },
    };
  }

  // 3. return common metadata
  const tc = await getTranslations('common.metadata');

  title = tc('title');
  description = tc('description');

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  // 1. try to get static page from
  // content/pages/**/*.mdx

  // static page slug
  const staticPageSlug =
    typeof slug === 'string' ? slug : (slug as string[]).join('/') || '';

  // filter invalid slug
  if (staticPageSlug.includes('.')) {
    return notFound();
  }

  const redirectPath = getLegacyLocaleRedirectPath(staticPageSlug, locale);
  if (redirectPath) {
    permanentRedirect(redirectPath);
  }

  // get static page content
  const staticPage = await getLocalPage({ slug: staticPageSlug, locale });

  const siteUrl = getSiteUrl();
  const pageUrl = getAbsoluteUrl(getLocalizedPath(`/${staticPageSlug}`, locale));
  const pageLabel = staticPage?.title || humanize(staticPageSlug);

  // return static page
  if (staticPage) {
    const Page = await getThemePage('static-page');

    const webPageJsonLd = buildWebPageJsonLd({
      name: pageLabel,
      description: staticPage.description ?? '',
      url: pageUrl,
      siteUrl,
      siteName: 'Scivra',
      locale,
    });

    const breadcrumbJsonLd = buildBreadcrumbJsonLd([
      { name: 'Home', url: siteUrl },
      { name: pageLabel, url: pageUrl },
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
        <Page locale={locale} post={staticPage} />
      </>
    );
  }

  // 2. static page not found
  // try to get dynamic page content from
  // src/config/locale/messages/{locale}/pages/**/*.json

  // dynamic page slug
  const dynamicPageSlug =
    typeof slug === 'string' ? slug : (slug as string[]).join('.') || '';
  const messages = await getMessages({ locale });
  const pageMessages = getNestedValue(messages as Record<string, unknown>, [
    'pages',
    ...dynamicPageSlug.split('.'),
  ]);

  // return dynamic page
  const pageData = getNestedValue(pageMessages ?? {}, ['page']);
  if (pageData) {
    const Page = await getThemePage('dynamic-page');

    const dynamicPageMetadata = getNestedValue(pageMessages ?? {}, ['metadata']);
    const dynamicTitle =
      typeof dynamicPageMetadata?.title === 'string'
        ? dynamicPageMetadata.title
        : humanize(dynamicPageSlug);
    const dynamicDesc =
      typeof dynamicPageMetadata?.description === 'string'
        ? dynamicPageMetadata.description
        : '';

    const webPageJsonLd = buildWebPageJsonLd({
      name: dynamicTitle,
      description: dynamicDesc,
      url: pageUrl,
      siteUrl,
      siteName: 'Scivra',
      locale,
    });

    const breadcrumbJsonLd = buildBreadcrumbJsonLd([
      { name: 'Home', url: siteUrl },
      { name: dynamicTitle, url: pageUrl },
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
        <Page locale={locale} page={pageData} />
      </>
    );
  }

  // 3. page not found
  return notFound();
}
