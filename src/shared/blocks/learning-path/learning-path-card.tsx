'use client';

import { useTranslations } from 'next-intl';
import { BookOpen, CheckCircle } from 'lucide-react';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Progress } from '@/shared/components/ui/progress';
import { Link } from '@/core/i18n/navigation';

interface PathItem {
  id: string;
  slug: string;
  titleEn: string;
  titleZh: string;
  descriptionEn: string;
  descriptionZh: string;
  category: string;
  level: string;
  nodeCount: number | null;
  coverImage: string | null;
}

interface ProgressItem {
  pathId: string;
  currentNode: number | null;
  completed: boolean | null;
}

interface LearningPathCardProps {
  path: PathItem;
  progress?: ProgressItem;
}

export function LearningPathCard({ path, progress }: LearningPathCardProps) {
  const t = useTranslations('learn');

  const title = path.titleEn;
  const description = path.descriptionEn;
  const total = path.nodeCount ?? 0;
  const current = progress?.currentNode ?? 0;
  const isCompleted = progress?.completed ?? false;
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;

  const actionLabel = isCompleted
    ? t('card.review')
    : current > 0
      ? t('card.continue')
      : t('card.start');

  return (
    <Link href={`/learn/${path.slug}`} className="group block">
      <Card className="h-full border-primary/10 bg-card transition-all hover:border-primary/30 hover:shadow-lg">
        <CardContent className="space-y-3 p-5">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {path.category}
            </Badge>
            <span className="text-xs text-muted-foreground">{path.level}</span>
          </div>

          <h3 className="line-clamp-2 text-base font-medium transition-colors group-hover:text-primary">
            {title}
          </h3>

          <p className="line-clamp-2 text-sm text-muted-foreground">
            {description}
          </p>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5" />
            <span>{t('card.nodes', { count: total })}</span>
          </div>

          {progress && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                {isCompleted ? (
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle className="h-3.5 w-3.5" />
                    {t('card.completed')}
                  </span>
                ) : (
                  <span className="text-muted-foreground">
                    {t('card.progress', { current, total })}
                  </span>
                )}
              </div>
              <Progress value={isCompleted ? 100 : percent} className="h-1.5" />
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="w-full text-primary hover:bg-primary/10 hover:text-primary"
          >
            {actionLabel}
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
