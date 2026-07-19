import type { NextRequest } from 'next/server';
import { handle, ok, parseBody, requireSession } from '@/server/dashboard/http';
import { updateProductIdeaSchema } from '@/server/dashboard/schemas';
import { deleteProductIdea, updateProductIdea } from '@/server/dashboard/service';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, ctx: Ctx) {
  requireSession();
  const { id } = await ctx.params;
  const parsed = await parseBody(req, updateProductIdeaSchema);
  if ('error' in parsed) return parsed.error;
  return handle(() => ok(updateProductIdea(id, parsed.data)));
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  requireSession();
  const { id } = await ctx.params;
  return handle(() => {
    deleteProductIdea(id);
    return ok({ deleted: true });
  });
}
