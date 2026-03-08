'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Atom,
  Download,
  Expand,
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
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';

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
  const locale = useLocale();
  const t = useTranslations('upg');
  const { user, isCheckSign, setIsShowSignModal, fetchUserCredits } =
    useAppContext();

  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStepText, setProgressStepText] = useState('');
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

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

  const handleGenerate = async (isRegenerate = false) => {
    if (!user) {
      setIsShowSignModal(true);
      return;
    }

    const trimmed = prompt.trim();
    if (trimmed.length < MIN_PROMPT_LENGTH) {
      toast.error(t('generator.min_chars', { min: MIN_PROMPT_LENGTH }));
      return;
    }
    if (trimmed.length > MAX_PROMPT_LENGTH) {
      toast.error(t('generator.max_chars', { max: MAX_PROMPT_LENGTH }));
      return;
    }

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
          language: locale === 'en' ? 'en' : 'zh',
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
      await fetchUserCredits();
    } catch (e: any) {
      stopProgressSimulation();
      setProgress(0);
      const msg = e.message || t('errors.generation_failed');
      setError(msg);
      toast.error(msg);
      await fetchUserCredits();
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
    } catch (e: any) {
      toast.error(e.message || t('errors.report_failed'));
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
                    onClick={() => setPrompt(locale === 'en' ? tmpl.prompt_en : tmpl.prompt_zh)}
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
                  user && !isCheckSign && "text-base font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 hover:shadow-[0_0_20px_theme(colors.purple.500)] hover:scale-[1.02]"
                )}
                onClick={() => {
                  if (!user && !isCheckSign) {
                    setIsShowSignModal(true);
                  } else {
                    handleGenerate(false);
                  }
                }}
                disabled={isCheckSign || isGenerating || (!!user && !isPromptValid)}
              >
                {isCheckSign ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('generator.checking_account')}
                  </>
                ) : !user ? (
                  <>
                    <User className="mr-2 h-4 w-4" />
                    {t('generator.sign_in_to_generate')}
                  </>
                ) : isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('generator.generating')}
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {t('generator.generate_button', {
                      credits: UPG_CREDITS_PER_GENERATION,
                    })}
                  </>
                )}
              </Button>

              {user && (
                <p className="text-muted-foreground text-center text-xs">
                  {t('generator.credits_remaining', {
                    credits: remainingCredits,
                  })}
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
                  <div className="relative group">
                    <div className="overflow-hidden rounded-lg border shadow-sm">
                      <iframe
                        ref={iframeRef}
                        srcDoc={result.htmlContent}
                        sandbox="allow-scripts"
                        className={cn(
                          "h-[70vh] min-h-[500px] w-full border-0 transition-opacity duration-500 ease-out",
                          isIframeLoaded ? "opacity-100" : "opacity-0"
                        )}
                        onLoad={() => setIsIframeLoaded(true)}
                        title={t('view.iframe_title')}
                      />
                    </div>

                    {/* Action Bar — visible on hover */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border bg-background/80 p-1.5 shadow-lg backdrop-blur-md transition-all duration-200 ease-out opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0">
                      <div className="flex items-center gap-0.5">
                        <Button variant="ghost" size="icon" className="h-9 w-9 cursor-pointer" onClick={handleFullscreen}>
                          <Expand className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 cursor-pointer" onClick={handleDownload}>
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 cursor-pointer" onClick={handleReport}>
                          <Flag className="h-4 w-4" />
                        </Button>
                        {hasGenerated && (
                          <>
                            <div className="mx-1 h-5 w-px bg-border" />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleGenerate(true)}
                              disabled={isGenerating}
                              className="h-9 w-9 cursor-pointer text-primary hover:text-primary"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
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
