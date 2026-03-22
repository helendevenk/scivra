'use client';

import { useEffect, useState, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

import { Button } from '@/shared/components/ui/button';

interface QuestionItem {
  id: string;
  questionNumber: number;
  type: string;
  difficulty: string;
  stemEn: string;
  stemZh: string | null;
  examFrequency: string | null;
}

interface UnitInfo {
  id: string;
  slug: string;
  unitNumber: number;
  titleEn: string;
  titleZh: string;
}

interface ExamBrief {
  id: string;
  slug: string;
  titleEn: string;
  titleZh: string;
}

interface ApQuestionListProps {
  examSlug: string;
  unitSlug: string;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  medium:
    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export function ApQuestionList({ examSlug, unitSlug }: ApQuestionListProps) {
  const t = useTranslations('ap-prep');
  const locale = useLocale();
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [unit, setUnit] = useState<UnitInfo | null>(null);
  const [exam, setExam] = useState<ExamBrief | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [type, setType] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', '20');
      if (difficulty) params.set('difficulty', difficulty);
      if (type) params.set('type', type);

      const res = await fetch(
        `/api/ap-prep/exams/${examSlug}/units/${unitSlug}/questions?${params}`
      );
      const json = await res.json();
      if (json.code === 0) {
        setQuestions(json.data.questions || []);
        setUnit(json.data.unit || null);
        setExam(json.data.exam || null);
        setTotalPages(json.data.totalPages || 1);
      } else {
        setError(t('errors.load_failed'));
      }
    } catch {
      setError(t('errors.load_failed'));
    } finally {
      setLoading(false);
    }
  }, [examSlug, unitSlug, page, difficulty, type, t]);

  useEffect(() => {
    load();
  }, [load]);

  const unitTitle = unit
    ? locale === 'zh'
      ? unit.titleZh
      : unit.titleEn
    : '';

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <Link href="/ap-prep" className="hover:text-foreground">
          {t('back_to_exams')}
        </Link>
        <span>/</span>
        <Link
          href={`/ap-prep/${examSlug}`}
          className="hover:text-foreground"
        >
          {exam
            ? locale === 'zh'
              ? exam.titleZh
              : exam.titleEn
            : examSlug}
        </Link>
        <span>/</span>
        <span className="text-foreground">{unitTitle}</span>
      </div>

      {unit && (
        <h1 className="mb-6 text-2xl font-bold">
          {t('unit.title', { number: unit.unitNumber, title: unitTitle })}
        </h1>
      )}

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        <select
          value={difficulty}
          onChange={(e) => {
            setDifficulty(e.target.value);
            setPage(1);
          }}
          className="rounded-md border bg-background px-3 py-1.5 text-sm"
        >
          <option value="">{t('filter.all')} - {t('filter.difficulty')}</option>
          <option value="easy">{t('unit.difficulty.easy')}</option>
          <option value="medium">{t('unit.difficulty.medium')}</option>
          <option value="hard">{t('unit.difficulty.hard')}</option>
        </select>
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setPage(1);
          }}
          className="rounded-md border bg-background px-3 py-1.5 text-sm"
        >
          <option value="">{t('filter.all')} - {t('filter.type')}</option>
          <option value="mcq">{t('unit.type.mcq')}</option>
          <option value="frq">{t('unit.type.frq')}</option>
        </select>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="text-muted-foreground">{t('loading')}</div>
        </div>
      )}

      {error && (
        <div className="flex justify-center py-12">
          <div className="text-destructive">{error}</div>
        </div>
      )}

      {!loading && !error && questions.length === 0 && (
        <div className="flex justify-center py-12">
          <div className="text-muted-foreground">No questions found.</div>
        </div>
      )}

      {!loading && !error && questions.length > 0 && (
        <>
          <div className="space-y-3">
            {questions.map((q) => {
              const stem = locale === 'zh' && q.stemZh ? q.stemZh : q.stemEn;
              const diffColor =
                DIFFICULTY_COLORS[q.difficulty] || DIFFICULTY_COLORS.medium;

              return (
                <Link
                  key={q.id}
                  href={`/ap-prep/${examSlug}/${unitSlug}/${q.id}`}
                  className="flex items-start gap-4 rounded-lg border bg-card p-4 transition-all hover:shadow-sm hover:border-primary/40"
                >
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">
                    {q.questionNumber}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="line-clamp-2 text-sm">{stem}</p>
                    <div className="mt-2 flex gap-2">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${diffColor}`}
                      >
                        {t(`unit.difficulty.${q.difficulty}`)}
                      </span>
                      <span className="inline-flex rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        {t(`unit.type.${q.type}`)}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                {t('question.previous')}
              </Button>
              <span className="text-sm text-muted-foreground">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                {t('question.next')}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
