'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Eye, GitFork, Heart, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/core/i18n/navigation';
import { toast } from 'sonner';

import { BadgeCheck } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useAppContext } from '@/shared/contexts/app';
import { cn } from '@/shared/lib/utils';

import { GalleryCard } from './gallery-card';

type SortOption = 'latest' | 'popular' | 'most_liked';

interface GalleryItem {
  id: string;
  prompt: string;
  language: string;
  userId: string | null;
  userName?: string | null;
  userAvatar?: string | null;
  viewCount: number;
  likeCount: number;
  forkCount: number;
  tags: string[] | null;
  validationScore: number | null;
  createdAt: string;
  isLiked?: boolean;
}

interface GalleryListProps {
  initialTag?: string;
}

export function GalleryList({ initialTag }: GalleryListProps) {
  const t = useTranslations('gallery');
  const { user } = useAppContext();

  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sort, setSort] = useState<SortOption>('latest');
  const [search, setSearch] = useState('');
  const [tag, setTag] = useState(initialTag || '');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  const fetchGallery = useCallback(
    async (cursor?: string, reset = false) => {
      try {
        if (reset) setLoading(true);
        else setLoadingMore(true);

        const params = new URLSearchParams();
        if (cursor) params.set('cursor', cursor);
        params.set('limit', '20');
        params.set('sort', sort);
        if (search) params.set('q', search);
        if (tag) params.set('tag', tag);
        if (verifiedOnly) params.set('verified', 'true');

        const res = await fetch(`/api/gallery?${params}`);
        const json = await res.json();

        if (json.code !== 0) {
          toast.error(json.message || t('errors.load_failed'));
          return;
        }

        const data = json.data;
        setItems((prev) => (reset ? data.list : [...prev, ...data.list]));
        setNextCursor(data.nextCursor);
        setHasMore(data.hasMore);
      } catch {
        toast.error(t('errors.load_failed'));
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [sort, search, tag, verifiedOnly, t]
  );

  // Initial load + reload on filter change
  useEffect(() => {
    fetchGallery(undefined, true);
  }, [fetchGallery]);

  // Infinite scroll
  useEffect(() => {
    if (!observerRef.current || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && hasMore && nextCursor) {
          fetchGallery(nextCursor);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, nextCursor, fetchGallery]);

  const handleLike = async (id: string) => {
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
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                isLiked: json.data.liked,
                likeCount: item.likeCount + (json.data.liked ? 1 : -1),
              }
            : item
        )
      );
    } catch {
      toast.error(t('errors.like_failed'));
    }
  };

  const sortOptions: { key: SortOption; label: string }[] = [
    { key: 'latest', label: t('filter.latest') },
    { key: 'popular', label: t('filter.popular') },
    { key: 'most_liked', label: t('filter.most_liked') },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      {/* Search + Sort bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('search.placeholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1">
          <Button
            variant={verifiedOnly ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setVerifiedOnly(!verifiedOnly)}
            className={cn(
              verifiedOnly && 'bg-emerald-600 hover:bg-emerald-700 text-white'
            )}
          >
            <BadgeCheck className="h-4 w-4 mr-1" />
            {t('filter.verified')}
          </Button>
          <span className="w-px bg-border mx-1" />
          {sortOptions.map((opt) => (
            <Button
              key={opt.key}
              variant={sort === opt.key ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setSort(opt.key)}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Tag indicator */}
      {tag && (
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-muted-foreground">
            {t('tag.title', { tag })}
          </span>
          <Button variant="ghost" size="sm" onClick={() => setTag('')}>
            &times;
          </Button>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="mx-auto max-w-2xl py-16 text-center">
          <h2 className="mb-3 font-serif text-3xl font-semibold italic text-foreground">
            Be the first.
          </h2>
          <p className="mb-6 text-muted-foreground">
            The gallery is still warming up. Try UPG &mdash; your creation shows up
            here for other students to fork.
          </p>
          <Link
            href="/upg"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_8px_24px_-8px_oklch(0.45_0.12_192/0.6)] transition-colors hover:bg-primary/92"
          >
            Try UPG <span aria-hidden>→</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <GalleryCard
              key={item.id}
              item={item}
              onLike={handleLike}
              onTagClick={setTag}
            />
          ))}
        </div>
      )}

      {/* Infinite scroll sentinel */}
      <div ref={observerRef} className="h-10" />
      {loadingMore && (
        <div className="flex justify-center py-4">
          <Skeleton className="h-8 w-32 rounded-lg" />
        </div>
      )}
    </div>
  );
}
