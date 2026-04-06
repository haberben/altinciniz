"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AutoRefresh({ intervalMs = 30000 }: { intervalMs?: number }) {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      // Background sunucu verisini (ISR) tazelemesi için sayfanın client router'ını yeniler
      router.refresh();
    }, intervalMs);

    return () => clearInterval(interval);
  }, [router, intervalMs]);

  return null;
}
