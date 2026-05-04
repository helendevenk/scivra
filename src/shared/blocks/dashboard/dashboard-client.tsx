'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  CreditCard,
  Flame,
  Heart,
  Layers,
  Plus,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';
import { Card, CardContent } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useAppContext } from '@/shared/contexts/app';
import { useRouter } from '@/core/i18n/navigation';
import { DashboardLearnPanel } from '@/shared/blocks/learning-path';

interface DashboardStats {
  remainingCredits: number;
  totalGenerations: number;
  totalLikesReceived: number;
  monthlyGenerations: number;
}

interface RecentWork {
  id: string;
  prompt: string;
  status: string;
  isPublic: boolean;
  createdAt: string;
}

interface DashboardData {
  stats: DashboardStats;
  recentWorks: RecentWork[];
  recentActivity: any[];
  actionHints: string[];
}

export function DashboardClient() {
  const t = useTranslations('user-dashboard');
  const { user } = useAppContext();
  const router = useRouter();

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await fetch('/api/dashboard');
      const json = await res.json();
      if (json.code !== 0) {
        toast.error(json.message);
        return;
      }
      setData(json.data);
    } catch {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-8">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (!data) return null;

  const statCards = [
    {
      label: t('stats.credits'),
      value: data.stats.remainingCredits,
      icon: CreditCard,
    },
    {
      label: t('stats.total_generations'),
      value: data.stats.totalGenerations,
      icon: Layers,
    },
    {
      label: t('stats.total_likes'),
      value: data.stats.totalLikesReceived,
      icon: Heart,
    },
    {
      label: t('stats.monthly_generations'),
      value: data.stats.monthlyGenerations,
      icon: Flame,
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Welcome */}
      <h1 className="text-2xl font-bold mb-6">
        {user?.name
          ? t('page.welcome', { name: user.name })
          : t('page.title')}
      </h1>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <stat.icon className="h-8 w-8 text-muted-foreground shrink-0" />
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Learning progress */}
      <div className="mb-8">
        <DashboardLearnPanel />
      </div>

      {/* Action hints */}
      {data.actionHints.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {data.actionHints.map((hint) => (
            <div
              key={hint}
              className="text-sm bg-muted px-3 py-1.5 rounded-lg"
            >
              {t(`hints.${hint}` as any)}
            </div>
          ))}
        </div>
      )}

      {/* Recent works */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{t('recent_works.title')}</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/upg')}
          >
            <Plus className="h-4 w-4 mr-1" />
            {t('recent_works.create')}
          </Button>
        </div>

        {data.recentWorks.length === 0 ? (
          <div className="rounded-lg border bg-card p-6">
            <p className="text-muted-foreground mb-4 text-sm">
              {t('recent_works.empty')}
            </p>
            <Button onClick={() => router.push('/upg')}>
              <Plus className="h-4 w-4 mr-1" />
              {t('recent_works.create')}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.recentWorks.map((work) => (
              <Card
                key={work.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push(`/upg/view/${work.id}`)}
              >
                <CardContent className="p-4">
                  <p className="font-medium line-clamp-2 text-sm">
                    {work.prompt}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    <span>{new Date(work.createdAt).toLocaleDateString()}</span>
                    {work.isPublic && (
                      <span className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 px-1.5 py-0.5 rounded">
                        Public
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
