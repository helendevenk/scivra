import 'dotenv/config';
import { findUpgGenerationById } from '../src/shared/models/upg_generation';

async function main() {
  // Try the other completed records
  const ids = [
    'e1441532-ad72-409e-96fa-da853803043a',
    '3de60a73-83c3-4ea2-a825-506e14bacac5',
    '01d9f02a-bc68-4162-aadc-82797ebf4873',
    '0472b24a-768e-4930-87a4-5316b504d06d',
  ];
  
  for (const id of ids) {
    const record = await findUpgGenerationById(id);
    if (record) {
      console.log({ id: record.id, status: record.status, isPublic: record.isPublic, userId: record.userId });
    } else {
      console.log(`${id}: deleted or not found`);
    }
  }
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
