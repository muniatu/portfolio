import { hgetall, isKvConfigured } from "./kv";
import {
  COLOR_GROUP_IDS,
  type ColorGroupId,
} from "./color-groups";
import { EVENTS_HASH } from "./events";

export type ProtoStats = {
  configured: boolean;
  totals: {
    articleViewed: number;
    coffeePlpViewed: number;
    filterPanelOpened: number;
    cartOpened: number;
    subscriptionExplored: number;
    checkoutReached: number;
  };
  perColor: Array<{
    color: ColorGroupId;
    filterApplied: number;
    addToCart: number;
  }>;
};

/**
 * Server-side read of the prototype event counters. Wraps the Redis HGETALL
 * call in a typed shape the MDX component can consume directly.
 */
export async function getProtoStats(): Promise<ProtoStats> {
  const configured = isKvConfigured();
  const raw = configured ? await hgetall(EVENTS_HASH) : {};
  const get = (k: string) => Number.parseInt(raw[k] ?? "0", 10) || 0;

  return {
    configured,
    totals: {
      articleViewed: get("article_viewed"),
      coffeePlpViewed: get("coffee_plp_viewed"),
      filterPanelOpened: get("filter_panel_opened"),
      cartOpened: get("cart_opened"),
      subscriptionExplored: get("subscription_explored"),
      checkoutReached: get("checkout_reached"),
    },
    perColor: COLOR_GROUP_IDS.map((color) => ({
      color,
      filterApplied: get(`color_filter_applied:${color}`),
      addToCart: get(`add_to_cart:${color}`),
    })),
  };
}
