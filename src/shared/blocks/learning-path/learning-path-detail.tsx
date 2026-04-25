'use client';

import { useTranslations } from 'next-intl';
import { CheckCircle, Lock, Play } from 'lucide-react';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Progress } from '@/shared/components/ui/progress';
import { Link } from '@/core/i18n/navigation';

interface NodeItem {
  id: string;
  orderIndex: number;
  titleEn: string;
  titleZh: string;
  locked: boolean;
  lockReason?: string;
}

interface PathData {
  id: string;
  slug: string;
  titleEn: string;
  titleZh: string;
  descriptionEn: string;
  descriptionZh: string;
  category: string;
  level: string;
  nodeCount: number | null;
}

interface ProgressData {
  currentNode: number | null;
  completed: boolean | null;
}

interface LearningPathDetailProps {
  path: PathData;
  nodes: NodeItem[];
  progress?: ProgressData;
}

export function LearningPathDetail({
  path,
  nodes,
  progress,
}: LearningPathDetailProps) {
  const t = useTranslations('learn');

  const title = path.titleEn;
  const description = path.descriptionEn;
  const total = path.nodeCount ?? 0;
  const current = progress?.currentNode ?? 0;
  const isCompleted = progress?.completed ?? false;
  const percent = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{path.category}</Badge>
          <Badge variant="outline">{path.level}</Badge>
        </div>
        <h1 className="font-serif text-3xl font-bold text-foreground">
          {title}
        </h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      {progress && (
        <Card className="border-primary/10 bg-card">
          <CardContent className="space-y-2 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {t('detail.progress')}
              </span>
              {isCompleted ? (
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="h-4 w-4" />
                  {t('card.completed')}
                </span>
              ) : (
                <span className="text-muted-foreground">
                  {t('card.progress', { current, total })}
                </span>
              )}
            </div>
            <Progress value={isCompleted ? 100 : percent} className="h-2" />
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">
          {t('detail.lessons')}
        </h2>
        <div className="space-y-2">
          {nodes.map((node) => {
            const nodeTitle = node.titleEn;
            const isCurrent = !isCompleted && node.orderIndex === current;
            const isDone = node.orderIndex < current || isCompleted;

            return (
              <div key={node.id}>
                {node.locked ? (
                  <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-muted/50 p-4 opacity-60">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        {node.orderIndex + 1}. {nodeTitle}
                      </p>
                    </div>
                    <Badge variant="destructive" className="text-xs">
                      {t('detail.node_locked')}
                    </Badge>
                  </div>
                ) : (
                  <Link
                    href={`/learn/${path.slug}/nodes/${node.orderIndex}`}
                    className="group block"
                  >
                    <div
                      className={`flex items-center gap-3 rounded-lg border p-4 transition-all hover:border-primary/30 hover:shadow-sm ${
                        isCurrent
                          ? 'border-primary/40 bg-primary/5'
                          : 'border-border/50 bg-card'
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          isDone
                            ? 'bg-emerald-500/10'
                            : isCurrent
                              ? 'bg-primary/10'
                              : 'bg-muted'
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        ) : isCurrent ? (
                          <Play className="h-4 w-4 text-primary" />
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            {node.orderIndex + 1}
                          </span>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium group-hover:text-primary">
                          {node.orderIndex + 1}. {nodeTitle}
                        </p>
                      </div>
                      {isDone && (
                        <Badge
                          variant="secondary"
                          className="text-xs text-emerald-600 dark:text-emerald-400"
                        >
                          {t('detail.node_completed')}
                        </Badge>
                      )}
                      {isCurrent && (
                        <Badge
                          variant="secondary"
                          className="text-xs text-primary"
                        >
                          {t('detail.node_current')}
                        </Badge>
                      )}
                      {!isDone && !isCurrent && (
                        <Badge variant="secondary" className="text-xs">
                          {t('detail.node_free')}
                        </Badge>
                      )}
                    </div>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {!progress && nodes.length > 0 && (
        <Button asChild className="w-full">
          <Link href={`/learn/${path.slug}/nodes/0`}>
            {t('detail.start_path')}
          </Link>
        </Button>
      )}
    </div>
  );
}
