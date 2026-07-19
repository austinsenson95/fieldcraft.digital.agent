import type { NextRequest } from 'next/server';
import { handle, ok, parseBody, requireSession } from '@/server/dashboard/http';
import { updatePostSchema } from '@/server/dashboard/schemas';
import { deletePost, updatePost } from '@/server/dashboard/service';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, ctx: Ctx) {
  requireSession();
  const { id } = await ctx.params;
  const parsed = await parseBody(req, updatePostSchema);
  if ('error' in parsed) return parsed.error;
  return handle(() => ok(updatePost(id, parsed.data)));
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  requireSession();
  const { id } = await ctx.params;
  return handle(() => {
    deletePost(id);
    return ok({ deleted: true });
  });
}
