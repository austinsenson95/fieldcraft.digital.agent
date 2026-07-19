import type { NextRequest } from 'next/server';
import { handle, ok, parseBody, requireSession } from '@/server/dashboard/http';
import { restoreRevisionSchema } from '@/server/dashboard/schemas';
import { restoreRevision } from '@/server/dashboard/service';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  requireSession();
  const parsed = await parseBody(req, restoreRevisionSchema);
  if ('error' in parsed) return parsed.error;
  return handle(() => ok(restoreRevision(parsed.data.revisionId)));
}
