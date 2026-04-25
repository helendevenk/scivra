'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { Button } from '@/shared/components/ui/button';

interface UnitItem {
  id: string;
  slug: string;
  unitNumber: number;
  titleEn: string;
  titleZh: string;
  descriptionEn: string | null;
  descriptionZh: string | null;
  questionCount: number | null;
  examWeight: number | null;
}

interface ExamInfo {
  id: string;
  slug: string;
  titleEn: string;
  titleZh: string;
  descriptionEn: string | null;
  descriptionZh: string | null;
}

interface ProgressInfo {
  totalAttempted: number;
  totalCorrect: number;
  unitBreakdown: string | null;
  streakDays: number;
}

interface ApUnitListProps {
  examSlug: string;
}

export function ApUnitList({ examSlug }: ApUnitListProps) {
  const t = useTranslations('ap-prep');
  const [exam, setExam] = useState<ExamInfo | null>(null);
  const [units, setUnits] = useState<UnitItem[]>([]);
  const [progress, setProgress] = useState<ProgressInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/ap-prep/exams/${examSlug}`);
        const json = await res.json();
        if (json.code === 0) {
          setExam(json.data.exam);
          setUnits(json.data.units || []);
          setProgress(json.data.progress || null);
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
  }, [examSlug, t]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-muted-foreground">{t('loading')}</div>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-destructive">{error || t('errors.not_found')}</div>
      </div>
    );
  }

  const examTitle = exam.titleEn;
  const examDesc = exam.descriptionEn;

  const accuracy =
    progress && progress.totalAttempted > 0
      ? Math.round((progress.totalCorrect / progress.totalAttempted) * 100)
      : 0;

  return (
    <div>
      {/* Exam Header */}
      <div className="mb-8">
        <Link
          href="/ap-prep"
          className="mb-4 inline-block text-sm text-muted-foreground hover:text-foreground"
        >
          &larr; {t('back_to_exams')}
        </Link>
        <h1 className="mb-2 text-2xl font-bold tracking-tight">{examTitle}</h1>
        {examDesc && (
          <p className="text-muted-foreground">{examDesc}</p>
        )}
      </div>

      {/* Progress Bar */}
      {progress && progress.totalAttempted > 0 && (
        <div className="mb-8 rounded-xl border bg-card p-6">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span>{t('progress.overall_accuracy')}</span>
            <span className="font-semibold">
              {t('progress.accuracy_rate', { rate: accuracy })}
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${accuracy}%` }}
            />
          </div>
          <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
            <span>
              {t('progress.total_attempted')}: {progress.totalAttempted}
            </span>
            <span>
              {t('progress.streak')}: {t('progress.streak_days', { days: progress.streakDays })}
            </span>
          </div>
        </div>
      )}

      {/* Units Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {units.map((unit) => {
          const unitTitle = unit.titleEn;
          const unitDesc = unit.descriptionEn;

          return (
            <Link
              key={unit.id}
              href={`/ap-prep/${examSlug}/${unit.slug}`}
              className="group block rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/40"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {unit.unitNumber}
                </span>
                <h3 className="text-base font-semibold">{unitTitle}</h3>
              </div>
              {unitDesc && (
                <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                  {unitDesc}
                </p>
              )}
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>
                  {t('unit.questions_in_unit', {
                    count: unit.questionCount ?? 0,
                  })}
                </span>
                {unit.examWeight != null && unit.examWeight > 0 && (
                  <span>
                    {t('exam.exam_weight', { weight: unit.examWeight })}
                  </span>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 w-full"
                asChild
              >
                <span>{t('unit.practice_now')}</span>
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
