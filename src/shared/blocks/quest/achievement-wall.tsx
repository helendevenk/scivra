'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/shared/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';

interface AchievementItem {
  id: string;
  slug: string;
  titleEn: string;
  titleZh: string;
  descriptionEn: string;
  descriptionZh: string;
  icon: string;
  category: string;
  rarity: string;
}

const RARITY_COLORS: Record<string, string> = {
  common: 'border-gray-300 dark:border-gray-600',
  rare: 'border-blue-400 dark:border-blue-500',
  epic: 'border-purple-500 dark:border-purple-400',
  legendary: 'border-amber-500 dark:border-amber-400',
};

const RARITY_BG: Record<string, string> = {
  common: '',
  rare: 'bg-blue-50/50 dark:bg-blue-950/20',
  epic: 'bg-purple-50/50 dark:bg-purple-950/20',
  legendary: 'bg-amber-50/50 dark:bg-amber-950/20',
};

export function AchievementWall() {
  const t = useTranslations('quest');
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [unlockedIds, setUnlockedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/quest/achievements');
        const json = await res.json();
        if (json.data) {
          setAchievements(json.data.achievements || []);
          setUnlockedIds(new Set(json.data.userUnlocked || []));
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function getTitle(a: AchievementItem) {
    return a.titleEn;
  }
  function getDesc(a: AchievementItem) {
    return a.descriptionEn;
  }

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-8 w-8 rounded bg-muted" />
              <div className="mt-2 h-4 w-1/2 rounded bg-muted" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  const unlockedCount = achievements.filter((a) =>
    unlockedIds.has(a.id)
  ).length;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-lg font-medium text-muted-foreground">
          {t('achievements.progress', {
            unlocked: unlockedCount,
            total: achievements.length,
          })}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {achievements.map((ach) => {
          const unlocked = unlockedIds.has(ach.id);
          return (
            <Card
              key={ach.id}
              className={`border-2 transition-all ${
                RARITY_COLORS[ach.rarity] ?? ''
              } ${RARITY_BG[ach.rarity] ?? ''} ${
                !unlocked ? 'opacity-50 grayscale' : ''
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{ach.icon}</span>
                  <Badge
                    variant={unlocked ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {unlocked
                      ? t('achievements.unlocked')
                      : t('achievements.locked')}
                  </Badge>
                </div>
                <CardTitle className="text-base">{getTitle(ach)}</CardTitle>
                <CardDescription className="text-sm">
                  {getDesc(ach)}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Badge variant="outline" className="text-xs">
                  {t(`achievements.rarity_${ach.rarity}`)}
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
