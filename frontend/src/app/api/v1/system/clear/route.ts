import { handle, ok, requireSession } from '@/server/dashboard/http';
import { clearAllData } from '@/server/dashboard/service';

export const dynamic = 'force-dynamic';

export async function POST() {
  requireSession();
  return handle(() => {
    clearAllData();
    return ok({ cleared: true });
  });
}
