import { getTranslations } from 'next-intl/server';

import { Empty } from '@/shared/blocks/common';
import { getUserInfo } from '@/shared/models/user';
import {
  getNotebooksByUser,
  getNotebooksByUserCount,
} from '@/shared/models/lab_notebook';
import { NotebookList } from '@/shared/blocks/notebook/NotebookList';

export default async function NotebooksPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const { status, page: pageStr } = await searchParams;
  const page = parseInt(pageStr || '1', 10);
  const pageSize = 20;

  const user = await getUserInfo();
  if (!user) {
    return <Empty message="Please sign in to view your lab notebooks" />;
  }

  const t = await getTranslations('notebook');

  const filterStatus = status && status !== 'all' ? status : undefined;

  const [notebooks, total] = await Promise.all([
    getNotebooksByUser(user.id, { status: filterStatus, page, pageSize }),
    getNotebooksByUserCount(user.id, { status: filterStatus }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold">{t('list.title')}</h1>
        <p className="text-muted-foreground mt-2">{t('list.description')}</p>
      </div>

      <NotebookList
        notebooks={notebooks}
        total={total}
        page={page}
        pageSize={pageSize}
        currentStatus={status || 'all'}
      />
    </div>
  );
}
