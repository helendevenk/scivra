'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';

interface WeeklyQuest {
  id: string;
  slug: string;
  titleEn: string;
  titleZh: string;
  descriptionEn: string;
  descriptionZh: string;
  category: string;
  difficulty: string;
  weeklyEndDate: string | null;
  stepCount: number;
}

interface LeaderboardEntry {
  rank: number;
  userName: string;
  userImage: string | null;
  totalScore: number | null;
  totalTimeSeconds: number | null;
}

export function WeeklyChallenge() {
  const t = useTranslations('quest');
  const router = useRouter();
  const [quest, setQuest] = useState<WeeklyQuest | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/quest/weekly');
        const json = await res.json();
        if (json.data) {
          setQuest(json.data.quest);
          setLeaderboard(json.data.leaderboard || []);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function getTitle(q: WeeklyQuest) {
    return q.titleEn;
  }
  function getDesc(q: WeeklyQuest) {
    return q.descriptionEn;
  }

  function formatTime(seconds: number | null) {
    if (!seconds) return '--';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-32 animate-pulse rounded bg-muted" />
        <div className="h-48 animate-pulse rounded bg-muted" />
      </div>
    );
  }

  if (!quest) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg">{t('weekly.no_challenge')}</p>
      </div>
    );
  }

  // Calculate countdown
  let countdown = '';
  if (quest.weeklyEndDate) {
    const endDate = new Date(quest.weeklyEndDate + 'T23:59:59Z');
    const now = new Date();
    const diffMs = endDate.getTime() - now.getTime();
    if (diffMs > 0) {
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      countdown = `${days} ${t('weekly.days')} ${hours} ${t('weekly.hours')}`;
    }
  }

  return (
    <div className="space-y-6">
      {/* Quest card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{getTitle(quest)}</CardTitle>
            {countdown && (
              <Badge variant="outline">
                {t('weekly.ends_in')}: {countdown}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">{getDesc(quest)}</p>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Badge variant="secondary">
              {t(`page.filter_${quest.category}`)}
            </Badge>
            <Badge variant="secondary">
              {t(`page.difficulty_${quest.difficulty}`)}
            </Badge>
            <Badge variant="outline">
              {t('card.steps', { count: quest.stepCount })}
            </Badge>
          </div>
          <Button
            className="mt-4"
            onClick={() => router.push(`/quest/${quest.slug}`)}
          >
            {t('weekly.start_challenge')}
          </Button>
        </CardContent>
      </Card>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>{t('weekly.leaderboard')}</CardTitle>
        </CardHeader>
        <CardContent>
          {leaderboard.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">
              {t('weekly.not_attempted')}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="px-3 py-2">{t('weekly.rank')}</th>
                    <th className="px-3 py-2">{t('weekly.player')}</th>
                    <th className="px-3 py-2">{t('weekly.score')}</th>
                    <th className="px-3 py-2">{t('weekly.time')}</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry) => (
                    <tr key={entry.rank} className="border-b">
                      <td className="px-3 py-2 font-medium">
                        #{entry.rank}
                      </td>
                      <td className="px-3 py-2">{entry.userName}</td>
                      <td className="px-3 py-2">
                        {entry.totalScore ?? 0}
                      </td>
                      <td className="px-3 py-2">
                        {formatTime(entry.totalTimeSeconds)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
