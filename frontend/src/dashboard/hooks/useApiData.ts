'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface ApiDataState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

/**
 * Minimal data-fetching hook for the dashboard mock API.
 *
 * ```ts
 * const { data: leads, loading, refetch } = useApiData(
 *   () => listLeads({ status: 'new' }),
 *   [statusFilter],
 * );
 * ```
 *
 * `fn` is captured by ref every render, so inline closures are safe;
 * `deps` controls when a refetch happens. Call `refetch()` after any
 * mutation to re-sync the page with the store.
 */
export function useApiData<T>(fn: () => Promise<T>, deps: readonly unknown[] = []): ApiDataState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [tick, setTick] = useState(0);
  const fnRef = useRef(fn);

  // Keep the ref current outside of render; declared before the fetch
  // effect below so it runs first on every commit.
  useEffect(() => {
    fnRef.current = fn;
  });

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  useEffect(() => {
    let cancelled = false;
    const current = fnRef.current;
    // Defer the loading flip to a microtask so the effect body itself
    // stays free of synchronous setState (react-hooks/set-state-in-effect).
    queueMicrotask(() => {
      if (!cancelled) setLoading(true);
    });
    current()
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setError(null);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  return { data, loading, error, refetch };
}
