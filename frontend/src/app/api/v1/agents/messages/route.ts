import type { NextRequest } from 'next/server';
import { created, handle, ok, parseBody, requireSession } from '@/server/dashboard/http';
import { sendMessageSchema } from '@/server/dashboard/schemas';
import { listMessages, sendMessage, type MessageFilters } from '@/server/dashboard/service';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  requireSession();
  const q = req.nextUrl.searchParams;
  const filters: MessageFilters = {
    agent: q.get('agent') ?? undefined,
    search: q.get('search') ?? undefined,
  };
  return handle(() => ok(listMessages(filters)));
}

export async function POST(req: NextRequest) {
  requireSession();
  const parsed = await parseBody(req, sendMessageSchema);
  if ('error' in parsed) return parsed.error;
  const { content, targetAgent } = parsed.data;
  return handle(() => created(sendMessage(content, targetAgent)));
}
