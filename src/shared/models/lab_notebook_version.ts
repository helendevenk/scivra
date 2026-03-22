import { desc, eq } from 'drizzle-orm';

import { db } from '@/core/db';
import { labNotebookVersion } from '@/config/db/schema';
import { getUuid } from '@/shared/lib/hash';

export type LabNotebookVersionRow = typeof labNotebookVersion.$inferSelect;
export type NewLabNotebookVersion = typeof labNotebookVersion.$inferInsert;

export async function createVersion(
  notebookId: string,
  version: number,
  snapshot: {
    hypothesis?: string | null;
    method?: string | null;
    data?: string | null;
    analysis?: string | null;
    conclusion?: string | null;
  },
  changeDescription?: string
) {
  const [result] = await db()
    .insert(labNotebookVersion)
    .values({
      id: getUuid(),
      notebookId,
      version,
      hypothesis: snapshot.hypothesis ?? null,
      method: snapshot.method ?? null,
      data: snapshot.data ?? null,
      analysis: snapshot.analysis ?? null,
      conclusion: snapshot.conclusion ?? null,
      changeDescription: changeDescription ?? null,
    })
    .returning();
  return result;
}

export async function getVersionsByNotebook(notebookId: string) {
  const results = await db()
    .select()
    .from(labNotebookVersion)
    .where(eq(labNotebookVersion.notebookId, notebookId))
    .orderBy(desc(labNotebookVersion.version));
  return results;
}

export async function findVersionById(id: string) {
  const [result] = await db()
    .select()
    .from(labNotebookVersion)
    .where(eq(labNotebookVersion.id, id));
  return result;
}
