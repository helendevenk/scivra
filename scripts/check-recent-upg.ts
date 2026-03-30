import 'dotenv/config';
import { db } from '../src/core/db/index';
import { upgGeneration } from '../src/config/db/schema';
import { desc } from 'drizzle-orm';

async function main() {
  const rows = await db().select({
    id: upgGeneration.id,
    status: upgGeneration.status,
    prompt: upgGeneration.prompt,
    errorMessage: upgGeneration.errorMessage,
    createdAt: upgGeneration.createdAt,
  }).from(upgGeneration)
    .orderBy(desc(upgGeneration.createdAt))
    .limit(10);
  
  console.log(JSON.stringify(rows, null, 2));
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
