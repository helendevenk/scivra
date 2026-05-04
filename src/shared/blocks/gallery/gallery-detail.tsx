'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  ArrowLeft,
  BadgeCheck,
  Code,
  Eye,
  GitFork,
  Heart,
  History,
  Loader2,
  Wand2,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { useRouter } from '@/core/i18n/navigation';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Textarea } from '@/shared/components/ui/textarea';
import { useAppContext } from '@/shared/contexts/app';
import {
  UPG_CREDITS_PER_REFINEMENT,
  UPG_CREDITS_PER_REGENERATION,
} from '@/shared/lib/upg/constants';
import { cn } from '@/shared/lib/utils';

interface GalleryDetail {
  id: string;
  prompt: string;
  language: string;
  htmlContent: string;
  userId: string | null;
  userName?: string | null;
  viewCount: number;
  likeCount: number;
  forkCount: number;
  tags: string[] | null;
  validationScore: number | null;
  validationDetails: string | null;
  forkedFrom: string | null;
  version: number | null;
  parentId: string | null;
  createdAt: string;
  isLiked: boolean;
}

interface VersionItem {
  id: string;
  version: number | null;
  parentId: string | null;
  refinementPrompt: string | null;
  status: string | null;
  validationScore: number | null;
  createdAt: string;
}

export function GalleryDetailClient({ id }: { id: string }) {
  const t = useTranslations('gallery');
  const { user } = useAppContext();
  const router = useRouter();

  const [detail, setDetail] = useState<GalleryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [forking, setForking] = useState(false);
  const [embedOpen, setEmbedOpen] = useState(false);
  const [refineOpen, setRefineOpen] = useState(false);
  const [refinePrompt, setRefinePrompt] = useState('');
  const [refining, setRefining] = useState(false);
  const [versions, setVersions] = useState<VersionItem[]>([]);
  const [versionsOpen, setVersionsOpen] = useState(false);

  const fetchDetail = useCallback(async () => {
    try {
      const res = await fetch(`/api/gallery/${id}`);
      const json = await res.json();
      if (json.code !== 0) {
        toast.error(json.message);
        return;
      }
      setDetail(json.data);
    } catch {
      toast.error(t('errors.load_failed'));
    } finally {
      setLoading(false);
    }
  }, [id, t]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  const handleLike = async () => {
    if (!user) {
      toast.error(t('detail.sign_in_to_like'));
      return;
    }
    try {
      const res = await fetch(`/api/gallery/${id}/like`, { method: 'POST' });
      const json = await res.json();
      if (json.code !== 0) {
        toast.error(json.message || t('errors.like_failed'));
        return;
      }
      setDetail((prev) =>
        prev
          ? {
              ...prev,
              isLiked: json.data.liked,
              likeCount: prev.likeCount + (json.data.liked ? 1 : -1),
            }
          : prev
      );
    } catch {
      toast.error(t('errors.like_failed'));
    }
  };

  const handleFork = async () => {
    if (!user) {
      toast.error(t('detail.sign_in_to_fork'));
      return;
    }
    setForking(true);
    try {
      const res = await fetch(`/api/gallery/${id}/fork`, { method: 'POST' });
      const json = await res.json();
      if (json.code !== 0) {
        toast.error(json.message || t('errors.fork_failed'));
        return;
      }
      router.push(`/upg/view/${json.data.id}`);
    } catch {
      toast.error(t('errors.fork_failed'));
    } finally {
      setForking(false);
    }
  };

  const handleRefine = async () => {
    if (!user) {
      toast.error(t('detail.sign_in_to_refine'));
      return;
    }
    if (refinePrompt.trim().length < 2) return;

    setRefining(true);
    try {
      const res = await fetch(`/api/upg/${id}/refine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refinementPrompt: refinePrompt.trim(),
          language: detail?.language || 'en',
        }),
      });
      const json = await res.json();
      if (json.code !== 0) {
        toast.error(json.message || 'Refinement failed');
        return;
      }
      toast.success(t('refine.success'));
      setRefineOpen(false);
      setRefinePrompt('');
      router.push(`/gallery/${json.data.id}`);
    } catch {
      toast.error('Refinement failed');
    } finally {
      setRefining(false);
    }
  };

  const fetchVersions = useCallback(async () => {
    try {
      const res = await fetch(`/api/upg/${id}/versions`);
      const json = await res.json();
      if (json.code === 0) {
        setVersions(json.data || []);
      }
    } catch {
      // silent fail
    }
  }, [id]);

  const embedCode = detail
    ? `<iframe src="${typeof window !== 'undefined' ? window.location.origin : ''}/api/embed/${detail.id}" width="800" height="600" frameborder="0" allowfullscreen></iframe>`
    : '';
  const validationBadge = detail
    ? detail.validationScore === null
      ? {
          label: t('badge.not_checked'),
          className: 'bg-muted text-muted-foreground hover:bg-muted',
        }
      : detail.validationScore >= 70
        ? {
            label: t('badge.verified'),
            className: 'bg-emerald-600 text-white hover:bg-emerald-700',
          }
        : {
            label: t('badge.needs_review'),
            className:
              'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300',
          }
    : null;

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-8">
        <Skeleton className="mb-4 h-8 w-64" />
        <Skeleton className="h-[500px] rounded-xl" />
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="py-20 text-center">
        <p className="text-lg">{t('errors.load_failed')}</p>
        <Button
          variant="ghost"
          className="mt-4"
          onClick={() => router.push('/gallery')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('page.title')}
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="mb-2"
            onClick={() => router.push('/gallery')}
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            {t('page.title')}
          </Button>
          <h1 className="text-2xl font-bold">{detail.prompt}</h1>
          <div className="mt-1 flex items-center gap-2">
            <Badge variant="outline" className="text-xs uppercase">
              {t('badge.language', { language: detail.language || 'en' })}
            </Badge>
            {validationBadge && (
              <Badge
                variant={
                  detail.validationScore !== null && detail.validationScore < 70
                    ? 'outline'
                    : 'default'
                }
                className={cn('gap-0.5', validationBadge.className)}
              >
                {detail.validationScore !== null &&
                  detail.validationScore >= 70 && (
                    <BadgeCheck className="h-3.5 w-3.5" />
                  )}
                {validationBadge.label}
                {detail.validationScore !== null && (
                  <span className="ml-1 text-[10px] opacity-80">
                    {detail.validationScore}%
                  </span>
                )}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            {detail.userName
              ? t('card.by', { author: detail.userName })
              : t('card.anonymous')}
            {' · '}
            {t('detail.created', {
              date: new Date(detail.createdAt).toLocaleDateString(),
            })}
          </p>
          {detail.forkedFrom && (
            <p className="text-muted-foreground mt-1 text-xs">
              {t('detail.forked_from')}{' '}
              <a
                href={`/gallery/${detail.forkedFrom}`}
                className="hover:text-foreground underline"
              >
                {detail.forkedFrom.slice(0, 8)}...
              </a>
            </p>
          )}
        </div>
      </div>

      {/* Tags */}
      {detail.tags && detail.tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-1.5">
          {detail.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Visualization iframe */}
      <Card className="mb-6">
        <CardContent className="p-0">
          <p className="text-muted-foreground border-b px-4 py-2 text-xs">
            {t('detail.render_hint')}
          </p>
          <iframe
            srcDoc={detail.htmlContent}
            className="h-[500px] w-full rounded-xl border-0"
            sandbox="allow-scripts"
            title={detail.prompt}
          />
        </CardContent>
      </Card>

      {/* Action bar */}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant={detail.isLiked ? 'default' : 'outline'}
          size="sm"
          onClick={handleLike}
        >
          <Heart
            className={cn('mr-1 h-4 w-4', detail.isLiked && 'fill-current')}
          />
          {detail.likeCount}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleFork}
          disabled={forking}
        >
          {forking ? (
            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
          ) : (
            <GitFork className="mr-1 h-4 w-4" />
          )}
          {forking
            ? t('actions.forking')
            : t('actions.fork', { credits: UPG_CREDITS_PER_REGENERATION })}
        </Button>

        <Button variant="outline" size="sm" onClick={() => setRefineOpen(true)}>
          <Wand2 className="mr-1 h-4 w-4" />
          {t('refine.button', { credits: UPG_CREDITS_PER_REFINEMENT })}
        </Button>

        <Button variant="outline" size="sm" onClick={() => setEmbedOpen(true)}>
          <Code className="mr-1 h-4 w-4" />
          {t('actions.embed')}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            fetchVersions();
            setVersionsOpen(true);
          }}
        >
          <History className="mr-1 h-4 w-4" />
          {detail.version && detail.version > 1
            ? t('refine.version', { version: detail.version })
            : null}
        </Button>

        <span className="text-muted-foreground ml-auto flex items-center gap-1 text-sm">
          <Eye className="h-4 w-4" />
          {detail.viewCount}
        </span>
      </div>

      {/* Refine dialog */}
      <Dialog open={refineOpen} onOpenChange={setRefineOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('refine.title')}</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground mb-3 text-sm">
            {t('refine.description')}
          </p>
          <Textarea
            placeholder={t('refine.placeholder')}
            value={refinePrompt}
            onChange={(e) => setRefinePrompt(e.target.value)}
            rows={4}
            maxLength={1000}
          />
          <div className="mt-2 flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setRefineOpen(false)}
              disabled={refining}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleRefine}
              disabled={refining || refinePrompt.trim().length < 2}
            >
              {refining ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-1 h-4 w-4" />
              )}
              {refining ? t('refine.refining') : t('refine.submit')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Version history dialog */}
      <Dialog open={versionsOpen} onOpenChange={setVersionsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('refine.version_history')}</DialogTitle>
          </DialogHeader>
          {versions.length === 0 ? (
            <p className="text-muted-foreground py-4 text-center text-sm">
              {t('refine.original')}
            </p>
          ) : (
            <div className="max-h-80 space-y-2 overflow-y-auto">
              {versions.map((v) => (
                <button
                  key={v.id}
                  className={cn(
                    'w-full rounded-lg border p-3 text-left transition-colors',
                    v.id === id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/50'
                  )}
                  onClick={() => {
                    setVersionsOpen(false);
                    if (v.id !== id) router.push(`/gallery/${v.id}`);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {t('refine.version', { version: v.version ?? 1 })}
                    </Badge>
                    {v.validationScore !== null && v.validationScore >= 70 && (
                      <BadgeCheck className="h-3.5 w-3.5 text-emerald-600" />
                    )}
                    {v.id === id && (
                      <Badge variant="secondary" className="text-[10px]">
                        {t('refine.current')}
                      </Badge>
                    )}
                    <span className="text-muted-foreground ml-auto text-xs">
                      {new Date(v.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {v.refinementPrompt && (
                    <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
                      {v.refinementPrompt}
                    </p>
                  )}
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Embed dialog */}
      <Dialog open={embedOpen} onOpenChange={setEmbedOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('embed.title')}</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground mb-3 text-sm">
            {t('embed.description')}
          </p>
          <pre className="bg-muted overflow-x-auto rounded-lg p-3 text-xs">
            {embedCode}
          </pre>
          <Button
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(embedCode);
              toast.success(t('actions.copied'));
            }}
          >
            {t('actions.copy_embed')}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
