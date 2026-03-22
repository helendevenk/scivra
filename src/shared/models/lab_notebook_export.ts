import { desc, eq } from 'drizzle-orm';

import { db } from '@/core/db';
import { labNotebookExport } from '@/config/db/schema';
import { getUuid } from '@/shared/lib/hash';

export type LabNotebookExportRow = typeof labNotebookExport.$inferSelect;
export type NewLabNotebookExport = typeof labNotebookExport.$inferInsert;

export async function createExport(data: NewLabNotebookExport) {
  const [result] = await db()
    .insert(labNotebookExport)
    .values({
      ...data,
      id: data.id || getUuid(),
    })
    .returning();
  return result;
}

export async function getExportsByNotebook(notebookId: string) {
  const results = await db()
    .select()
    .from(labNotebookExport)
    .where(eq(labNotebookExport.notebookId, notebookId))
    .orderBy(desc(labNotebookExport.createdAt));
  return results;
}
