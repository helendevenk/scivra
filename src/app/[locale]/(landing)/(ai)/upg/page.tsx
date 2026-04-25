import { getTranslations, setRequestLocale } from 'next-intl/server';

import { getThemePage } from '@/core/theme';
import { UpgGenerator, UpgHero } from '@/shared/blocks/upg';
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

  return <Page locale={locale} page={page} />;
}
