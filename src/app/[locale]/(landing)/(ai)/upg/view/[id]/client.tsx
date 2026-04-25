'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Code, Download, Expand, Flag, Share2, Atom, Globe, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Link } from '@/core/i18n/navigation';
import { Button } from '@/shared/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/ui/tooltip';
import { cn } from '@/shared/lib/utils';
import { AutopilotBridge, AutopilotToggle } from '@/shared/blocks/autopilot';
import { injectAutopilotScript, hasAutopilotSupport } from '@/shared/lib/autopilot/inject';
import { getUuid } from '@/shared/lib/hash';


interface UpgViewClientProps {
  id: string;
  prompt: string;
  htmlContent: string;
  isPublic: boolean;
  isOwner: boolean;
  language: 'en';
  isLoggedIn: boolean;
}

export function UpgViewClient({
  id,
  prompt,
  htmlContent,
  isPublic,
  isOwner,
  language,
  isLoggedIn,
}: UpgViewClientProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const t = useTranslations('upg');
  const router = useRouter();
  const [isIframeLoading, setIsIframeLoading] = useState(true);
  const [autopilotActive, setAutopilotActive] = useState(false);
  const [autopilotSessionId, setAutopilotSessionId] = useState<string>('');

  const supportsAutopilot = useMemo(() => hasAutopilotSupport(htmlContent), [htmlContent]);

  // Inject autopilot script when active
  const iframeSrc = useMemo(() => {
    if (autopilotActive && autopilotSessionId) {
      return injectAutopilotScript(htmlContent, autopilotSessionId, language);
    }
    return htmlContent;
  }, [autopilotActive, autopilotSessionId, htmlContent, language]);

  const handleToggleAutopilot = useCallback(() => {
    if (autopilotActive) {
      setAutopilotActive(false);
      setAutopilotSessionId('');
    } else {
      const newSessionId = getUuid();
      setAutopilotSessionId(newSessionId);
      setIsIframeLoading(true);
      setAutopilotActive(true);
    }
  }, [autopilotActive]);

  const handleAutopilotEnd = useCallback(() => {
    setAutopilotActive(false);
  }, []);

  const handleDownload = () => {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `upg-${id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 200);
    toast.success(t('generator.download_success'));
  };

  const handleFullscreen = () => {
    iframeRef.current?.requestFullscreen?.();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success(t('actions.share_success'));
  };

  const handleReport = async () => {
    try {
      const resp = await fetch(`/api/upg/${id}/report`, {
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'f') {
        e.preventDefault();
        handleFullscreen();
      } else if (e.key.toLowerCase() === 'd') {
        e.preventDefault();
        handleDownload();
      } else if (e.key.toLowerCase() === 't') {
        e.preventDefault();
        if (supportsAutopilot && isLoggedIn) handleToggleAutopilot();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        router.back();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [router, supportsAutopilot, isLoggedIn, handleToggleAutopilot]);

  const shortcuts = [
    { keyName: 'F', action: t('actions.fullscreen') },
    { keyName: 'D', action: t('actions.download_short') },
    { keyName: 'T', action: 'AI Tutor' },
    { keyName: 'Esc', action: t('actions.back') },
  ];

  return (
    <div className="relative min-h-screen bg-background">
      <style>
        {`
          @keyframes fade-in-down {
            from { opacity: 0; transform: translateY(-8px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-down {
            animation: fade-in-down 0.3s ease-out forwards;
          }
          @media (prefers-reduced-motion: reduce) {
            .animate-fade-in-down { animation: none; }
          }
        `}
      </style>

      {/* Top bar */}
      <header className="sticky top-0 z-20 w-full animate-fade-in-down">
        <div className="container my-3 md:my-4">
          <div className="rounded-2xl border bg-background/80 p-2.5 shadow-md backdrop-blur-lg">
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-1 items-center gap-2 min-w-0">
                <Link href="/upg/my" passHref>
                  <Button variant="ghost" size="icon" className="h-9 w-9 cursor-pointer">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-full px-3 py-1.5 border">
                  <Atom className="h-3.5 w-3.5 text-primary" />
                  <p className="font-mono truncate max-w-sm text-xs">{prompt}</p>
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9 cursor-pointer" onClick={handleShare}>
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">{t('actions.share')}</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9 cursor-pointer" onClick={handleFullscreen}>
                        <Expand className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">{t('actions.fullscreen')}</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9 cursor-pointer" onClick={handleDownload}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">{t('actions.download_short')}</TooltipContent>
                  </Tooltip>
                  <div className="mx-0.5 h-5 w-px bg-border" />

                  {/* AI Tutor button */}
                  <AutopilotToggle
                    isActive={autopilotActive}
                    isSupported={supportsAutopilot}
                    isLoggedIn={isLoggedIn}
                    onToggle={handleToggleAutopilot}
                  />

                  <div className="mx-0.5 h-5 w-px bg-border" />

                  {/* Embed button */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 cursor-pointer"
                        onClick={() => {
                          const embedUrl = `${window.location.origin}/embed/${id}`;
                          const embedCode = `<iframe src="${embedUrl}" width="800" height="600" frameborder="0" allowfullscreen></iframe>`;
                          navigator.clipboard.writeText(embedCode);
                          toast.success('Embed code copied!');
                        }}
                      >
                        <Code className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Embed</TooltipContent>
                  </Tooltip>

                  {/* Publish button (owner only) */}
                  {isOwner && (
                    <>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={isPublic ? 'default' : 'outline'}
                            size="icon"
                            className="h-9 w-9 cursor-pointer"
                            onClick={async () => {
                              try {
                                const res = await fetch('/api/gallery/publish', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ id }),
                                });
                                const json = await res.json();
                                if (json.code !== 0) {
                                  toast.error(json.message || 'Publish failed');
                                  return;
                                }
                                toast.success(json.data.isPublic ? 'Published!' : 'Unpublished');
                              } catch {
                                toast.error('Publish failed');
                              }
                            }}
                          >
                            <Globe className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                          {isPublic ? 'Unpublish' : 'Publish to Gallery'}
                        </TooltipContent>
                      </Tooltip>
                    </>
                  )}

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-9 w-9 cursor-pointer text-muted-foreground hover:text-destructive" onClick={handleReport}>
                        <Flag className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">{t('actions.report')}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container pb-8">
        <div className="mx-auto max-w-6xl space-y-4">
          {/* Iframe */}
          <div className="overflow-hidden rounded-xl border shadow-lg">
            {isIframeLoading && (
              <div className="flex h-[80vh] min-h-[600px] w-full items-center justify-center bg-muted/30">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <Atom className="h-8 w-8 animate-spin" />
                  <span className="text-sm">{t('view.loading')}</span>
                </div>
              </div>
            )}
            <iframe
              ref={iframeRef}
              srcDoc={iframeSrc}
              sandbox="allow-scripts allow-same-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              className={cn(
                "h-[80vh] min-h-[600px] w-full border-0 transition-opacity duration-300 ease-out",
                isIframeLoading ? 'opacity-0 h-0 overflow-hidden' : 'opacity-100'
              )}
              title={`UPG: ${prompt}`}
              onLoad={() => setIsIframeLoading(false)}
            />
          </div>

          {/* Keyboard Shortcuts Info */}
          <div className="flex items-center justify-center gap-4 py-2 text-xs text-muted-foreground">
            {shortcuts.map(({ keyName, action }) => (
              <div key={keyName} className="flex items-center gap-1.5">
                <kbd className="inline-flex h-5 select-none items-center rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
                  {keyName}
                </kbd>
                <span>{action}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* AutopilotBridge: pure logic, no UI */}
      {autopilotActive && autopilotSessionId && (
        <AutopilotBridge
          iframeRef={iframeRef}
          generationId={id}
          prompt={prompt}
          language={language}
          sessionId={autopilotSessionId}
          isActive={autopilotActive}
          onSessionEnd={handleAutopilotEnd}
        />
      )}
    </div>
  );
}
