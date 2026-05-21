import { COLOR_GROUP_IDS, type ColorGroupId } from "./color-groups";

/**
 * Allowlist of event names that the API will accept. Anything else gets a
 * 400 — this prevents random callers from polluting the Redis hash with
 * arbitrary fields.
 */
export type ProtoEvent =
  | "article_viewed"
  | "coffee_plp_viewed"
  | "filter_panel_opened"
  | "cart_opened"
  | "subscription_explored"
  | "checkout_reached"
  | `color_filter_applied:${ColorGroupId}`
  | `add_to_cart:${ColorGroupId}`;

export const ALLOWED_EVENTS: ReadonlySet<string> = new Set<string>([
  "article_viewed",
  "coffee_plp_viewed",
  "filter_panel_opened",
  "cart_opened",
  "subscription_explored",
  "checkout_reached",
  ...COLOR_GROUP_IDS.map((c) => `color_filter_applied:${c}`),
  ...COLOR_GROUP_IDS.map((c) => `add_to_cart:${c}`),
]);

/** Redis hash key holding every counter. */
export const EVENTS_HASH = "nespresso:events";

/**
 * Fire-and-forget. Best-effort POST to the analytics endpoint, never throws,
 * never blocks the UI. Safe to call from anywhere on the client.
 */
export function trackEvent(event: ProtoEvent): void {
  if (typeof window === "undefined") return;
  try {
    // keepalive lets the request finish even if the user is navigating away
    // (e.g. after tapping "checkout" in the iframe).
    fetch("/api/proto-events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event }),
      keepalive: true,
    }).catch(() => {
      /* swallow */
    });
  } catch {
    /* swallow */
  }
}
