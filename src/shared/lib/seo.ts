import { getTranslations, setRequestLocale } from 'next-intl/server';

import { envConfigs } from '@/config';
import { defaultLocale, locales } from '@/config/locale';

function normalizePath(path: string) {
  if (!path) {
    return '/';
  }

  if (!path.startsWith('/')) {
    return `/${path}`;
  }

  return path;
}

export function getLocalizedPath(path: string, locale: string) {
  const normalizedPath = normalizePath(path);
  const prefix =
    !locale || locale === defaultLocale ? '' : `/${locale}`;

  if (normalizedPath === '/') {
    return prefix || '/';
  }

  return `${prefix}${normalizedPath}`;
}

export function getAbsoluteUrl(path: string) {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  return `${envConfigs.app_url}${normalizePath(path)}`;
}

export function getPageAlternates(path: string, locale: string) {
  const normalizedPath = normalizePath(path);

  return {
    canonical: getAbsoluteUrl(getLocalizedPath(normalizedPath, locale)),
    languages: Object.fromEntries([
      ...locales.map((supportedLocale) => [
        supportedLocale,
        getAbsoluteUrl(getLocalizedPath(normalizedPath, supportedLocale)),
      ]),
      ['x-default', getAbsoluteUrl(getLocalizedPath(normalizedPath, defaultLocale))],
    ]),
  };
}

export function normalizeSeoText(value?: string | null) {
  if (!value) {
    return '';
  }

  const appName = envConfigs.app_name || 'Scivra';
  const appHost = envConfigs.app_url
    .replace(/^https?:\/\//, '')
    .replace(/\/$/, '');

  return value
    .replace(/NeonPhysics/g, appName)
    .replace(/neonphysics\.com/gi, appHost);
}

// get metadata for page component
export function getMetadata(
  options: {
    title?: string;
    description?: string;
    keywords?: string;
    metadataKey?: string;
    canonicalUrl?: string; // relative path or full url
    imageUrl?: string;
    appName?: string;
    noIndex?: boolean;
  } = {}
) {
  return async function generateMetadata({
    params,
  }: {
    params: Promise<{ locale: string }>;
  }) {
    const { locale } = await params;
    setRequestLocale(locale);

    // passed metadata
    const passedMetadata = {
      title: options.title,
      description: options.description,
      keywords: options.keywords,
    };

    // default metadata
    const defaultMetadata = await getTranslatedMetadata(
      defaultMetadataKey,
      locale
    );

    // translated metadata
    let translatedMetadata: {
      title?: string;
      description?: string;
      keywords?: string;
    } = {};
    if (options.metadataKey) {
      translatedMetadata = await getTranslatedMetadata(
        options.metadataKey,
        locale
      );
    }

    // canonical url
    const alternates = await getCanonicalAlternates(
      options.canonicalUrl || '',
      locale || ''
    );
    const canonicalUrl = alternates.canonical;

    const title =
      passedMetadata.title || translatedMetadata.title || defaultMetadata.title;
    const description =
      passedMetadata.description ||
      translatedMetadata.description ||
      defaultMetadata.description;

    // image url
    let imageUrl = options.imageUrl || '/logo.png';
    if (imageUrl.startsWith('http')) {
      imageUrl = imageUrl;
    } else {
      imageUrl = `${envConfigs.app_url}${imageUrl}`;
    }

    // app name
    let appName = options.appName;
    if (!appName) {
      appName = envConfigs.app_name || '';
    }

    return {
      metadataBase: new URL(envConfigs.app_url),
      title:
        passedMetadata.title ||
        translatedMetadata.title ||
        defaultMetadata.title,
      description:
        passedMetadata.description ||
        translatedMetadata.description ||
        defaultMetadata.description,
      keywords:
        passedMetadata.keywords ||
        translatedMetadata.keywords ||
        defaultMetadata.keywords,
      alternates,

      openGraph: {
        type: 'website',
        locale: locale,
        url: canonicalUrl,
        title,
        description,
        siteName: appName,
        images: [imageUrl.toString()],
      },

      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl.toString()],
      },

      robots: {
        index: options.noIndex ? false : true,
        follow: options.noIndex ? false : true,
      },
    };
  };
}

const defaultMetadataKey = 'common.metadata';

async function getTranslatedMetadata(metadataKey: string, locale: string) {
  setRequestLocale(locale);
  const t = await getTranslations(metadataKey);

  return {
    title: t.has('title') ? t('title') : '',
    description: t.has('description') ? t('description') : '',
    keywords: t.has('keywords') ? t('keywords') : '',
  };
}

async function getCanonicalAlternates(canonicalUrl: string, locale: string) {
  if (!canonicalUrl) {
    canonicalUrl = '/';
  }

  if (canonicalUrl.startsWith('http://') || canonicalUrl.startsWith('https://')) {
    return {
      canonical: canonicalUrl,
    };
  }

  return getPageAlternates(canonicalUrl, locale);
}
