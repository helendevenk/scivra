import { notFound } from 'next/navigation';

import { Empty } from '@/shared/blocks/common';
import { getUserInfo } from '@/shared/models/user';
import { findLabNotebookById } from '@/shared/models/lab_notebook';
import { NotebookEditor } from '@/shared/blocks/notebook/NotebookEditor';
import { getMetadata } from '@/shared/lib/seo';

export const generateMetadata = getMetadata({
  noIndex: true,
});

export default async function NotebookEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await getUserInfo();
  if (!user) {
    return <Empty message="Please sign in to view your lab notebook" />;
  }

  const notebook = await findLabNotebookById(id);
  if (!notebook) {
    notFound();
  }
  if (notebook.userId !== user.id) {
    return <Empty message="No permission to view this notebook" />;
  }

  return <NotebookEditor notebook={notebook} />;
}
