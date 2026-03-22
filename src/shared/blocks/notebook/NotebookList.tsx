'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Card } from '@/shared/components/ui/card';
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from '@/shared/components/ui/tabs';
import type { LabNotebook } from '@/config/db/schema';

interface NotebookListProps {
  notebooks: LabNotebook[];
  total: number;
  page: number;
  pageSize: number;
  currentStatus: string;
}

const STATUS_VARIANTS: Record<string, 'default' | 'secondary' | 'outline'> = {
  draft: 'outline',
  completed: 'default',
  archived: 'secondary',
};

export function NotebookList({
  notebooks,
  total,
  page,
  pageSize,
  currentStatus,
}: NotebookListProps) {
  const router = useRouter();
  const t = useTranslations('notebook');
  const [creating, setCreating] = useState(false);

  async function handleCreate() {
    setCreating(true);
    try {
      const res = await fetch('/api/notebooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Untitled Notebook' }),
      });
      const json = await res.json();
      if (json.code === 0 && json.data?.id) {
        router.push(`/notebooks/${json.data.id}`);
      } else {
        alert(json.message || t('errors.create_failed'));
        setCreating(false);
      }
    } catch {
      alert(t('errors.create_failed'));
      setCreating(false);
    }
  }

  function handleTabChange(value: string) {
    const params = new URLSearchParams();
    if (value !== 'all') params.set('status', value);
    const qs = params.toString();
    router.push(`/notebooks${qs ? `?${qs}` : ''}`);
  }

  function formatTime(date: Date | string) {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Tabs value={currentStatus} onValueChange={handleTabChange}>
          <TabsList>
            <TabsTrigger value="all">{t('list.tabs.all')}</TabsTrigger>
            <TabsTrigger value="draft">{t('list.tabs.draft')}</TabsTrigger>
            <TabsTrigger value="completed">
              {t('list.tabs.completed')}
            </TabsTrigger>
            <TabsTrigger value="archived">
              {t('list.tabs.archived')}
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Button onClick={handleCreate} disabled={creating}>
          {creating ? '...' : t('list.create')}
        </Button>
      </div>

      {notebooks.length === 0 ? (
        <div className="text-muted-foreground flex h-40 items-center justify-center text-center">
          {t('list.empty')}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notebooks.map((nb) => (
            <Card
              key={nb.id}
              className="cursor-pointer p-4 transition-shadow hover:shadow-md"
              onClick={() => router.push(`/notebooks/${nb.id}`)}
            >
              <div className="mb-2 flex items-start justify-between">
                <h3 className="line-clamp-1 font-medium">{nb.title}</h3>
                <Badge variant={STATUS_VARIANTS[nb.status] || 'outline'}>
                  {t(`card.${nb.status}` as 'card.draft')}
                </Badge>
              </div>
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <span>{formatTime(nb.updatedAt)}</span>
                <span className="text-muted-foreground/50">
                  {t('card.version', { version: nb.version ?? 1 })}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {total > pageSize && (
        <div className="mt-6 flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => {
              const params = new URLSearchParams();
              if (currentStatus !== 'all')
                params.set('status', currentStatus);
              params.set('page', String(page - 1));
              router.push(`/notebooks?${params.toString()}`);
            }}
          >
            Previous
          </Button>
          <span className="text-muted-foreground flex items-center text-sm">
            {page} / {Math.ceil(total / pageSize)}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= Math.ceil(total / pageSize)}
            onClick={() => {
              const params = new URLSearchParams();
              if (currentStatus !== 'all')
                params.set('status', currentStatus);
              params.set('page', String(page + 1));
              router.push(`/notebooks?${params.toString()}`);
            }}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
