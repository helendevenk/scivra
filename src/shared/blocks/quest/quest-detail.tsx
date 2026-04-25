'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';

interface QuestData {
  id: string;
  slug: string;
  titleEn: string;
  titleZh: string;
  descriptionEn: string;
  descriptionZh: string;
  category: string;
  difficulty: string;
  experimentId: string;
  stepCount: number;
}

interface StepData {
  id: string;
  orderIndex: number;
  stepType: string;
  titleEn: string;
  titleZh: string;
  contentEn: string;
  contentZh: string;
  config: string | null;
  maxPoints: number;
}

interface AttemptData {
  id: string;
  currentStep: number;
  status: string;
  totalScore: number | null;
  maxPossibleScore: number | null;
}

interface ScoringResult {
  score: number;
  maxScore: number;
  feedback?: string;
}

interface StepConfig {
  predictionType?: string;
  numericUnit?: string;
  options_en?: string[];
  options_zh?: string[];
  correctIndex?: number;
  experimentSlug?: string;
  explanationType?: string;
  feedbackEn?: string;
  feedbackZh?: string;
  referenceEn?: string;
  referenceZh?: string;
  showChart?: boolean;
}

export function QuestDetail({ slug }: { slug: string }) {
  const t = useTranslations('quest');
  const router = useRouter();

  const [questData, setQuestData] = useState<QuestData | null>(null);
  const [steps, setSteps] = useState<StepData[]>([]);
  const [attempt, setAttempt] = useState<AttemptData | null>(null);
  const [bestAttempt, setBestAttempt] = useState<AttemptData | null>(null);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [responseValue, setResponseValue] = useState('');
  const [lastScoring, setLastScoring] = useState<ScoringResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [completionData, setCompletionData] = useState<{
    totalScore: number;
    maxScore: number;
    totalTimeSeconds: number;
    newAchievements: Array<{
      titleEn: string;
      titleZh: string;
      icon: string;
      rarity: string;
    }>;
  } | null>(null);

  // Load quest data
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/quest/${slug}`);
        const json = await res.json();
        if (json.data) {
          setQuestData(json.data.quest);
          setSteps(json.data.steps || []);
          if (json.data.currentAttempt) {
            setAttempt(json.data.currentAttempt);
            setCurrentStepIdx(json.data.currentAttempt.currentStep || 0);
          }
          if (json.data.bestAttempt) {
            setBestAttempt(json.data.bestAttempt);
          }
        } else {
          setError(t('errors.not_found'));
        }
      } catch {
        setError(t('errors.load_failed'));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug, t]);

  const startQuest = useCallback(async () => {
    try {
      const res = await fetch(`/api/quest/${slug}/start`, {
        method: 'POST',
      });
      const json = await res.json();
      if (json.data) {
        setAttempt(json.data.attempt);
        if (!json.data.resumed) {
          setCurrentStepIdx(0);
        }
      } else {
        setError(json.message || t('errors.start_failed'));
      }
    } catch {
      setError(t('errors.start_failed'));
    }
  }, [slug, t]);

  const submitStep = useCallback(async () => {
    if (!attempt || !steps[currentStepIdx]) return;
    setSubmitting(true);
    setLastScoring(null);

    const step = steps[currentStepIdx];
    let responseType = 'text';
    let value = responseValue;

    if (step.stepType === 'knowledge') {
      responseType = 'text';
      value = 'viewed';
    } else if (step.stepType === 'experiment') {
      responseType = 'observation';
      value = 'confirmed';
    } else if (step.stepType === 'predict' || step.stepType === 'explain') {
      const config: StepConfig = step.config ? JSON.parse(step.config) : {};
      if (
        config.predictionType === 'numeric' ||
        config.explanationType === 'free_text'
      ) {
        responseType = step.stepType === 'predict' ? 'numeric' : 'text';
      } else if (
        config.predictionType === 'multiple_choice' ||
        config.explanationType === 'multiple_choice'
      ) {
        responseType = 'choice';
      } else if (config.predictionType === 'open_ended') {
        responseType = 'text';
      } else {
        responseType = 'text';
      }
    } else if (step.stepType === 'compare') {
      responseType = 'text';
    }

    try {
      const res = await fetch(
        `/api/quest/${slug}/step/${step.orderIndex}/submit`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            attemptId: attempt.id,
            responseType,
            responseValue: value,
          }),
        }
      );
      const json = await res.json();
      if (json.data) {
        setLastScoring(json.data.scoring || null);
        setResponseValue('');
      } else {
        setError(json.message || t('errors.submit_failed'));
      }
    } catch {
      setError(t('errors.submit_failed'));
    } finally {
      setSubmitting(false);
    }
  }, [attempt, steps, currentStepIdx, responseValue, slug, t]);

  const completeQuest = useCallback(async () => {
    if (!attempt) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/quest/${slug}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attemptId: attempt.id }),
      });
      const json = await res.json();
      if (json.data) {
        setCompletionData({
          totalScore: json.data.totalScore,
          maxScore: json.data.maxScore,
          totalTimeSeconds: json.data.totalTimeSeconds,
          newAchievements: json.data.newAchievements || [],
        });
        setShowResults(true);
      } else {
        setError(json.message || t('errors.complete_failed'));
      }
    } catch {
      setError(t('errors.complete_failed'));
    } finally {
      setSubmitting(false);
    }
  }, [attempt, slug, t]);

  const goToNextStep = useCallback(() => {
    setLastScoring(null);
    setCurrentStepIdx((prev) => Math.min(prev + 1, steps.length - 1));
  }, [steps.length]);

  const goToPrevStep = useCallback(() => {
    setLastScoring(null);
    setCurrentStepIdx((prev) => Math.max(prev - 1, 0));
  }, []);

  function getTitle(item: { titleEn: string; titleZh: string }) {
    return item.titleEn;
  }
  function getContent(item: { contentEn: string; contentZh: string }) {
    return item.contentEn;
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-1/3 animate-pulse rounded bg-muted" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-64 animate-pulse rounded bg-muted" />
      </div>
    );
  }

  if (error && !questData) {
    return (
      <div className="py-12 text-center text-destructive">{error}</div>
    );
  }

  if (!questData) return null;

  // Results screen
  if (showResults && completionData) {
    const { totalScore, maxScore, totalTimeSeconds, newAchievements } =
      completionData;
    const scorePercent =
      maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    const mins = Math.floor(totalTimeSeconds / 60);
    const secs = totalTimeSeconds % 60;

    return (
      <div className="mx-auto max-w-lg space-y-6 py-8 text-center">
        <h2 className="text-3xl font-bold">{t('results.title')}</h2>
        <div className="text-6xl font-bold text-primary">{scorePercent}%</div>
        <p className="text-muted-foreground">
          {totalScore}/{maxScore} {t('results.score')}
        </p>
        <p className="text-muted-foreground">
          {t('results.time')}:{' '}
          {t('results.minutes_short', { m: mins, s: secs })}
        </p>

        {newAchievements.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">
              {t('results.achievements_title')}
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {newAchievements.map((ach, idx) => (
                <Badge key={idx} variant="secondary" className="px-3 py-1.5 text-sm">
                  {ach.icon} {getTitle(ach)}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {newAchievements.length === 0 && (
          <p className="text-sm text-muted-foreground">
            {t('results.no_achievements')}
          </p>
        )}

        <div className="flex justify-center gap-3">
          <Button variant="outline" onClick={() => router.push('/quest')}>
            {t('results.back_to_quests')}
          </Button>
          <Button
            onClick={() => {
              setShowResults(false);
              setAttempt(null);
              setCompletionData(null);
              setCurrentStepIdx(0);
            }}
          >
            {t('results.try_again')}
          </Button>
        </div>
      </div>
    );
  }

  // Pre-start state
  if (!attempt) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{getTitle(questData)}</h1>
          <p className="mt-2 text-muted-foreground">
            {questData.descriptionEn}
          </p>
          <div className="mt-3 flex gap-2">
            <Badge variant="secondary">
              {t(`page.filter_${questData.category}`)}
            </Badge>
            <Badge variant="secondary">
              {t(`page.difficulty_${questData.difficulty}`)}
            </Badge>
            <Badge variant="outline">
              {t('card.steps', { count: questData.stepCount })}
            </Badge>
          </div>
        </div>

        {bestAttempt && bestAttempt.totalScore !== null && bestAttempt.maxPossibleScore !== null && (
          <Card>
            <CardContent className="py-4">
              <p className="text-sm text-muted-foreground">
                {t('card.best_score', {
                  score: Math.round(
                    (bestAttempt.totalScore / bestAttempt.maxPossibleScore) *
                      100
                  ),
                })}
              </p>
            </CardContent>
          </Card>
        )}

        {error && (
          <div className="text-center text-sm text-destructive">{error}</div>
        )}

        <Button size="lg" onClick={startQuest}>
          {bestAttempt
            ? t('detail.try_again')
            : t('detail.start_quest')}
        </Button>
      </div>
    );
  }

  // Active quest with steps
  const currentStep = steps[currentStepIdx];
  if (!currentStep) return null;

  const config: StepConfig = currentStep.config
    ? JSON.parse(currentStep.config)
    : {};
  const isLastStep = currentStepIdx === steps.length - 1;

  return (
    <div className="space-y-6">
      {/* Step navigation */}
      <div className="flex items-center gap-1">
        {steps.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => {
              if (idx <= (attempt.currentStep ?? 0)) {
                setCurrentStepIdx(idx);
                setLastScoring(null);
              }
            }}
            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors ${
              idx === currentStepIdx
                ? 'bg-primary text-primary-foreground'
                : idx < (attempt.currentStep ?? 0)
                  ? 'bg-primary/20 text-primary'
                  : 'bg-muted text-muted-foreground'
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        {t('detail.step_of', {
          current: currentStepIdx + 1,
          total: steps.length,
        })}
      </p>

      {/* Step content */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              {t(`step.${currentStep.stepType}`)}
            </Badge>
            <CardTitle className="text-lg">
              {getTitle(currentStep)}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Content display */}
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="whitespace-pre-wrap">{getContent(currentStep)}</p>
          </div>

          {/* Step-specific input */}
          {currentStep.stepType === 'predict' && !lastScoring && (
            <div className="space-y-3">
              {config.predictionType === 'numeric' && (
                <div>
                  <label className="text-sm font-medium">
                    {t('step.predict_numeric_label')}
                    {config.numericUnit && ` (${config.numericUnit})`}
                  </label>
                  <Input
                    type="number"
                    value={responseValue}
                    onChange={(e) => setResponseValue(e.target.value)}
                    className="mt-1"
                    step="any"
                  />
                </div>
              )}
              {config.predictionType === 'multiple_choice' && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    {t('step.predict_choice_label')}
                  </p>
                  {config.options_en?.map((opt, idx) => (
                    <Button
                      key={idx}
                      variant={
                        responseValue === String(idx)
                          ? 'default'
                          : 'outline'
                      }
                      className="mr-2"
                      onClick={() => setResponseValue(String(idx))}
                    >
                      {opt}
                    </Button>
                  ))}
                </div>
              )}
              {config.predictionType === 'open_ended' && (
                <div>
                  <label className="text-sm font-medium">
                    {t('step.predict_open_label')}
                  </label>
                  <Textarea
                    value={responseValue}
                    onChange={(e) => setResponseValue(e.target.value)}
                    className="mt-1"
                    rows={3}
                  />
                </div>
              )}
            </div>
          )}

          {currentStep.stepType === 'experiment' && !lastScoring && (
            <div className="space-y-3">
              {config.experimentSlug && (
                <div className="aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                  <iframe
                    src={`/embed/${config.experimentSlug}`}
                    className="h-full w-full"
                    title="Experiment"
                    sandbox="allow-scripts allow-same-origin"
                  />
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                {t('step.experiment_instructions')}
              </p>
            </div>
          )}

          {currentStep.stepType === 'compare' && !lastScoring && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="py-3 text-center">
                    <p className="text-sm font-medium">
                      {t('step.compare_predicted')}
                    </p>
                    <p className="text-lg">--</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="py-3 text-center">
                    <p className="text-sm font-medium">
                      {t('step.compare_observed')}
                    </p>
                    <p className="text-lg">--</p>
                  </CardContent>
                </Card>
              </div>
              {config.feedbackEn && (
                <p className="text-sm text-muted-foreground">
                  {config.feedbackEn}
                </p>
              )}
            </div>
          )}

          {currentStep.stepType === 'explain' && !lastScoring && (
            <div className="space-y-3">
              {config.explanationType === 'multiple_choice' && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    {t('step.explain_choice_label')}
                  </p>
                  {config.options_en?.map((opt, idx) => (
                    <Button
                      key={idx}
                      variant={
                        responseValue === String(idx)
                          ? 'default'
                          : 'outline'
                      }
                      className="mr-2"
                      onClick={() => setResponseValue(String(idx))}
                    >
                      {opt}
                    </Button>
                  ))}
                </div>
              )}
              {config.explanationType === 'free_text' && (
                <div>
                  <label className="text-sm font-medium">
                    {t('step.explain_text_label')}
                  </label>
                  <Textarea
                    value={responseValue}
                    onChange={(e) => setResponseValue(e.target.value)}
                    className="mt-1"
                    rows={4}
                  />
                </div>
              )}
            </div>
          )}

          {/* Scoring feedback */}
          {lastScoring && (
            <div className="rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">
                  {lastScoring.score}/{lastScoring.maxScore}
                </span>
              </div>
              {lastScoring.feedback && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {lastScoring.feedback}
                </p>
              )}
            </div>
          )}

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={goToPrevStep}
          disabled={currentStepIdx === 0}
        >
          {t('detail.prev_step')}
        </Button>

        <div className="flex gap-2">
          {!lastScoring && (
            <Button
              onClick={submitStep}
              disabled={submitting}
            >
              {submitting
                ? t('detail.submitting')
                : t('detail.submit')}
            </Button>
          )}

          {lastScoring && !isLastStep && (
            <Button onClick={goToNextStep}>
              {t('detail.next_step')}
            </Button>
          )}

          {lastScoring && isLastStep && (
            <Button
              onClick={completeQuest}
              disabled={submitting}
            >
              {submitting
                ? t('detail.completing')
                : t('detail.complete_quest')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
