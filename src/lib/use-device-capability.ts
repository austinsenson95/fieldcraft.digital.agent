"use client";

import { useEffect, useState } from "react";

export function useDeviceCapability(): "high" | "low" {
  const [capability, setCapability] = useState<"high" | "low">("high");

  useEffect(() => {
    const cores = navigator.hardwareConcurrency ?? 4;
    const memory = (navigator as { deviceMemory?: number }).deviceMemory ?? 8;

    if (cores <= 2 || memory <= 2) {
      setCapability("low");
    }
  }, []);

  return capability;
}
