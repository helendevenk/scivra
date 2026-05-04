'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

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
      <div className="mx-auto flex max-w-xl flex-col items-center justify-center gap-4 py-12 text-center">
        <div>
          <h2 className="text-lg font-semibold">AP Prep is in preview.</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Full exam sets are still in development. For now, start with the AP
            science labs that already support concept practice.
          </p>
        </div>
        <Button asChild>
          <Link href="/labs?grade=AP">Explore AP labs</Link>
        </Button>
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
            className="group bg-card hover:border-primary/40 block rounded-xl border p-6 shadow-sm transition-all hover:shadow-md"
          >
            {exam.coverImage && (
              <div className="bg-muted mb-4 aspect-video overflow-hidden rounded-lg">
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
              <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">
                {description}
              </p>
            )}
            <div className="text-muted-foreground flex items-center gap-4 text-xs">
              <span>
                {t('exam.unit_count', { count: exam.unitCount ?? 0 })}
              </span>
              <span>
                {t('exam.question_count', {
                  count: exam.questionCount ?? 0,
                })}
              </span>
            </div>
            <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
              <span>{t('exam.view_units')}</span>
            </Button>
          </Link>
        );
      })}
    </div>
  );
}
