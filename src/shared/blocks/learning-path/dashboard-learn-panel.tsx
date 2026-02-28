'use client';

import { useEffect, useState } from 'react';
import { BookOpen, CheckCircle, ChevronRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Progress } from '@/shared/components/ui/progress';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Link } from '@/core/i18n/navigation';

interface PathProgress {
  pathId: string;
  slug: string;
  titleEn: string;
  titleZh: string;
  nodeCount: number;
  currentNode: number;
  completed: boolean;
}

export function DashboardLearnPanel() {
  const t = useTranslations('learn');
  const locale = useLocale();
  const [paths, setPaths] = useState<PathProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/learning-paths');
        const json = await res.json();
        if (!json.data) return;

        const { paths: allPaths, progress } = json.data;
        if (!progress || progress.length === 0) return;

        const progressMap = new Map(
          progress.map((p: any) => [p.pathId, p])
        );

        const inProgress: PathProgress[] = allPaths
          .filter((p: any) => progressMap.has(p.id))
          .map((p: any) => {
            const prog = progressMap.get(p.id)!;
            return {
              pathId: p.id,
              slug: p.slug,
              titleEn: p.titleEn,
              titleZh: p.titleZh,
              nodeCount: p.nodeCount ?? 0,
              currentNode: prog.currentNode ?? 0,
              completed: prog.completed ?? false,
            };
          });

        setPaths(inProgress);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <Skeleton className="h-32 rounded-xl" />;
  }

  if (paths.length === 0) return null;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{t('detail.progress')}</h2>
        <Button asChild variant="outline" size="sm">
          <Link href="/learn">
            {t('page.title')}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {paths.slice(0, 4).map((p) => {
          const title = locale === 'zh' ? p.titleZh : p.titleEn;
          const percent =
            p.nodeCount > 0
              ? Math.round((p.currentNode / p.nodeCount) * 100)
              : 0;

          return (
            <Link key={p.pathId} href={`/learn/${p.slug}`} className="block">
              <Card className="transition-shadow hover:shadow-md">
                <CardContent className="space-y-2 p-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-neon-cyan" />
                    <span className="line-clamp-1 text-sm font-medium">
                      {title}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    {p.completed ? (
                      <span className="flex items-center gap-1 text-neon-green">
                        <CheckCircle className="h-3.5 w-3.5" />
                        {t('card.completed')}
                      </span>
                    ) : (
                      <span>
                        {t('card.progress', {
                          current: p.currentNode,
                          total: p.nodeCount,
                        })}
                      </span>
                    )}
                  </div>
                  <Progress
                    value={p.completed ? 100 : percent}
                    className="h-1.5"
                  />
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
