import 'dotenv/config';
import { db } from '../src/core/db/index';
import { upgGeneration } from '../src/config/db/schema';
import { desc, eq } from 'drizzle-orm';

async function main() {
  const rows = await db().select({
    id: upgGeneration.id,
    status: upgGeneration.status,
    htmlContent: upgGeneration.htmlContent,
    errorMessage: upgGeneration.errorMessage,
  }).from(upgGeneration)
    .where(eq(upgGeneration.status, 'failed'))
    .orderBy(desc(upgGeneration.createdAt))
    .limit(1);
  
  if (rows[0]?.htmlContent) {
    console.log('HTML snippet (first 2000 chars):');
    console.log(rows[0].htmlContent.slice(0, 2000));
  } else {
    console.log('No HTML content in failed record:', rows[0]);
  }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
