"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/proto/events";

/**
 * Fires a single `article_viewed` ping on mount. Dropped near the top of the
 * Nespresso MDX so the <PrototypeStats /> block at the bottom can express
 * the other funnel metrics as a percentage of total article visits.
 */
export default function ArticleViewTracker() {
  useEffect(() => {
    trackEvent("article_viewed");
  }, []);
  return null;
}
