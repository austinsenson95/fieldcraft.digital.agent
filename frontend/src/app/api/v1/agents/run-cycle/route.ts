import { handle, ok, requireSession } from '@/server/dashboard/http';
import { runFullCycle } from '@/server/dashboard/service';

export const dynamic = 'force-dynamic';

export async function POST() {
  requireSession();
  return handle(() => ok(runFullCycle()));
}
