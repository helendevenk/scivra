'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';

interface QuestItem {
  id: string;
  slug: string;
  titleEn: string;
  titleZh: string;
  descriptionEn: string;
  descriptionZh: string;
  category: string;
  difficulty: string;
  tier: string;
  estimatedMinutes: number;
  stepCount: number;
  attemptCount: number | null;
  completionCount: number | null;
  prerequisiteQuestId: string | null;
  isWeeklyChallenge: boolean | null;
}

interface AttemptItem {
  questId: string;
  status: string;
  totalScore: number | null;
  maxPossibleScore: number | null;
}

const CATEGORIES = [
  'all',
  'mechanics',
  'waves',
  'electricity',
  'thermodynamics',
] as const;

const DIFFICULTIES = [
  'all',
  'beginner',
  'intermediate',
  'advanced',
] as const;

const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  advanced: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const CATEGORY_COLORS: Record<string, string> = {
  mechanics: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  waves: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  electricity: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  thermodynamics: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
};

export function QuestList() {
  const t = useTranslations('quest');
  const router = useRouter();
  const [quests, setQuests] = useState<QuestItem[]>([]);
  const [attempts, setAttempts] = useState<AttemptItem[]>([]);
  const [category, setCategory] = useState<string>('all');
  const [difficulty, setDifficulty] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams();
        if (category !== 'all') params.set('category', category);
        if (difficulty !== 'all') params.set('difficulty', difficulty);
        const res = await fetch(`/api/quest?${params}`);
        const json = await res.json();
        if (json.data) {
          setQuests(json.data.quests || []);
          setAttempts(json.data.attempts || []);
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
  }, [category, difficulty, t]);

  const attemptMap = new Map(
    attempts.map((a) => [a.questId, a])
  );

  function getTitle(q: QuestItem) {
    return q.titleEn;
  }
  function getDesc(q: QuestItem) {
    return q.descriptionEn;
  }

  function getStatus(q: QuestItem) {
    const attempt = attemptMap.get(q.id);
    if (!attempt) return 'new';
    if (attempt.status === 'completed') return 'completed';
    return 'in_progress';
  }

  return (
    <div className="space-y-6">
      {/* Category filters */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <Button
            key={c}
            variant={category === c ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCategory(c)}
          >
            {t(`page.filter_${c}`)}
          </Button>
        ))}
      </div>

      {/* Difficulty filters */}
      <div className="flex flex-wrap gap-2">
        {DIFFICULTIES.map((d) => (
          <Button
            key={d}
            variant={difficulty === d ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDifficulty(d)}
          >
            {t(`page.difficulty_${d}`)}
          </Button>
        ))}
      </div>

      {loading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-5 w-3/4 rounded bg-muted" />
                <div className="mt-2 h-4 w-full rounded bg-muted" />
              </CardHeader>
              <CardContent>
                <div className="h-4 w-1/2 rounded bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {error && (
        <div className="text-center text-destructive">{error}</div>
      )}

      {!loading && !error && quests.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-lg font-medium">{t('empty.title')}</p>
          <p className="mt-1 text-muted-foreground">
            {t('empty.description')}
          </p>
        </div>
      )}

      {!loading && !error && quests.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {quests.map((q) => {
            const status = getStatus(q);
            const attempt = attemptMap.get(q.id);
            const scorePercent =
              attempt?.totalScore && attempt?.maxPossibleScore
                ? Math.round(
                    (attempt.totalScore / attempt.maxPossibleScore) * 100
                  )
                : null;
            const isLocked = !!q.prerequisiteQuestId;

            return (
              <Card
                key={q.id}
                className={`cursor-pointer transition-shadow hover:shadow-lg ${
                  isLocked ? 'opacity-60' : ''
                }`}
                onClick={() => {
                  if (!isLocked) {
                    router.push(`/quest/${q.slug}`);
                  }
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={CATEGORY_COLORS[q.category] ?? ''}
                    >
                      {t(`page.filter_${q.category}`)}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className={DIFFICULTY_COLORS[q.difficulty] ?? ''}
                    >
                      {t(`page.difficulty_${q.difficulty}`)}
                    </Badge>
                    {q.tier !== 'free' && (
                      <Badge variant="default">{t(`card.${q.tier}`)}</Badge>
                    )}
                    {q.isWeeklyChallenge && (
                      <Badge variant="destructive">
                        {t('card.weekly')}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="mt-2 text-lg">
                    {getTitle(q)}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {getDesc(q)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex gap-3">
                      <span>{t('card.steps', { count: q.stepCount })}</span>
                      <span>
                        {t('card.minutes', { count: q.estimatedMinutes })}
                      </span>
                    </div>
                    <div>
                      {isLocked && (
                        <span className="text-xs text-destructive">
                          {t('card.locked')}
                        </span>
                      )}
                      {status === 'completed' && scorePercent !== null && (
                        <Badge variant="outline">
                          {t('card.best_score', { score: scorePercent })}
                        </Badge>
                      )}
                      {status === 'in_progress' && (
                        <Badge variant="outline">{t('card.continue')}</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
