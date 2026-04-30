import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

import {
  getPublishedPathBySlug,
  getNodesByPathId,
  getOrCreateProgress,
  checkNodeAccess,
  type QuizQuestion,
} from '@/shared/models/learning_path';
import { getUserInfo } from '@/shared/models/user';
import { LearningPathDetail } from '@/shared/blocks/learning-path';
import { buildLearningPathBasicJsonLd, serializeJsonLd } from '@/shared/lib/seo/json-ld';
import { getPageAlternates, getSiteUrl } from '@/shared/lib/seo';

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const path = await getPublishedPathBySlug(slug);
  if (!path) return {};

  return {
    title: locale === 'zh' ? path.titleZh : path.titleEn,
    description: locale === 'zh' ? path.descriptionZh : path.descriptionEn,
    alternates: getPageAlternates(`/learn/${slug}`, locale),
  };
}

function stripQuizAnswers(quizJson: string): string {
  try {
    const quiz: QuizQuestion = JSON.parse(quizJson);
    const { correct_index, explanation_en, explanation_zh, ...safe } = quiz;
    return JSON.stringify(safe);
  } catch {
    return quizJson;
  }
}

export default async function LearnDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const path = await getPublishedPathBySlug(slug);
  if (!path) notFound();

  const nodes = await getNodesByPathId(path.id);
  const user = await getUserInfo();

  const safeNodes = await Promise.all(
    nodes.map(async (node) => {
      const strippedQuiz = stripQuizAnswers(node.quizQuestion);
      const access = await checkNodeAccess(node.orderIndex, user);
      return {
        id: node.id,
        orderIndex: node.orderIndex,
        titleEn: node.titleEn,
        titleZh: node.titleZh,
        quizQuestion: strippedQuiz,
        locked: !access.allowed,
        lockReason: access.reason,
      };
    })
  );

  let progress;
  if (user) {
    progress = await getOrCreateProgress(user.id, path.id);
  }

  const siteUrl = getSiteUrl();
  const title = locale === 'zh' ? path.titleZh : path.titleEn;
  const description = locale === 'zh' ? path.descriptionZh : path.descriptionEn;
  // Downgraded from Course/CourseInstance to WebPage + BreadcrumbList until
  // path detail pages carry enough body content (learning outcomes, lessons,
  // time required) to satisfy Google's Course schema bar.
  const [webPageJsonLd, breadcrumbJsonLd] = buildLearningPathBasicJsonLd({
    title,
    description,
    slug: path.slug,
    siteUrl,
    locale,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(webPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbJsonLd) }}
      />
      <LearningPathDetail path={path} nodes={safeNodes} progress={progress} />
    </div>
  );
}
