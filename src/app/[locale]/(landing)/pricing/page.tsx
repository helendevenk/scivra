import { getTranslations, setRequestLocale } from 'next-intl/server';

import { getThemePage } from '@/core/theme';
import {
  getAbsoluteUrl,
  getLocalizedPath,
  getMetadata,
  getSiteUrl,
} from '@/shared/lib/seo';
import { buildFaqPageJsonLd, serializeJsonLd } from '@/shared/lib/seo/json-ld';
import { getCurrentSubscription } from '@/shared/models/subscription';
import { getUserInfo } from '@/shared/models/user';
import { DynamicPage } from '@/shared/types/blocks/landing';

interface PricingItemTranslation {
  title?: string;
  description?: string;
  amount?: number;
  currency?: string;
  interval?: string;
  unit?: string;
}

export const revalidate = 3600;

export const generateMetadata = getMetadata({
  metadataKey: 'pricing.metadata',
  canonicalUrl: '/pricing',
});

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // get current subscription
  let currentSubscription;
  try {
    const user = await getUserInfo();
    if (user) {
      currentSubscription = await getCurrentSubscription(user.id);
    }
  } catch (error) {
    console.log('getting current subscription failed:', error);
  }

  // get pricing data
  const t = await getTranslations('pricing');

  // get landing data
  const tl = await getTranslations('landing');

  // build page sections
  const page: DynamicPage = {
    sections: {
      pricing: {
        block: 'pricing',
        data: {
          pricing: t.raw('pricing'),
          currentSubscription,
        },
      },
      faq: tl.raw('faq'),
      testimonials: tl.raw('testimonials'),
    },
  };

  // load page component
  const Page = await getThemePage('dynamic-page');

  const siteUrl = getSiteUrl();
  const pricingUrl = getAbsoluteUrl(getLocalizedPath('/pricing', locale));

  const pricingData = t.raw('pricing') as { items?: PricingItemTranslation[] } | null;
  const pricingItems = (pricingData?.items ?? []).filter(
    (item): item is PricingItemTranslation =>
      Boolean(item && (item.amount !== undefined || item.unit))
  );

  const offers = pricingItems
    .map((item) => {
      const cents = typeof item.amount === 'number' ? item.amount : null;
      if (cents === null) return null;
      const dollars = (cents / 100).toFixed(2);
      return {
        '@type': 'Offer',
        name: item.title ?? 'Scivra plan',
        description: item.description ?? '',
        price: dollars,
        priceCurrency: item.currency ?? 'USD',
        category: item.interval === 'year' ? 'AnnualSubscription' : 'MonthlySubscription',
        url: pricingUrl,
        availability: 'https://schema.org/InStock',
      };
    })
    .filter((offer): offer is NonNullable<typeof offer> => offer !== null);

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Scivra — Interactive Science Labs',
    description:
      'Interactive 3D virtual labs for K-12 science. Free, Pro, and Max subscription plans aligned with NGSS, AP, and GCSE.',
    brand: { '@type': 'Brand', name: 'Scivra' },
    url: pricingUrl,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: '0.00',
      highPrice: offers.length
        ? Math.max(...offers.map((o) => Number(o.price))).toFixed(2)
        : '9.99',
      offerCount: offers.length || 3,
      offers,
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Pricing', item: pricingUrl },
    ],
  };

  const faqSection = tl.raw('faq') as
    | { items?: Array<{ question: string; answer: string }> }
    | null;
  const faqJsonLd = buildFaqPageJsonLd(faqSection?.items);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(productJsonLd) }}
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
