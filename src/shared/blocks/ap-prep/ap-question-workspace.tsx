'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { Button } from '@/shared/components/ui/button';

interface QuestionData {
  id: string;
  examId: string;
  unitId: string;
  questionNumber: number;
  type: string;
  difficulty: string;
  stemEn: string;
  stemZh: string | null;
  choicesEn: string | null;
  choicesZh: string | null;
  upgPrompt: string | null;
}

interface SubmitResult {
  isCorrect: boolean;
  correctAnswer: string;
  explanationEn: string;
  explanationZh: string | null;
  upgPrompt: string | null;
}

interface Choice {
  key: string;
  text: string;
}

interface ApQuestionWorkspaceProps {
  questionId: string;
  examSlug: string;
  unitSlug: string;
}

const CHOICE_KEYS = ['A', 'B', 'C', 'D'] as const;

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  medium:
    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

function parseChoices(choicesJson: string | null): Choice[] {
  if (!choicesJson) return [];
  try {
    const parsed = JSON.parse(choicesJson);
    if (Array.isArray(parsed)) {
      return parsed.map((item: { key: string; text: string }) => ({
        key: item.key,
        text: item.text,
      }));
    }
    // If object like { A: "...", B: "...", ... }
    return Object.entries(parsed).map(([key, text]) => ({
      key,
      text: text as string,
    }));
  } catch {
    return [];
  }
}

export function ApQuestionWorkspace({
  questionId,
  examSlug,
  unitSlug,
}: ApQuestionWorkspaceProps) {
  const t = useTranslations('ap-prep');

  const [question, setQuestion] = useState<QuestionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Timer
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/ap-prep/questions/${questionId}`);
        const json = await res.json();
        if (json.code === 0) {
          setQuestion(json.data);
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
  }, [questionId, t]);

  // Start timer when question loads
  useEffect(() => {
    if (question && !result) {
      timerRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [question, result]);

  const handleSubmit = useCallback(async () => {
    if (!selectedAnswer || !question) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setSubmitting(true);
    setSubmitError('');
    try {
      const res = await fetch(`/api/ap-prep/questions/${questionId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedAnswer,
          timeSpentSeconds: seconds,
        }),
      });
      const json = await res.json();
      if (json.code === 0) {
        setResult(json.data);
      } else {
        setSubmitError(json.message || t('errors.submit_failed'));
      }
    } catch {
      setSubmitError(t('errors.submit_failed'));
    } finally {
      setSubmitting(false);
    }
  }, [selectedAnswer, question, questionId, seconds, t]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-muted-foreground">{t('loading')}</div>
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-destructive">{error || t('errors.not_found')}</div>
      </div>
    );
  }

  const stem = question.stemEn;
  const choicesRaw = question.choicesEn;
  const choices = parseChoices(choicesRaw);
  const diffColor =
    DIFFICULTY_COLORS[question.difficulty] || DIFFICULTY_COLORS.medium;

  const explanation = result?.explanationEn;

  return (
    <div className="mx-auto max-w-3xl">
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
          {examSlug}
        </Link>
        <span>/</span>
        <Link
          href={`/ap-prep/${examSlug}/${unitSlug}`}
          className="hover:text-foreground"
        >
          {unitSlug}
        </Link>
      </div>

      {/* Question header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold">
            {t('question.question_number', {
              number: question.questionNumber,
            })}
          </h1>
          <span
            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${diffColor}`}
          >
            {t(`unit.difficulty.${question.difficulty}`)}
          </span>
        </div>
        <div className="text-sm text-muted-foreground">
          {t('question.time_spent', { seconds })}
        </div>
      </div>

      {/* Question stem */}
      <div className="mb-8 rounded-xl border bg-card p-6">
        <p className="whitespace-pre-wrap text-base leading-relaxed">{stem}</p>
      </div>

      {/* MCQ Choices */}
      {question.type === 'mcq' && choices.length > 0 && (
        <div className="mb-6 space-y-3">
          {choices.map((choice) => {
            const isSelected = selectedAnswer === choice.key;
            const isSubmitted = result !== null;
            const isCorrectChoice =
              isSubmitted && result.correctAnswer === choice.key;
            const isWrongSelection =
              isSubmitted && isSelected && !result.isCorrect;

            let borderClass = 'border-border';
            if (isSubmitted && isCorrectChoice) {
              borderClass = 'border-green-500 bg-green-50 dark:bg-green-900/20';
            } else if (isWrongSelection) {
              borderClass = 'border-red-500 bg-red-50 dark:bg-red-900/20';
            } else if (isSelected && !isSubmitted) {
              borderClass = 'border-primary bg-primary/5';
            }

            return (
              <button
                key={choice.key}
                disabled={isSubmitted}
                onClick={() => !isSubmitted && setSelectedAnswer(choice.key)}
                className={`flex w-full items-start gap-3 rounded-lg border p-4 text-left transition-all ${borderClass} ${
                  isSubmitted
                    ? 'cursor-default'
                    : 'cursor-pointer hover:border-primary/60'
                }`}
              >
                <span
                  className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                    isSelected
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {choice.key}
                </span>
                <span className="pt-0.5 text-sm">{choice.text}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Submit button */}
      {!result && (
        <div className="mb-8">
          {submitError && (
            <p className="mb-3 text-sm text-destructive">{submitError}</p>
          )}
          <Button
            className="w-full"
            disabled={!selectedAnswer || submitting}
            onClick={handleSubmit}
          >
            {submitting ? t('loading') : t('question.submit')}
          </Button>
          {!selectedAnswer && (
            <p className="mt-2 text-center text-xs text-muted-foreground">
              {t('question.select_answer')}
            </p>
          )}
        </div>
      )}

      {/* Result & Explanation */}
      {result && (
        <div className="space-y-4">
          <div
            className={`rounded-xl border p-6 ${
              result.isCorrect
                ? 'border-green-300 bg-green-50 dark:bg-green-900/20'
                : 'border-red-300 bg-red-50 dark:bg-red-900/20'
            }`}
          >
            <h3 className="mb-1 text-lg font-semibold">
              {result.isCorrect
                ? t('question.correct')
                : t('question.incorrect')}
            </h3>
            {!result.isCorrect && (
              <p className="text-sm text-muted-foreground">
                {t('question.choices.' + result.correctAnswer)} is the correct
                answer.
              </p>
            )}
          </div>

          <div className="rounded-xl border bg-card p-6">
            <h3 className="mb-3 text-base font-semibold">
              {t('question.explanation')}
            </h3>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {explanation}
            </p>
          </div>

          {result.upgPrompt && (
            <Link
              href={`/upg?prompt=${encodeURIComponent(result.upgPrompt)}`}
              className="block"
            >
              <Button variant="outline" className="w-full">
                {t('question.view_upg')}
              </Button>
            </Link>
          )}

          {/* Navigation */}
          <div className="flex gap-3">
            <Link
              href={`/ap-prep/${examSlug}/${unitSlug}`}
              className="flex-1"
            >
              <Button variant="outline" className="w-full">
                {t('back_to_questions')}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
