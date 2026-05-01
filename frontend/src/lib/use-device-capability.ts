"use client";

import { useSyncExternalStore } from "react";

function getDeviceCapability(): "high" | "low" {
  if (typeof navigator === "undefined") return "high";
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as { deviceMemory?: number }).deviceMemory ?? 8;
  return cores <= 2 || memory <= 2 ? "low" : "high";
}

function subscribe(callback: () => void) {
  // Device capability doesn't change dynamically, so this is a no-op subscription
  return () => { void callback; };
}

export function useDeviceCapability(): "high" | "low" {
  return useSyncExternalStore(subscribe, getDeviceCapability, () => "high");
}
