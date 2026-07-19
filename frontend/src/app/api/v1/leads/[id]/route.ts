import type { NextRequest } from 'next/server';
import { handle, ok, parseBody, requireSession } from '@/server/dashboard/http';
import { updateLeadSchema } from '@/server/dashboard/schemas';
import { deleteLead, updateLead } from '@/server/dashboard/service';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, ctx: Ctx) {
  requireSession();
  const { id } = await ctx.params;
  const parsed = await parseBody(req, updateLeadSchema);
  if ('error' in parsed) return parsed.error;
  return handle(() => ok(updateLead(id, parsed.data)));
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  requireSession();
  const { id } = await ctx.params;
  return handle(() => {
    deleteLead(id);
    return ok({ deleted: true });
  });
}
