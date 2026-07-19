// SERVER ONLY — never import from client components ('use client' files).
// The dashboard client (`src/dashboard/api/client.ts`) reaches this layer
// exclusively over HTTP via the `/api/v1` route handlers.
import { buildSeed, type StoreState } from './seed';

/**
 * Singleton in-memory store for the dashboard's server-side mock backend.
 *
 * The store lives on `globalThis` so Next.js dev-mode hot reloads (which
 * re-evaluate modules) reuse the same state instead of re-seeding on every
 * edit — the same pattern Prisma clients use.
 *
 * EPHEMERAL: this is per-process memory. On serverless deployments each
 * lambda gets its own copy and any instance can be recycled at any time.
 * It exists only to give the `/api/v1` routes realistic behaviour until
 * Supabase (or another real backend) replaces it — at that point this file
 * and `seed.ts` are deleted and `service.ts` is rewired, with no route or
 * client changes.
 */
const globalForDashboard = globalThis as unknown as {
  __dashboardStore?: StoreState;
};

/** Direct (mutable) access to the store. Only `service.ts` should use this. */
export function getState(): StoreState {
  if (!globalForDashboard.__dashboardStore) {
    globalForDashboard.__dashboardStore = buildSeed();
  }
  return globalForDashboard.__dashboardStore;
}

/** Reset the store to its deterministic seed. Used by tests. */
export function resetStore(): void {
  globalForDashboard.__dashboardStore = buildSeed();
}

/** Deep clone so callers can never mutate the store by accident. */
export function clone<T>(value: T): T {
  return structuredClone(value);
}

/** Monotonic, predictable id generator per entity kind. */
export function nextId(kind: keyof StoreState['counters'], prefix?: string): string {
  const state = getState();
  state.counters[kind] += 1;
  return `${prefix ?? ''}${state.counters[kind]}`;
}

/** Current timestamp for mutations only — never called at import time. */
export function nowIso(): string {
  return new Date().toISOString();
}

/** 'HH:MM:SS' timestamp for chat-style messages. Mutation-time only. */
export function nowTime(): string {
  return new Date().toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export type { StoreState };
export type { ApiKeyRecord } from './seed';
