'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  ArrowLeft,
  Code,
  Download,
  Eye,
  Expand,
  GitFork,
  Heart,
  Loader2,
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
import { useAppContext } from '@/shared/contexts/app';
import { useRouter } from '@/core/i18n/navigation';
import { cn } from '@/shared/lib/utils';
import { UPG_CREDITS_PER_REGENERATION } from '@/shared/lib/upg/constants';

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
  forkedFrom: string | null;
  createdAt: string;
  isLiked: boolean;
}

export function GalleryDetailClient({ id }: { id: string }) {
  const t = useTranslations('gallery');
  const { user } = useAppContext();
  const router = useRouter();

  const [detail, setDetail] = useState<GalleryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [forking, setForking] = useState(false);
  const [embedOpen, setEmbedOpen] = useState(false);

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
          onClick={() => setEmbedOpen(true)}
        >
          <Code className="h-4 w-4 mr-1" />
          {t('actions.embed')}
        </Button>

        <span className="flex items-center gap-1 text-sm text-muted-foreground ml-auto">
          <Eye className="h-4 w-4" />
          {detail.viewCount}
        </span>
      </div>

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
