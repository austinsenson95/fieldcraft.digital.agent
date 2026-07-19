import { requireSession } from '@/server/dashboard/http';
import { exportAllData } from '@/server/dashboard/service';

export const dynamic = 'force-dynamic';

export async function GET() {
  requireSession();
  const json = exportAllData();
  return new Response(json, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Disposition': 'attachment; filename="fieldcraft-export.json"',
    },
  });
}
