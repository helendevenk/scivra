import { getTranslations, setRequestLocale } from 'next-intl/server';

import { getThemePage } from '@/core/theme';
import { UpgGenerator } from '@/shared/blocks/upg';
import { getMetadata } from '@/shared/lib/seo';
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
      hero: {
        title: t('hero.title'),
        description: t('hero.description'),
        background_image: {
          src: '/imgs/bg/physics-hero.jpg',
          alt: 'Physics visualization background',
        },
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

  return <Page locale={locale} page={page} />;
}
