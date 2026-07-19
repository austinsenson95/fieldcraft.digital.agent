import type { NextRequest } from 'next/server';
import { handle, ok, parseBody, requireSession } from '@/server/dashboard/http';
import { approvalEditsSchema } from '@/server/dashboard/schemas';
import { updateApproval } from '@/server/dashboard/service';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, ctx: Ctx) {
  requireSession();
  const { id } = await ctx.params;
  const parsed = await parseBody(req, approvalEditsSchema);
  if ('error' in parsed) return parsed.error;
  return handle(() => ok(updateApproval(id, parsed.data)));
}
