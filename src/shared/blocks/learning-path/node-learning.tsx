'use client';

import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { Link } from '@/core/i18n/navigation';
import { QuizSection } from './quiz-section';

interface NodeData {
  id: string;
  orderIndex: number;
  titleEn: string;
  titleZh: string;
  descriptionEn: string;
  descriptionZh: string;
  generationId: string | null;
  experimentSlug: string | null;
  quizQuestion: string;
}

interface PathData {
  slug: string;
  titleEn: string;
  titleZh: string;
  nodeCount: number | null;
}

interface NodeLearningProps {
  node: NodeData;
  path: PathData;
  experimentHref?: string;
  locale: string;
}

export function NodeLearning({
  node,
  path,
  experimentHref,
  locale,
}: NodeLearningProps) {
  const t = useTranslations('learn');

  const pathTitle = path.titleEn;
  const nodeTitle = node.titleEn;
  const nodeDesc = node.descriptionEn;
  const totalNodes = path.nodeCount ?? 0;
  const isFirst = node.orderIndex === 0;
  const isLast = node.orderIndex >= totalNodes - 1;

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/learn" className="hover:text-primary">
          {t('page.title')}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href={`/learn/${path.slug}`} className="hover:text-primary">
          {pathTitle}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">
          {t('detail.lessons')} {node.orderIndex + 1}
        </span>
      </nav>

      {/* Title */}
      <div className="space-y-2">
        <h1 className="font-serif text-2xl font-bold text-foreground">
          {nodeTitle}
        </h1>
        {nodeDesc && (
          <p className="text-muted-foreground">{nodeDesc}</p>
        )}
      </div>

      {/* Embedded content */}
      {node.generationId && (
        <div className="overflow-hidden rounded-lg border border-primary/10">
          <iframe
            src={`/embed/${node.generationId}`}
            className="h-[500px] w-full border-0"
            title={nodeTitle}
            sandbox="allow-scripts"
          />
        </div>
      )}

      {node.experimentSlug && experimentHref && (
        <div className="rounded-lg border border-primary/10 bg-card p-4">
          <Button asChild variant="outline">
            <Link href={experimentHref}>
              <ExternalLink className="mr-2 h-4 w-4" />
              {node.experimentSlug}
            </Link>
          </Button>
        </div>
      )}

      {/* Quiz */}
      {node.quizQuestion && (
        <QuizSection
          quizQuestion={node.quizQuestion}
          slug={path.slug}
          orderIndex={node.orderIndex}
          isLast={isLast}
        />
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-border/50 pt-6">
        {!isFirst ? (
          <Button asChild variant="ghost" size="sm">
            <Link href={`/learn/${path.slug}/nodes/${node.orderIndex - 1}`}>
              <ChevronLeft className="mr-1 h-4 w-4" />
              {t('node.back_to_path')}
            </Link>
          </Button>
        ) : (
          <Button asChild variant="ghost" size="sm">
            <Link href={`/learn/${path.slug}`}>
              <ChevronLeft className="mr-1 h-4 w-4" />
              {t('node.back_to_path')}
            </Link>
          </Button>
        )}

        {!isLast && (
          <Button asChild variant="ghost" size="sm">
            <Link href={`/learn/${path.slug}/nodes/${node.orderIndex + 1}`}>
              {t('node.next')}
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
