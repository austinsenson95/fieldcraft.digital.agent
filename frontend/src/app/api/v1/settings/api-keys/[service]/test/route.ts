import type { NextRequest } from 'next/server';
import { handle, ok, requireSession } from '@/server/dashboard/http';
import { testConnection } from '@/server/dashboard/service';

export const dynamic = 'force-dynamic';

type Ctx = { params: Promise<{ service: string }> };

export async function POST(_req: NextRequest, ctx: Ctx) {
  requireSession();
  const { service } = await ctx.params;
  return handle(() => ok(testConnection(service)));
}
