import type { NextRequest } from 'next/server';
import { handle, ok, requireSession } from '@/server/dashboard/http';
import { clearLogs, listLogs, type LogFilters } from '@/server/dashboard/service';
import type { LogSeverity } from '@/dashboard/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  requireSession();
  const q = req.nextUrl.searchParams;
  const filters: LogFilters = {
    severity: (q.get('severity') ?? undefined) as LogSeverity | 'all' | undefined,
    agent: q.get('agent') ?? undefined,
    pipeline: q.get('pipeline') ?? undefined,
    search: q.get('search') ?? undefined,
  };
  return handle(() => ok(listLogs(filters)));
}

export async function DELETE() {
  requireSession();
  return handle(() => {
    clearLogs();
    return ok({ cleared: true });
  });
}
