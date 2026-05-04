'use client';

import { BadgeCheck, Eye, GitFork, Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useRouter } from '@/core/i18n/navigation';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';

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
  validationScore: number | null;
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
  const validationBadge =
    item.validationScore === null
      ? {
          label: t('badge.not_checked'),
          className: 'bg-muted text-muted-foreground hover:bg-muted',
        }
      : item.validationScore >= 70
        ? {
            label: t('badge.verified'),
            className: 'bg-emerald-600 text-white hover:bg-emerald-700',
          }
        : {
            label: t('badge.needs_review'),
            className:
              'border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-300',
          };

  return (
    <Card
      className="group cursor-pointer transition-shadow hover:shadow-lg"
      onClick={() => router.push(`/gallery/${item.id}`)}
    >
      <CardContent className="p-5">
        {/* Prompt as title */}
        <h3 className="mb-3 line-clamp-2 text-base font-medium">
          {item.prompt}
        </h3>

        {/* Tags + quality labels */}
        <div className="mb-3 flex flex-wrap gap-1.5">
          <Badge variant="outline" className="text-xs uppercase">
            {t('badge.language', { language: item.language || 'en' })}
          </Badge>
          <Badge
            variant={
              item.validationScore !== null && item.validationScore < 70
                ? 'outline'
                : 'default'
            }
            className={cn('gap-0.5 text-xs', validationBadge.className)}
          >
            {item.validationScore !== null && item.validationScore >= 70 && (
              <BadgeCheck className="h-3 w-3" />
            )}
            {validationBadge.label}
          </Badge>
          {item.tags?.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="cursor-pointer text-xs"
              onClick={(e) => {
                e.stopPropagation();
                onTagClick(tag);
              }}
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Author */}
        <p className="text-muted-foreground mb-3 text-sm">
          {item.userName
            ? t('card.by', { author: item.userName })
            : t('card.anonymous')}
        </p>

        {/* Stats row */}
        <div className="text-muted-foreground flex items-center gap-4 text-sm">
          <button
            className={cn(
              'flex items-center gap-1 transition-colors hover:text-red-500',
              item.isLiked && 'text-red-500'
            )}
            onClick={(e) => {
              e.stopPropagation();
              onLike(item.id);
            }}
          >
            <Heart className={cn('h-4 w-4', item.isLiked && 'fill-current')} />
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
