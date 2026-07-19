import type { NextRequest } from 'next/server';
import { handle, ok, parseBody, requireSession } from '@/server/dashboard/http';
import { saveApiKeySchema } from '@/server/dashboard/schemas';
import { listApiKeys, saveApiKey } from '@/server/dashboard/service';

export const dynamic = 'force-dynamic';

export async function GET() {
  requireSession();
  return handle(() => ok(listApiKeys()));
}

export async function PUT(req: NextRequest) {
  requireSession();
  const parsed = await parseBody(req, saveApiKeySchema);
  if ('error' in parsed) return parsed.error;
  const { id, key } = parsed.data;
  return handle(() => ok(saveApiKey(id, key)));
}
