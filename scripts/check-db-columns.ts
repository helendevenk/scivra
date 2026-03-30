import { db } from '@/core/db';
import { sql } from 'drizzle-orm';

async function main() {
  const result = await db().execute(sql`
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'upg_generation' 
    ORDER BY ordinal_position
  `) as any;
  
  const dbCols = Object.values(result).map((r: any) => r.column_name);
  console.log('DB columns (' + dbCols.length + '):', dbCols.join(', '));
  
  const schemaExpected = ['id','user_id','prompt','prompt_hash','language','category','html_content','html_url','html_size','model','provider','input_tokens','output_tokens','cost_usd','cost_credits','credit_id','status','error_message','is_public','view_count','share_count','download_count','like_count','fork_count','featured','tags','forked_from','validation_score','validation_details','validated_at','review_status','review_result','reviewed_at','version','parent_id','refinement_prompt','created_at','updated_at','deleted_at'];
  const missing = schemaExpected.filter(c => !dbCols.includes(c));
  if (missing.length) console.log('❌ MISSING in DB:', missing);
  else console.log('✅ All expected columns present in DB');
}
main().catch(console.error).finally(() => process.exit(0));
