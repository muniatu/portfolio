import { getProtoStats } from "@/lib/proto/stats";
import { COLOR_GROUPS } from "@/lib/proto/color-groups";

/**
 * Easter-egg block at the end of the Nespresso case study. Reads aggregated
 * event counters from Redis (Vercel KV / Upstash) and renders a small
 * editorial-style report — the meta point being that code prototypes can
 * quietly collect quantitative data alongside qualitative findings.
 *
 * Server component so we can hit Redis directly. The host page sets a
 * 5-minute revalidate so numbers stay fresh-ish without hammering KV.
 */
export default async function PrototypeStats() {
  const stats = await getProtoStats();

  const totalAddToCart = stats.perColor.reduce(
    (sum, c) => sum + c.addToCart,
    0,
  );
  const maxAddToCart = Math.max(...stats.perColor.map((c) => c.addToCart), 1);
  // Keep the COLOR_GROUPS rainbow order — yellow → orange → … → black —
  // so the column reads as a consistent spectrum no matter which color
  // is leading.
  const swatchById = Object.fromEntries(
    COLOR_GROUPS.map((g) => [g.id, { label: g.label, swatch: g.swatch }]),
  );

  const {
    articleViewed,
    coffeePlpViewed,
    filterPanelOpened,
    subscriptionExplored,
    checkoutReached,
  } = stats.totals;

  // "Visited the coffee list page" is expressed off article views; the
  // remaining three rates use the same article-view baseline so every
  // percentage on the page reads against the same denominator.
  const visitRate = pct(coffeePlpViewed, articleViewed);
  const filterRate = pct(filterPanelOpened, articleViewed);
  const subscriptionRate = pct(subscriptionExplored, articleViewed);
  const checkoutRate = pct(checkoutReached, articleViewed);

  return (
    <section className="mx-auto my-16 max-w-3xl">
      <div className="not-prose text-[11px] font-normal uppercase tracking-[0.18em] text-white/40">
        P.S. — live data of the prototype
      </div>
      {/* Inherit prose-lg sizing/weight from the article, but pull the
          top margin in so the eyebrow above hugs the heading. */}
      <h2 className="!mt-2">When qualitative prototypes turn quantitative.</h2>
      <p>
        As prototype above is real code, it can also track events. This is a
        live demonstration of how people that visited this portfolio have
        interacted with it.
      </p>

      {/* Baseline: total article readers. The four rates below are all
          measured off this number so they're directly comparable. */}
      <div className="not-prose mt-7 text-center">
        <div className="font-display text-[44px] leading-none tracking-tight text-white">
          {fmt(articleViewed)}
        </div>
        <div className="mt-2 text-[12px] uppercase tracking-[0.18em] text-white/40">
          readers of this article
        </div>
      </div>

      {/* Four conversion rates, all measured off article views. */}
      <div className="not-prose mt-6 grid grid-cols-2 gap-3 text-center sm:grid-cols-4">
        <RateCell
          value={visitRate}
          label="visited the coffee list page"
          empty={!articleViewed}
        />
        <RateCell
          value={filterRate}
          label="opened the filters"
          empty={!articleViewed}
        />
        <RateCell
          value={subscriptionRate}
          label="checked the subscription"
          empty={!articleViewed}
        />
        <RateCell
          value={checkoutRate}
          label="finished the purchase"
          empty={!articleViewed}
        />
      </div>

      {/* Per-color add-to-cart leaderboard */}
      <div className="not-prose mt-8">
        <div className="text-[11px] font-normal uppercase tracking-[0.18em] text-white/40">
          Add to cart, by color · {fmt(totalAddToCart)} total
        </div>
        <ul className="mt-3 space-y-2">
          {stats.perColor.map((row) => {
            const meta = swatchById[row.color];
            if (!meta) return null;
            const widthPct = Math.round((row.addToCart / maxAddToCart) * 100);
            return (
              <li
                key={row.color}
                className="grid grid-cols-[80px_1fr_44px] items-center gap-3 text-[14px]"
              >
                <div className="flex items-center gap-2 text-white/80">
                  <span
                    aria-hidden
                    className="inline-block h-3 w-3 rounded-full border border-white/20"
                    style={{ backgroundColor: meta.swatch }}
                  />
                  <span>{meta.label}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    className="h-full rounded-full transition-[width] duration-500"
                    style={{
                      width: `${widthPct}%`,
                      backgroundColor: meta.swatch,
                    }}
                  />
                </div>
                <div className="text-right tabular-nums text-white/70">
                  {fmt(row.addToCart)}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function RateCell({
  value,
  label,
  empty,
}: {
  value: string;
  label: string;
  empty: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <div className="font-display text-[32px] leading-none tracking-tight text-white">
        {empty ? "—" : value}
      </div>
      <div className="mt-2 text-[12px] leading-snug text-white/60">{label}</div>
    </div>
  );
}

function fmt(n: number) {
  return n.toLocaleString("en-US");
}

function pct(numerator: number, denominator: number) {
  if (!denominator) return "0%";
  const value = Math.round((numerator / denominator) * 100);
  return `${value}%`;
}
