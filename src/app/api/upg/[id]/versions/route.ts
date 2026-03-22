import { respData, respErr } from '@/shared/lib/resp';
import { getVersionChain } from '@/shared/models/upg_generation';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const versions = await getVersionChain(id);
    return respData(versions);
  } catch (e: unknown) {
    const errMsg = e instanceof Error ? e.message : 'Failed to get versions';
    console.error('Version chain failed:', e);
    return respErr(errMsg);
  }
}
