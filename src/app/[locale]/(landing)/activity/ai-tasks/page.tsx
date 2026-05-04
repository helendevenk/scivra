import { getTranslations } from 'next-intl/server';

import { Empty } from '@/shared/blocks/common';
import { Link } from '@/core/i18n/navigation';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  UPG_CREDITS_PER_GENERATION,
  UPG_CREDITS_PER_REFINEMENT,
  UPG_CREDITS_PER_REGENERATION,
} from '@/shared/lib/upg/constants';
import {
  getUpgGenerationsByUserId,
  getUpgGenerationsCount,
  type UpgGeneration,
} from '@/shared/models/upg_generation';
import { getUserInfo } from '@/shared/models/user';

export default async function AiTasksPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; pageSize?: string; type?: string }>;
}) {
  const { page: pageNum, pageSize } = await searchParams;
  const page = Math.max(1, parseInt(pageNum || '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(pageSize || '20', 10)));

  const user = await getUserInfo();
  if (!user) {
    return <Empty message="Please sign in to view your AI Lab activity" />;
  }

  const t = await getTranslations('activity.ai-tasks');

  const [generations, total] = await Promise.all([
    getUpgGenerationsByUserId(user.id, Number(page), Number(limit)),
    getUpgGenerationsCount(user.id),
  ]);

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4">
      <div>
        <h1 className="font-serif text-3xl font-bold">{t('list.title')}</h1>
        <p className="text-muted-foreground mt-2">{t('list.description')}</p>
      </div>

      {generations.length === 0 ? (
        <div className="rounded-lg border bg-card p-8 text-center">
          <p className="text-muted-foreground mb-4">{t('list.empty_message')}</p>
          <Button asChild>
            <Link href="/upg">{t('list.buttons.create')}</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {generations.map((item) => (
            <ActivityRow key={item.id} item={item} />
          ))}
        </div>
      )}

      {total > limit && (
        <div className="flex justify-center gap-2">
          <Button asChild variant="outline" size="sm" disabled={page <= 1}>
            <Link href={`/activity/ai-tasks?page=${Number(page) - 1}`}>
              Previous
            </Link>
          </Button>
          <span className="text-muted-foreground flex items-center text-sm">
            {page} / {Math.ceil(total / Number(limit))}
          </span>
          <Button
            asChild
            variant="outline"
            size="sm"
            disabled={Number(page) >= Math.ceil(total / Number(limit))}
          >
            <Link href={`/activity/ai-tasks?page=${Number(page) + 1}`}>
              Next
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}

function getActivityMeta(item: UpgGeneration) {
  if (item.refinementPrompt) {
    return {
      label: 'Refined AI Lab',
      credits: item.status === 'completed' ? UPG_CREDITS_PER_REFINEMENT : 0,
    };
  }
  if (item.forkedFrom) {
    return {
      label: 'Forked AI Lab',
      credits: item.status === 'completed' ? UPG_CREDITS_PER_REGENERATION : 0,
    };
  }
  return {
    label: 'Generated AI Lab',
    credits: item.status === 'completed' ? UPG_CREDITS_PER_GENERATION : 0,
  };
}

function ActivityRow({ item }: { item: UpgGeneration }) {
  const meta = getActivityMeta(item);
  const href =
    item.status === 'completed' ? `/upg/view/${item.id}` : `/upg/my`;

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{meta.label}</Badge>
            <Badge variant={item.status === 'completed' ? 'default' : 'outline'}>
              {item.status}
            </Badge>
            {item.isPublic && <Badge variant="outline">Published</Badge>}
          </div>
          <p className="line-clamp-2 font-medium">{item.prompt}</p>
          <p className="text-muted-foreground text-sm">
            {new Date(item.createdAt).toLocaleString()} · {item.model} ·{' '}
            {meta.credits} AI credits
          </p>
          {item.errorMessage && (
            <p className="text-destructive text-sm">{item.errorMessage}</p>
          )}
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href={href}>
            {item.status === 'completed' ? 'Open lab' : 'View history'}
          </Link>
        </Button>
      </div>
    </div>
  );
}
