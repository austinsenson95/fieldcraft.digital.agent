import { handle, ok, requireSession } from '@/server/dashboard/http';
import { getOverview } from '@/server/dashboard/service';

export const dynamic = 'force-dynamic';

export async function GET() {
  requireSession();
  return handle(() => ok(getOverview()));
}
