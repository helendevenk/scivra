import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import { getExperimentBySlug } from '@/shared/lib/experiments/registry';
import { getLocalizedPath } from '@/shared/lib/seo';

import {
  getPublishedPathBySlug,
  getNodeByPathAndOrder,
  checkNodeAccess,
} from '@/shared/models/learning_path';
import { getUserInfo } from '@/shared/models/user';
import { NodeLearning, NodePaywall } from '@/shared/blocks/learning-path';

interface Props {
  params: Promise<{ locale: string; slug: string; orderIndex: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, orderIndex: orderStr, locale } = await params;
  const orderIndex = parseInt(orderStr, 10);
  if (isNaN(orderIndex)) return {};

  const path = await getPublishedPathBySlug(slug);
  if (!path) return {};

  const node = await getNodeByPathAndOrder(path.id, orderIndex);
  if (!node) return {};

  return {
    title: node.titleEn,
    description: node.descriptionEn,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function NodePage({ params }: Props) {
  const { locale, slug, orderIndex: orderStr } = await params;
  setRequestLocale(locale);

  const orderIndex = parseInt(orderStr, 10);
  if (isNaN(orderIndex) || orderIndex < 0) notFound();

  const path = await getPublishedPathBySlug(slug);
  if (!path) notFound();

  const node = await getNodeByPathAndOrder(path.id, orderIndex);
  if (!node) notFound();

  const user = await getUserInfo();
  const access = await checkNodeAccess(orderIndex, user);
  const experiment = node.experimentSlug
    ? getExperimentBySlug(node.experimentSlug)
    : undefined;
  const experimentHref = experiment
    ? getLocalizedPath(
        `/labs/${experiment.subject}/${experiment.primaryStandard}/${experiment.slug}`,
        locale
      )
    : undefined;

  if (!access.allowed) {
    return <NodePaywall reason={access.reason!} />;
  }

  return (
    <NodeLearning
      node={node}
      path={path}
      experimentHref={experimentHref}
      locale={locale}
    />
  );
}
