import type { NextRequest } from 'next/server';
import { handle, ok, requireSession } from '@/server/dashboard/http';
import { listRevisions } from '@/server/dashboard/service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  requireSession();
  const docId = req.nextUrl.searchParams.get('docId') ?? undefined;
  return handle(() => ok(listRevisions(docId)));
}
