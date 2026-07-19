// SERVER ONLY — shared helpers for the `/api/v1` dashboard route handlers.
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { NotFoundError, ValidationError } from './service';

/**
 * AUTH SEAM — intentionally a no-op.
 *
 * Every `/api/v1` handler calls this first. When real auth lands (next
 * phase, together with Supabase), implement session verification HERE ONCE
 * and all dashboard routes are protected centrally: read the session,
 * throw/return 401 on failure, and pass the user through to the service
 * layer for per-tenant scoping. Do not add per-route auth checks.
 */
export function requireSession(): void {
  // no-op until auth is wired
}

/** 200 JSON response. */
export function ok(data: unknown, init?: ResponseInit): NextResponse {
  return NextResponse.json(data, init);
}

/** 201 JSON response. */
export function created(data: unknown): NextResponse {
  return NextResponse.json(data, { status: 201 });
}

export function badRequest(message: string): NextResponse {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function notFound(message: string): NextResponse {
  return NextResponse.json({ error: message }, { status: 404 });
}

/** Parse and validate a JSON body against a zod schema; null → 400 response. */
export async function parseBody<S extends z.ZodType>(
  req: Request,
  schema: S
): Promise<{ data: z.infer<S> } | { error: NextResponse }> {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return { error: badRequest('Request body must be valid JSON') };
  }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { error: badRequest(parsed.error.issues[0]?.message ?? 'Invalid request body') };
  }
  return { data: parsed.data };
}

/**
 * Run a handler and map domain errors to HTTP responses:
 * ValidationError → 400, NotFoundError → 404, anything else → 500.
 */
export async function handle(fn: () => NextResponse | Promise<NextResponse>): Promise<NextResponse> {
  try {
    return await fn();
  } catch (err) {
    return mapError(err);
  }
}

function mapError(err: unknown): NextResponse {
  if (err instanceof NotFoundError) return notFound(err.message);
  if (err instanceof ValidationError) return badRequest(err.message);
  console.error('[api/v1] unexpected error', err);
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}
