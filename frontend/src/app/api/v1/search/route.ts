import type { NextRequest } from 'next/server';
import { handle, ok, requireSession } from '@/server/dashboard/http';
import { searchAll } from '@/server/dashboard/service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  requireSession();
  const q = req.nextUrl.searchParams.get('q') ?? '';
  return handle(() => ok(searchAll(q)));
}
