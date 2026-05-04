import { getTranslations } from 'next-intl/server';

import { Empty } from '@/shared/blocks/common';
import { NotebookList } from '@/shared/blocks/notebook/NotebookList';
import { LandingAppShell } from '@/shared/components/layout/landing-app-shell';
import { getMetadata } from '@/shared/lib/seo';
import {
  getNotebooksByUser,
  getNotebooksByUserCount,
} from '@/shared/models/lab_notebook';
import { getUserInfo } from '@/shared/models/user';

export const generateMetadata = getMetadata({
  noIndex: true,
});

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
    return (
      <LandingAppShell>
        <Empty message="Please sign in to view your lab notebooks" />
      </LandingAppShell>
    );
  }

  const t = await getTranslations('notebook');

  const filterStatus = status && status !== 'all' ? status : undefined;

  const [notebooks, total] = await Promise.all([
    getNotebooksByUser(user.id, { status: filterStatus, page, pageSize }),
    getNotebooksByUserCount(user.id, { status: filterStatus }),
  ]);

  return (
    <LandingAppShell>
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
    </LandingAppShell>
  );
}
