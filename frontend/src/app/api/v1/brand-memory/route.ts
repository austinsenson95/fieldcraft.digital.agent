import type { NextRequest } from 'next/server';
import { handle, ok, parseBody, requireSession } from '@/server/dashboard/http';
import { brandMemoryPutSchema } from '@/server/dashboard/schemas';
import { getBrandMemory, listBrandDocs, saveBrandDoc, saveBrandMemory } from '@/server/dashboard/service';

export const dynamic = 'force-dynamic';

/** Returns both brand docs and brand memory entries in one payload. */
export async function GET() {
  requireSession();
  return handle(() => ok({ docs: listBrandDocs(), entries: getBrandMemory() }));
}

export async function PUT(req: NextRequest) {
  requireSession();
  const parsed = await parseBody(req, brandMemoryPutSchema);
  if ('error' in parsed) return parsed.error;
  const body = parsed.data;
  return handle(() => {
    if ('docId' in body) return ok(saveBrandDoc(body.docId, body.content));
    return ok(saveBrandMemory(body.entries));
  });
}
