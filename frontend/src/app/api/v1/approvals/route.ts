import type { NextRequest } from 'next/server';
import { created, handle, ok, parseBody, requireSession } from '@/server/dashboard/http';
import { createApprovalSchema } from '@/server/dashboard/schemas';
import { createApproval, listApprovals, type ApprovalFilters } from '@/server/dashboard/service';
import type { ApprovalStatus, ApprovalType } from '@/dashboard/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  requireSession();
  const q = req.nextUrl.searchParams;
  const filters: ApprovalFilters = {
    type: (q.get('type') ?? undefined) as ApprovalType | 'all' | undefined,
    status: (q.get('status') ?? undefined) as ApprovalStatus | undefined,
    search: q.get('search') ?? undefined,
    sort: (q.get('sort') ?? undefined) as 'newest' | 'oldest' | undefined,
  };
  return handle(() => ok(listApprovals(filters)));
}

export async function POST(req: NextRequest) {
  requireSession();
  const parsed = await parseBody(req, createApprovalSchema);
  if ('error' in parsed) return parsed.error;
  return handle(() => created(createApproval(parsed.data)));
}
