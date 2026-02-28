'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle, XCircle } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Link } from '@/core/i18n/navigation';

interface QuizData {
  question_en: string;
  question_zh: string;
  options_en: string[];
  options_zh: string[];
}

interface QuizResult {
  correct: boolean;
  correctIndex: number;
  explanation: string;
}

interface QuizSectionProps {
  quizQuestion: string;
  slug: string;
  orderIndex: number;
  locale: string;
  isLast: boolean;
}

export function QuizSection({
  quizQuestion,
  slug,
  orderIndex,
  locale,
  isLast,
}: QuizSectionProps) {
  const t = useTranslations('learn');
  const [selected, setSelected] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState('');

  let quiz: QuizData;
  try {
    quiz = JSON.parse(quizQuestion);
  } catch {
    return null;
  }

  const question = locale === 'zh' ? quiz.question_zh : quiz.question_en;
  const options = locale === 'zh' ? quiz.options_zh : quiz.options_en;

  async function handleSubmit() {
    if (selected === null) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(
        `/api/learning-paths/${slug}/nodes/${orderIndex}/submit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept-Language': locale,
          },
          body: JSON.stringify({ answer: selected }),
        }
      );
      const json = await res.json();
      if (json.data) {
        setResult(json.data);
      } else {
        setError(json.message || t('errors.submit_failed'));
      }
    } catch {
      setError(t('errors.submit_failed'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="border-neon-cyan/10 bg-surface-dark">
      <CardHeader>
        <CardTitle className="text-base">{t('node.quiz_title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm font-medium text-foreground">{question}</p>

        <div className="space-y-2">
          {options.map((opt, i) => {
            const isCorrectAnswer = result && i === result.correctIndex;
            const isWrongSelected = result && !result.correct && i === selected;

            let borderClass = 'border-border/50 hover:border-neon-cyan/50';
            if (result) {
              if (isCorrectAnswer) borderClass = 'border-neon-green bg-neon-green/5';
              else if (isWrongSelected) borderClass = 'border-red-500 bg-red-500/5';
              else borderClass = 'border-border/50 opacity-50';
            } else if (selected === i) {
              borderClass = 'border-neon-cyan bg-neon-cyan/10';
            }

            return (
              <button
                key={i}
                disabled={!!result || submitting}
                onClick={() => setSelected(i)}
                className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left text-sm transition-all ${borderClass}`}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs">
                  {result && isCorrectAnswer ? (
                    <CheckCircle className="h-4 w-4 text-neon-green" />
                  ) : result && isWrongSelected ? (
                    <XCircle className="h-4 w-4 text-red-500" />
                  ) : (
                    String.fromCharCode(65 + i)
                  )}
                </span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {!result && (
          <Button
            onClick={handleSubmit}
            disabled={selected === null || submitting}
            className="w-full"
          >
            {submitting ? t('node.submitting') : t('node.submit')}
          </Button>
        )}

        {result && (
          <div className="space-y-3">
            <div
              className={`flex items-center gap-2 text-sm font-medium ${
                result.correct ? 'text-neon-green' : 'text-red-500'
              }`}
            >
              {result.correct ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              {result.correct ? t('node.correct') : t('node.incorrect')}
            </div>

            {result.explanation && (
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs font-medium text-muted-foreground">
                  {t('node.explanation')}
                </p>
                <p className="mt-1 text-sm">{result.explanation}</p>
              </div>
            )}

            <Button asChild className="w-full">
              {isLast ? (
                <Link href={`/learn/${slug}`}>{t('node.complete')}</Link>
              ) : (
                <Link href={`/learn/${slug}/nodes/${orderIndex + 1}`}>
                  {t('node.next')}
                </Link>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
