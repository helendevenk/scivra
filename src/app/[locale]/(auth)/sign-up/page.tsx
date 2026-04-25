import { getTranslations } from 'next-intl/server';

import { envConfigs } from '@/config';
import { getAbsoluteUrl, getLocalizedPath } from '@/shared/lib/seo';
import { SignUp } from '@/shared/blocks/sign/sign-up';
import { getConfigs } from '@/shared/models/config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const t = await getTranslations('common');

  return {
    title: `${t('sign.sign_up_title')} - ${t('metadata.title')}`,
    alternates: {
      canonical: getAbsoluteUrl(getLocalizedPath('/sign-up', locale)),
    },
  };
}

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  const configs = await getConfigs();

  return <SignUp configs={configs} callbackUrl={callbackUrl || '/'} />;
}
