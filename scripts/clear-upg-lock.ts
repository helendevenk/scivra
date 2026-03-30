import 'dotenv/config';
import { releaseLock } from '../src/shared/lib/redis';

const userId = process.argv[2];
if (!userId) {
  console.error('Usage: npx tsx scripts/clear-upg-lock.ts <userId>');
  process.exit(1);
}

async function main() {
  const lockKey = `upg:lock:${userId}`;
  await releaseLock(lockKey);
  console.log(`Released lock: ${lockKey}`);
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
