'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { Button } from '@/shared/components/ui/button';

interface ExamItem {
  id: string;
  slug: string;
  titleEn: string;
  titleZh: string;
  descriptionEn: string | null;
  descriptionZh: string | null;
  unitCount: number | null;
  questionCount: number | null;
  coverImage: string | null;
}

export function ApExamList() {
  const t = useTranslations('ap-prep');
  const [exams, setExams] = useState<ExamItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch('/api/ap-prep/exams');
        const json = await res.json();
        if (json.code === 0) {
          setExams(json.data || []);
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
      <div className="flex justify-center py-12">
        <div className="text-destructive">{error}</div>
      </div>
    );
  }

  if (exams.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-muted-foreground">No exams available yet.</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {exams.map((exam) => {
        const title = exam.titleEn;
        const description = exam.descriptionEn;

        return (
          <Link
            key={exam.id}
            href={`/ap-prep/${exam.slug}`}
            className="group block rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/40"
          >
            {exam.coverImage && (
              <div className="mb-4 aspect-video overflow-hidden rounded-lg bg-muted">
                <img
                  src={exam.coverImage}
                  alt={title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
            )}
            <h3 className="mb-2 text-lg font-semibold tracking-tight">
              {title}
            </h3>
            {description && (
              <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                {description}
              </p>
            )}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>
                {t('exam.unit_count', { count: exam.unitCount ?? 0 })}
              </span>
              <span>
                {t('exam.question_count', {
                  count: exam.questionCount ?? 0,
                })}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 w-full"
              asChild
            >
              <span>{t('exam.view_units')}</span>
            </Button>
          </Link>
        );
      })}
    </div>
  );
}
