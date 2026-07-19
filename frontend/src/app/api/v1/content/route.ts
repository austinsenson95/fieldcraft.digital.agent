import type { NextRequest } from 'next/server';
import { created, handle, ok, parseBody, requireSession } from '@/server/dashboard/http';
import { createPostSchema } from '@/server/dashboard/schemas';
import { createPost, listContent, type ContentFilters } from '@/server/dashboard/service';
import type { ContentCalendar, PipelineStage } from '@/dashboard/types';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  requireSession();
  const q = req.nextUrl.searchParams;
  const filters: ContentFilters = {
    platform: (q.get('platform') ?? undefined) as ContentCalendar['platform'] | 'all' | undefined,
    status: (q.get('status') ?? undefined) as PipelineStage | 'all' | undefined,
    search: q.get('search') ?? undefined,
  };
  return handle(() => ok(listContent(filters)));
}

export async function POST(req: NextRequest) {
  requireSession();
  const parsed = await parseBody(req, createPostSchema);
  if ('error' in parsed) return parsed.error;
  return handle(() => created(createPost(parsed.data)));
}
