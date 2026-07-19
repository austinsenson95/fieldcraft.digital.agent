import type { NextRequest } from 'next/server';
import { handle, ok, parseBody, requireSession } from '@/server/dashboard/http';
import { decideApprovalSchema } from '@/server/dashboard/schemas';
import { decideApproval } from '@/server/dashboard/service';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, ctx: Ctx) {
  requireSession();
  const { id } = await ctx.params;
  const parsed = await parseBody(req, decideApprovalSchema);
  if ('error' in parsed) return parsed.error;
  const { decision, edits } = parsed.data;
  return handle(() => ok(decideApproval(id, decision, edits)));
}
