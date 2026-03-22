'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { Button } from '@/shared/components/ui/button';

interface UnitBreakdownEntry {
  unitId: string;
  attempted: number;
  correct: number;
}

interface ProgressItem {
  id: string;
  examId: string;
  totalAttempted: number;
  totalCorrect: number;
  unitBreakdown: string | null;
  weakUnits: string | null;
  streakDays: number;
  lastAttemptAt: string | null;
}

export function ApProgressDashboard() {
  const t = useTranslations('ap-prep');
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch('/api/ap-prep/progress');
        const json = await res.json();
        if (json.code === 0) {
          setProgress(json.data || []);
        } else if (json.message === 'Unauthorized') {
          setError(t('login_for_progress'));
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
  }, [t]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-muted-foreground">{t('loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <div className="text-muted-foreground">{error}</div>
        <Link href="/ap-prep">
          <Button variant="outline">{t('back_to_exams')}</Button>
        </Link>
      </div>
    );
  }

  if (progress.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <div className="text-muted-foreground">{t('progress.no_attempts')}</div>
        <Link href="/ap-prep">
          <Button>{t('exam.start_practice')}</Button>
        </Link>
      </div>
    );
  }

  // Aggregate across all exams
  const totalAttempted = progress.reduce((s, p) => s + p.totalAttempted, 0);
  const totalCorrect = progress.reduce((s, p) => s + p.totalCorrect, 0);
  const accuracy =
    totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
  const maxStreak = Math.max(...progress.map((p) => p.streakDays));

  // Collect all weak units
  const allWeakUnits = progress.flatMap((p) => {
    if (!p.weakUnits) return [];
    try {
      return JSON.parse(p.weakUnits) as string[];
    } catch {
      return [];
    }
  });

  // Collect all unit breakdowns
  const allBreakdowns = progress.flatMap((p) => {
    if (!p.unitBreakdown) return [];
    try {
      return JSON.parse(p.unitBreakdown) as UnitBreakdownEntry[];
    } catch {
      return [];
    }
  });

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/ap-prep"
          className="mb-4 inline-block text-sm text-muted-foreground hover:text-foreground"
        >
          &larr; {t('back_to_exams')}
        </Link>
        <h1 className="text-2xl font-bold">{t('progress.title')}</h1>
        <p className="text-muted-foreground">{t('progress.description')}</p>
      </div>

      {/* Summary Cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border bg-card p-4 text-center">
          <div className="text-2xl font-bold text-primary">
            {t('progress.accuracy_rate', { rate: accuracy })}
          </div>
          <div className="text-xs text-muted-foreground">
            {t('progress.overall_accuracy')}
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4 text-center">
          <div className="text-2xl font-bold">{totalAttempted}</div>
          <div className="text-xs text-muted-foreground">
            {t('progress.total_attempted')}
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{totalCorrect}</div>
          <div className="text-xs text-muted-foreground">
            {t('progress.total_correct')}
          </div>
        </div>
        <div className="rounded-xl border bg-card p-4 text-center">
          <div className="text-2xl font-bold text-orange-500">{maxStreak}</div>
          <div className="text-xs text-muted-foreground">
            {t('progress.streak')}
          </div>
        </div>
      </div>

      {/* Weak Units */}
      {allWeakUnits.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-3 text-lg font-semibold">
            {t('progress.weak_units')}
          </h2>
          <div className="flex flex-wrap gap-2">
            {allWeakUnits.map((unitId) => (
              <span
                key={unitId}
                className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400"
              >
                {unitId}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Unit Breakdown Bars */}
      {allBreakdowns.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold">
            {t('progress.unit_breakdown')}
          </h2>
          <div className="space-y-3">
            {allBreakdowns.map((entry) => {
              const unitAcc =
                entry.attempted > 0
                  ? Math.round((entry.correct / entry.attempted) * 100)
                  : 0;
              const isWeak = allWeakUnits.includes(entry.unitId);

              return (
                <div key={entry.unitId} className="rounded-lg border bg-card p-3">
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className={isWeak ? 'text-red-600 font-medium' : ''}>
                      {entry.unitId}
                    </span>
                    <span className="text-muted-foreground">
                      {entry.correct}/{entry.attempted} ({unitAcc}%)
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isWeak ? 'bg-red-500' : 'bg-primary'
                      }`}
                      style={{ width: `${unitAcc}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
