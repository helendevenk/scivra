import { notFound } from 'next/navigation';

import { Empty } from '@/shared/blocks/common';
import { NotebookEditor } from '@/shared/blocks/notebook/NotebookEditor';
import { LandingAppShell } from '@/shared/components/layout/landing-app-shell';
import { getMetadata } from '@/shared/lib/seo';
import { findLabNotebookById } from '@/shared/models/lab_notebook';
import { getUserInfo } from '@/shared/models/user';

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
    return (
      <LandingAppShell>
        <Empty message="Please sign in to view your lab notebook" />
      </LandingAppShell>
    );
  }

  const notebook = await findLabNotebookById(id);
  if (!notebook) {
    notFound();
  }
  if (notebook.userId !== user.id) {
    return (
      <LandingAppShell>
        <Empty message="No permission to view this notebook" />
      </LandingAppShell>
    );
  }

  return (
    <LandingAppShell>
      <NotebookEditor notebook={notebook} />
    </LandingAppShell>
  );
}
