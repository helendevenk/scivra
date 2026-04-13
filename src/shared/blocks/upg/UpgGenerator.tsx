'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Atom,
  Clock,
  Download,
  Expand,
  Eye,
  Flag,
  Dna,
  Loader2,
  RefreshCw,
  Sparkles,
  Split,
  Torus,
  Fan,
  User,
  Waves,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Link } from '@/core/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Progress } from '@/shared/components/ui/progress';
import { Textarea } from '@/shared/components/ui/textarea';
import { useAppContext } from '@/shared/contexts/app';
import { cn } from '@/shared/lib/utils';
import {
  UPG_CREDITS_PER_GENERATION,
  UPG_CREDITS_PER_REGENERATION,
} from '@/shared/lib/upg/constants';
import { DisciplineSelector } from './DisciplineSelector';

const MIN_PROMPT_LENGTH = 2;
const MAX_PROMPT_LENGTH = 500;

const PRESET_TEMPLATES = [
  { key: 'doppler_effect', icon: Waves, prompt_zh: '多普勒效应', prompt_en: 'Doppler Effect' },
  { key: 'double_slit', icon: Split, prompt_zh: '双缝干涉实验', prompt_en: 'Double-Slit Experiment' },
  { key: 'molecular_orbital', icon: Atom, prompt_zh: '分子轨道理论', prompt_en: 'Molecular Orbital Theory' },
  { key: 'dna_helix', icon: Dna, prompt_zh: 'DNA双螺旋结构', prompt_en: 'DNA Double Helix Structure' },
  { key: 'black_hole', icon: Torus, prompt_zh: '黑洞引力透镜效应', prompt_en: 'Black Hole Gravitational Lensing' },
  { key: 'turbocharger', icon: Fan, prompt_zh: '涡轮增压发动机工作原理', prompt_en: 'How a Turbocharger Works' },
] as const;

const PROGRESS_STEPS = ['analyzing', 'building', 'rendering', 'finishing'];

interface GenerationResult {
  id: string;
  htmlContent: string;
}

interface UpgGeneratorProps {
  srOnlyTitle?: string;
  className?: string;
}

export function UpgGenerator({ srOnlyTitle, className }: UpgGeneratorProps) {
  const t = useTranslations('upg');
  const { user, isCheckSign, setIsShowSignModal, fetchUserCredits } =
    useAppContext();

  const [prompt, setPrompt] = useState('');
  const [discipline, setDiscipline] = useState('physics');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStepText, setProgressStepText] = useState('');
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  const [history, setHistory] = useState<Array<{
    id: string; prompt: string; status: string; createdAt: string;
  }>>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressStepTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const promptLength = prompt.trim().length;
  const isPromptValid =
    promptLength >= MIN_PROMPT_LENGTH && promptLength <= MAX_PROMPT_LENGTH;
  const remainingCredits = user?.credits?.remainingCredits ?? 0;

  const startProgressSimulation = useCallback(() => {
    setProgress(5);
    setProgressStepText(t('generator.progress_steps.analyzing'));
    let currentProgress = 5;
    let currentStepIndex = 0;

    progressTimerRef.current = setInterval(() => {
      currentProgress += Math.random() * 8;
      if (currentProgress > 90) currentProgress = 90;
      setProgress(Math.round(currentProgress));
    }, 800);

    progressStepTimerRef.current = setInterval(() => {
      currentStepIndex = (currentStepIndex + 1) % PROGRESS_STEPS.length;
      setProgressStepText(t(`generator.progress_steps.${PROGRESS_STEPS[currentStepIndex]}`));
    }, 2000);
  }, [t]);

  const stopProgressSimulation = useCallback(() => {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
    if (progressStepTimerRef.current) {
      clearInterval(progressStepTimerRef.current);
      progressStepTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopProgressSimulation();
  }, [stopProgressSimulation]);

  const fetchHistory = useCallback(async () => {
    if (!user) return;
    setHistoryLoading(true);
    try {
      const resp = await fetch('/api/upg/my?page=1&pageSize=10');
      const { code, data } = await resp.json();
      if (code === 0 && data?.list) {
        setHistory(data.list);
      }
    } catch {
      // silently fail
    } finally {
      setHistoryLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Track whether anonymous user has generated (to show registration prompt)
  const [showRegistrationPrompt, setShowRegistrationPrompt] = useState(false);

  const handleGenerate = async (isRegenerate = false) => {
    const trimmed = prompt.trim();
    if (trimmed.length < MIN_PROMPT_LENGTH) {
      toast.error(t('generator.min_chars', { min: MIN_PROMPT_LENGTH }));
      return;
    }
    if (trimmed.length > MAX_PROMPT_LENGTH) {
      toast.error(t('generator.max_chars', { max: MAX_PROMPT_LENGTH }));
      return;
    }

    // Logged-in users: check credits
    if (user) {
      const cost = isRegenerate
        ? UPG_CREDITS_PER_REGENERATION
        : UPG_CREDITS_PER_GENERATION;
      if (remainingCredits < cost) {
        toast.error(
          t('errors.insufficient_credits', {
            cost,
            remaining: remainingCredits,
          })
        );
        return;
      }
    }
    // Anonymous users: let the backend handle rate limiting (1/day IP-based)

    setIsGenerating(true);
    setError(null);
    setResult(null);
    setIsIframeLoaded(false);
    startProgressSimulation();

    try {
      const resp = await fetch('/api/upg/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: trimmed,
          language: 'en',
          discipline,
          isRegenerate,
        }),
      });

      const { code, message, data } = await resp.json();
      if (code !== 0) {
        throw new Error(message || t('errors.generation_failed'));
      }

      stopProgressSimulation();
      setProgress(100);
      setResult({ id: data.id, htmlContent: data.htmlContent });
      setHasGenerated(true);
      toast.success(t('generator.success'));
      if (user) {
        await fetchUserCredits();
        fetchHistory();
      } else {
        // Anonymous user just generated successfully — show registration prompt
        setShowRegistrationPrompt(true);
      }
    } catch (e: unknown) {
      stopProgressSimulation();
      setProgress(0);
      const msg = (e instanceof Error ? e.message : String(e)) || t('errors.generation_failed');
      setError(msg);
      // Anonymous rate limit hit — prompt to sign in
      if (!user && msg.includes('once per day')) {
        setShowRegistrationPrompt(true);
      }
      toast.error(msg);
      if (user) {
        await fetchUserCredits();
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!result?.htmlContent) return;
    const blob = new Blob([result.htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `upg-${result.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 200);
    toast.success(t('generator.download_success'));
  };

  const handleFullscreen = () => {
    iframeRef.current?.requestFullscreen?.();
  };

  const handleReport = async () => {
    if (!result?.id || !user) return;
    try {
      const resp = await fetch(`/api/upg/${result.id}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportType: 'inaccurate', content: '' }),
      });
      const { code, message } = await resp.json();
      if (code !== 0) throw new Error(message);
      toast.success(t('errors.report_success'));
    } catch (e: unknown) {
      toast.error((e instanceof Error ? e.message : String(e)) || t('errors.report_failed'));
    }
  };

  return (
    <section className={cn('py-16 md:py-24', className)}>
      <style>
        {`
          @keyframes gradient-rotate {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .animate-gradient-border {
            background-size: 200% 200%;
            animation: gradient-rotate 5s ease infinite;
          }
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.4s ease-out forwards;
          }
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          .animate-shimmer {
            background: linear-gradient(90deg, transparent 0%, rgba(168,85,247,0.15) 50%, transparent 100%);
            background-size: 200% 100%;
            animation: shimmer 2s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .animate-gradient-border,
            .animate-fade-in-up,
            .animate-shimmer { animation: none; }
          }
        `}
      </style>
      <div className="container">
        {srOnlyTitle && <h2 className="sr-only">{srOnlyTitle}</h2>}
        <div className="mx-auto max-w-5xl space-y-8">
          <Card className="overflow-hidden">
            <CardContent className="space-y-6 pt-6">
              <DisciplineSelector selected={discipline} onChange={setDiscipline} />
              <div className="space-y-2">
                <div className="relative rounded-lg p-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 animate-gradient-border">
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={t('generator.placeholder')}
                    className="min-h-28 w-full resize-none rounded-[7px] border-0 bg-background p-4 text-base shadow-none focus-visible:ring-0 placeholder:text-muted-foreground/60"
                  />
                </div>
                <div className="text-muted-foreground flex items-center justify-between px-2 text-xs">
                  <span>
                    {promptLength} / {MAX_PROMPT_LENGTH}
                  </span>
                  {promptLength > MAX_PROMPT_LENGTH && (
                    <span className="text-destructive">
                      {t('generator.char_limit_exceeded')}
                    </span>
                  )}
                </div>
              </div>

              {/* Preset Templates */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {PRESET_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.key}
                    type="button"
                    onClick={() => setPrompt(tmpl.prompt_en)}
                    disabled={isGenerating}
                    className={cn(
                      'group relative flex items-center gap-3 rounded-lg border p-3 text-left cursor-pointer',
                      'transition-all duration-200 ease-out',
                      'hover:border-primary/60 hover:bg-primary/5 hover:shadow-sm',
                      'active:scale-[0.98]',
                      'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none'
                    )}
                  >
                    <tmpl.icon className="h-5 w-5 text-primary transition-transform duration-200 ease-out group-hover:scale-110" />
                    <span className="text-sm font-medium">{t(`templates.${tmpl.key}`)}</span>
                  </button>
                ))}
              </div>

              {/* Generate Button */}
              <Button
                size="lg"
                className={cn(
                  "w-full",
                  !isCheckSign && "text-base font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 hover:shadow-[0_0_20px_theme(colors.purple.500)] hover:scale-[1.02]"
                )}
                onClick={() => handleGenerate(false)}
                disabled={isCheckSign || isGenerating || !isPromptValid}
              >
                {isCheckSign ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('generator.checking_account')}
                  </>
                ) : isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('generator.generating')}
                  </>
                ) : user ? (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {t('generator.generate_button', {
                      credits: UPG_CREDITS_PER_GENERATION,
                    })}
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {t('generator.try_free')}
                  </>
                )}
              </Button>

              {user ? (
                <p className="text-muted-foreground text-center text-xs">
                  {t('generator.credits_remaining', {
                    credits: remainingCredits,
                  })}
                </p>
              ) : !isCheckSign && (
                <p className="text-muted-foreground text-center text-xs">
                  {t('generator.free_trial_hint')}
                </p>
              )}

              {/* Progress */}
              {isGenerating && (
                <div className="animate-fade-in-up space-y-3 rounded-lg border p-4">
                  <div className="relative overflow-hidden rounded-full">
                    <Progress value={progress} className="[&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-pink-500 [&>div]:transition-all [&>div]:duration-500 [&>div]:ease-out" />
                    <div className="absolute inset-0 animate-shimmer rounded-full" />
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <p className="min-h-[16px]">{progressStepText}</p>
                    <span className="font-mono tabular-nums">{progress}%</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* History */}
          {user && history.length > 0 && (
            <Card>
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{t('history.title')}</span>
                  </div>
                  <Link href="/upg/my">
                    <Button variant="ghost" size="sm" className="text-xs cursor-pointer">
                      {t('history.view_all') ?? 'View All'}
                    </Button>
                  </Link>
                </div>
                <div className="space-y-1.5">
                  {history.map((gen) => (
                    <div
                      key={gen.id}
                      className="flex items-center justify-between rounded-lg px-3 py-2 transition-colors hover:bg-muted/50"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <span className={cn("inline-block h-2 w-2 rounded-full flex-shrink-0", {
                          'bg-green-500': gen.status === 'completed',
                          'bg-red-500': gen.status === 'failed',
                          'bg-amber-500': gen.status === 'pending' || gen.status === 'generating',
                        })} />
                        <span className="text-sm truncate">{gen.prompt}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                        <span className="text-xs text-muted-foreground">
                          {new Date(gen.createdAt).toLocaleDateString('en-US', {
                            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
                          })}
                        </span>
                        {gen.status === 'completed' && (
                          <Link href={`/upg/view/${gen.id}`}>
                            <Button variant="ghost" size="icon" className="h-7 w-7 cursor-pointer">
                              <Eye className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Result Area */}
          {(result || error) && (
            <Card className="animate-fade-in-up overflow-hidden">
              <CardContent className="space-y-4 pt-6">
                {error && !result && (
                  <div className="text-destructive rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-center text-sm">
                    {error}
                  </div>
                )}

                {result && (
                  <div className="relative">
                    <div className="overflow-hidden rounded-lg border shadow-sm">
                      <iframe
                        ref={iframeRef}
                        srcDoc={result.htmlContent}
                        sandbox="allow-scripts allow-same-origin"
                        className={cn(
                          "h-[70vh] min-h-[500px] w-full border-0 transition-opacity duration-500 ease-out",
                          isIframeLoaded ? "opacity-100" : "opacity-0"
                        )}
                        onLoad={() => setIsIframeLoaded(true)}
                        title={t('view.iframe_title')}
                      />
                    </div>

                    {/* Action Bar — always visible */}
                    <div className="mt-3 flex items-center justify-center gap-2">
                      <Button variant="outline" size="sm" className="gap-1.5 cursor-pointer" onClick={handleFullscreen}>
                        <Expand className="h-3.5 w-3.5" />
                        {t('actions.fullscreen')}
                      </Button>
                      <Button variant="outline" size="sm" className="gap-1.5 cursor-pointer" onClick={handleDownload}>
                        <Download className="h-3.5 w-3.5" />
                        {t('actions.download_short')}
                      </Button>
                      {hasGenerated && user && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleGenerate(true)}
                          disabled={isGenerating}
                          className="gap-1.5 cursor-pointer text-primary hover:text-primary"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          {t('actions.regenerate', { credits: UPG_CREDITS_PER_REGENERATION })}
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="gap-1.5 cursor-pointer text-muted-foreground" onClick={handleReport}>
                        <Flag className="h-3.5 w-3.5" />
                        {t('actions.report')}
                      </Button>
                    </div>

                    {/* Anonymous user registration prompt overlay */}
                    {showRegistrationPrompt && !user && (
                      <div className="absolute inset-0 flex items-end justify-center rounded-lg bg-gradient-to-t from-background via-background/80 to-transparent">
                        <div className="mb-8 text-center space-y-3 p-6">
                          <p className="text-lg font-semibold">
                            {t('generator.anon_save_prompt')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {t('generator.anon_save_description')}
                          </p>
                          <div className="flex items-center justify-center gap-3">
                            <Button
                              onClick={() => setIsShowSignModal(true)}
                              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                            >
                              {t('generator.anon_sign_up')}
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => setShowRegistrationPrompt(false)}
                            >
                              {t('generator.anon_later')}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
