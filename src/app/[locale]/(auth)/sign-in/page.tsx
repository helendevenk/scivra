import { getTranslations } from 'next-intl/server';

import { envConfigs } from '@/config';
import { getAbsoluteUrl, getLocalizedPath } from '@/shared/lib/seo';
import { SignIn } from '@/shared/blocks/sign/sign-in';
import { getConfigs } from '@/shared/models/config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const t = await getTranslations('common');

  return {
    title: `${t('sign.sign_in_title')} - ${t('metadata.title')}`,
    alternates: {
      canonical: getAbsoluteUrl(getLocalizedPath('/sign-in', locale)),
    },
  };
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  const configs = await getConfigs();

  return <SignIn configs={configs} callbackUrl={callbackUrl || '/'} />;
}
