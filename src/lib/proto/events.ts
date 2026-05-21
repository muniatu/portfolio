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
 * localStorage prefix for the once-per-browser dedupe flags. Each event
 * (including parameterized ones like `add_to_cart:purple`) gets its own
 * key, so we count unique readers per event rather than raw taps. That
 * keeps every percentage in the easter-egg block bounded by article views
 * and prevents the funnel from going past 100% if a reader, say, opens
 * the cart twice or restarts the flow after finishing the purchase.
 *
 * Shared across the parent article and the iframe because they're on the
 * same origin.
 */
const DEDUPE_PREFIX = "nespresso-evt:";

/**
 * Fire-and-forget. Best-effort POST to the analytics endpoint, deduped per
 * browser via localStorage. Never throws, never blocks the UI.
 */
export function trackEvent(event: ProtoEvent): void {
  if (typeof window === "undefined") return;

  // Dedupe: if this browser already fired this event, drop the call so
  // each counter stays a count of unique readers.
  try {
    const key = DEDUPE_PREFIX + event;
    if (window.localStorage.getItem(key)) return;
    window.localStorage.setItem(key, "1");
  } catch {
    /* localStorage disabled / full — still fire the event so users
       with privacy-locked browsers aren't completely silent. */
  }

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
