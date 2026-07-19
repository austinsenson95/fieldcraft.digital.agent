import type { NextRequest } from 'next/server';
import { created, handle, ok, parseBody, requireSession } from '@/server/dashboard/http';
import { createLeadSchema } from '@/server/dashboard/schemas';
import { createLead, listLeads, type LeadFilters } from '@/server/dashboard/service';
import type { LeadStatus } from '@/dashboard/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  requireSession();
  const q = req.nextUrl.searchParams;
  const filters: LeadFilters = {
    search: q.get('search') ?? undefined,
    source: q.get('source') ?? undefined,
    status: (q.get('status') ?? undefined) as LeadStatus | 'All' | undefined,
  };
  return handle(() => ok(listLeads(filters)));
}

export async function POST(req: NextRequest) {
  requireSession();
  const parsed = await parseBody(req, createLeadSchema);
  if ('error' in parsed) return parsed.error;
  return handle(() => created(createLead(parsed.data)));
}
