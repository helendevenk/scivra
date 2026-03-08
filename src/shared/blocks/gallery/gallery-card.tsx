'use client';

import { Eye, GitFork, Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';
import { useRouter } from '@/core/i18n/navigation';

interface GalleryItem {
  id: string;
  prompt: string;
  language: string;
  userId: string | null;
  userName?: string | null;
  viewCount: number;
  likeCount: number;
  forkCount: number;
  tags: string[] | null;
  createdAt: string;
  isLiked?: boolean;
}

interface GalleryCardProps {
  item: GalleryItem;
  onLike: (id: string) => void;
  onTagClick: (tag: string) => void;
}

export function GalleryCard({ item, onLike, onTagClick }: GalleryCardProps) {
  const t = useTranslations('gallery');
  const router = useRouter();

  return (
    <Card
      className="group cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => router.push(`/gallery/${item.id}`)}
    >
      <CardContent className="p-5">
        {/* Prompt as title */}
        <h3 className="font-medium text-base line-clamp-2 mb-3">
          {item.prompt}
        </h3>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {item.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onTagClick(tag);
                }}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Author */}
        <p className="text-sm text-muted-foreground mb-3">
          {item.userName
            ? t('card.by', { author: item.userName })
            : t('card.anonymous')}
        </p>

        {/* Stats row */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <button
            className={cn(
              'flex items-center gap-1 hover:text-red-500 transition-colors',
              item.isLiked && 'text-red-500'
            )}
            onClick={(e) => {
              e.stopPropagation();
              onLike(item.id);
            }}
          >
            <Heart
              className={cn('h-4 w-4', item.isLiked && 'fill-current')}
            />
            <span>{item.likeCount}</span>
          </button>

          <span className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{item.viewCount}</span>
          </span>

          <span className="flex items-center gap-1">
            <GitFork className="h-4 w-4" />
            <span>{item.forkCount}</span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
