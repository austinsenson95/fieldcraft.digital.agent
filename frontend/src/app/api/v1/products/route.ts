import type { NextRequest } from 'next/server';
import { created, handle, ok, parseBody, requireSession } from '@/server/dashboard/http';
import { createProductIdeaSchema } from '@/server/dashboard/schemas';
import { createProductIdea, listProductIdeas } from '@/server/dashboard/service';

export const dynamic = 'force-dynamic';

export async function GET() {
  requireSession();
  return handle(() => ok(listProductIdeas()));
}

export async function POST(req: NextRequest) {
  requireSession();
  const parsed = await parseBody(req, createProductIdeaSchema);
  if ('error' in parsed) return parsed.error;
  return handle(() => created(createProductIdea(parsed.data)));
}
