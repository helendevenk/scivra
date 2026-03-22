'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import { Button } from '@/shared/components/ui/button';
import { LearningPathCard } from './learning-path-card';

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

const LEVELS = ['all', 'beginner', 'intermediate', 'advanced'] as const;

export function LearningPathList() {
  const t = useTranslations('learn');
  const [paths, setPaths] = useState<PathItem[]>([]);
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [level, setLevel] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams();
        if (level !== 'all') params.set('level', level);
        const res = await fetch(`/api/learning-paths?${params}`);
        const json = await res.json();
        if (json.data) {
          setPaths(json.data.paths || []);
          setProgress(json.data.progress || []);
        } else {
          setError(t('errors.load_failed'));
        }
      } catch {
        setError(t('errors.load_failed'));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [level, t]);

  const progressMap = new Map(progress.map((p) => [p.pathId, p]));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {LEVELS.map((l) => (
          <Button
            key={l}
            variant={level === l ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLevel(l)}
          >
            {t(`page.filter_${l}`)}
          </Button>
        ))}
      </div>

      {loading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 animate-pulse rounded-lg bg-muted"
            />
          ))}
        </div>
      )}

      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && paths.length === 0 && (
        <div className="py-16 text-center">
          <h3 className="text-lg font-medium text-foreground">
            {t('empty.title')}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {t('empty.description')}
          </p>
        </div>
      )}

      {!loading && paths.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {paths.map((path) => (
            <LearningPathCard
              key={path.id}
              path={path}
              progress={progressMap.get(path.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
