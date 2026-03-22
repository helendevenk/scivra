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
import { useRouter } from '@/core/i18n/navigation';
import { cn } from '@/shared/lib/utils';
import {
  UPG_CREDITS_PER_REGENERATION,
  UPG_CREDITS_PER_REFINEMENT,
} from '@/shared/lib/upg/constants';

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

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-[500px] rounded-xl" />
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="text-center py-20">
        <p className="text-lg">{t('errors.load_failed')}</p>
        <Button variant="ghost" className="mt-4" onClick={() => router.push('/gallery')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('page.title')}
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="mb-2"
            onClick={() => router.push('/gallery')}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t('page.title')}
          </Button>
          <h1 className="text-2xl font-bold">{detail.prompt}</h1>
          <div className="flex items-center gap-2 mt-1">
            {detail.validationScore !== null && detail.validationScore >= 70 && (
              <Badge
                variant="default"
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-0.5"
              >
                <BadgeCheck className="h-3.5 w-3.5" />
                {t('badge.verified')}
                <span className="text-emerald-200 ml-1 text-[10px]">
                  {detail.validationScore}%
                </span>
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {detail.userName
              ? t('card.by', { author: detail.userName })
              : t('card.anonymous')}
            {' · '}
            {t('detail.created', {
              date: new Date(detail.createdAt).toLocaleDateString(),
            })}
          </p>
          {detail.forkedFrom && (
            <p className="text-xs text-muted-foreground mt-1">
              {t('detail.forked_from')}{' '}
              <a
                href={`/gallery/${detail.forkedFrom}`}
                className="underline hover:text-foreground"
              >
                {detail.forkedFrom.slice(0, 8)}...
              </a>
            </p>
          )}
        </div>
      </div>

      {/* Tags */}
      {detail.tags && detail.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
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
          <iframe
            srcDoc={detail.htmlContent}
            className="w-full h-[500px] rounded-xl border-0"
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
            className={cn('h-4 w-4 mr-1', detail.isLiked && 'fill-current')}
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
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <GitFork className="h-4 w-4 mr-1" />
          )}
          {forking
            ? t('actions.forking')
            : t('actions.fork', { credits: UPG_CREDITS_PER_REGENERATION })}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setRefineOpen(true)}
        >
          <Wand2 className="h-4 w-4 mr-1" />
          {t('refine.button', { credits: UPG_CREDITS_PER_REFINEMENT })}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setEmbedOpen(true)}
        >
          <Code className="h-4 w-4 mr-1" />
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
          <History className="h-4 w-4 mr-1" />
          {detail.version && detail.version > 1
            ? t('refine.version', { version: detail.version })
            : null}
        </Button>

        <span className="flex items-center gap-1 text-sm text-muted-foreground ml-auto">
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
          <p className="text-sm text-muted-foreground mb-3">
            {t('refine.description')}
          </p>
          <Textarea
            placeholder={t('refine.placeholder')}
            value={refinePrompt}
            onChange={(e) => setRefinePrompt(e.target.value)}
            rows={4}
            maxLength={1000}
          />
          <div className="flex justify-end gap-2 mt-2">
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
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Wand2 className="h-4 w-4 mr-1" />
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
            <p className="text-sm text-muted-foreground py-4 text-center">
              {t('refine.original')}
            </p>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {versions.map((v) => (
                <button
                  key={v.id}
                  className={cn(
                    'w-full text-left p-3 rounded-lg border transition-colors',
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
                    <span className="text-xs text-muted-foreground ml-auto">
                      {new Date(v.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {v.refinementPrompt && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
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
          <p className="text-sm text-muted-foreground mb-3">
            {t('embed.description')}
          </p>
          <pre className="bg-muted p-3 rounded-lg text-xs overflow-x-auto">
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
