import type { NextRequest } from 'next/server';
import { requireSession } from '@/server/dashboard/http';
import { exportLeadsCsv, type LeadFilters } from '@/server/dashboard/service';
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
  const csv = exportLeadsCsv(filters);
  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="leads.csv"',
    },
  });
}
