import { buildSeed, type StoreState } from './seed';

/**
 * Singleton in-memory store for the dashboard mock backend.
 *
 * The module-level `state` is seeded deterministically from `./seed`
 * (fixed ISO strings + seeded PRNG), so importing this module on the
 * server and in the browser yields identical data — no hydration hazard.
 *
 * On the client, module state survives client-side navigation, which is
 * what makes mutations feel "persisted" in the mock backend. When a real
 * `/api/v1` backend lands, this file is deleted and `client.ts` is the
 * only file that changes.
 */
let state: StoreState = buildSeed();

/** Direct (mutable) access to the store. Only `client.ts` should use this. */
export function getState(): StoreState {
  return state;
}

/** Reset the store to its deterministic seed. Used by tests. */
export function resetStore(): void {
  state = buildSeed();
}

/** Deep clone so callers can never mutate the store by accident. */
export function clone<T>(value: T): T {
  return structuredClone(value);
}

/** Monotonic, predictable id generator per entity kind. */
export function nextId(kind: keyof StoreState['counters'], prefix?: string): string {
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
