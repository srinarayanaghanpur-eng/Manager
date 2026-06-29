"use client";

import { useEffect, useState } from "react";
import type { Platform } from "@/lib/types";
import type { SocialFetchResult } from "@/lib/adapters/types";

// Client hook: fetches live (or demo) social metrics from /api/social.
// Returns the result plus loading state. The server decides live vs demo based
// on which API keys are configured, so the UI just renders what it gets.
export function useLiveSocial(schoolId: string, platform: Platform) {
  const [data, setData] = useState<SocialFetchResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/social?schoolId=${encodeURIComponent(schoolId)}&platform=${platform}`)
      .then((r) => r.json())
      .then((json: SocialFetchResult) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setData(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [schoolId, platform]);

  return { data, loading };
}
