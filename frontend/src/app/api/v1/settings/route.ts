import type { NextRequest } from 'next/server';
import { handle, ok, parseBody, requireSession } from '@/server/dashboard/http';
import { saveSettingsSchema } from '@/server/dashboard/schemas';
import { getSettings, saveSettings } from '@/server/dashboard/service';

export const dynamic = 'force-dynamic';

export async function GET() {
  requireSession();
  return handle(() => ok(getSettings()));
}

export async function PUT(req: NextRequest) {
  requireSession();
  const parsed = await parseBody(req, saveSettingsSchema);
  if ('error' in parsed) return parsed.error;
  return handle(() => ok(saveSettings(parsed.data)));
}
