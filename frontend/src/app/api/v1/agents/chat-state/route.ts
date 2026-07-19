import type { NextRequest } from 'next/server';
import { handle, ok, parseBody, requireSession } from '@/server/dashboard/http';
import { chatStateSchema } from '@/server/dashboard/schemas';
import { getChatState, setChatPaused } from '@/server/dashboard/service';

export const dynamic = 'force-dynamic';

export async function GET() {
  requireSession();
  return handle(() => ok(getChatState()));
}

export async function PATCH(req: NextRequest) {
  requireSession();
  const parsed = await parseBody(req, chatStateSchema);
  if ('error' in parsed) return parsed.error;
  return handle(() => ok(setChatPaused(parsed.data.paused)));
}
