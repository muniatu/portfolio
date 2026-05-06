"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import NespressoStatusBar from "./NespressoStatusBar";
import NespressoNavBar from "./NespressoNavBar";
import NespressoFooter from "./NespressoFooter";
import capsulesData from "./capsules.json";
import { useCart } from "./_cart-context";

type Capsule = {
  id: number;
  filename: string;
  name: string;
  color: string;
  size: string;
};

const CAPSULES: Capsule[] = capsulesData;
const CAPSULES_PATH = "/images/projects/nespresso/capsules/";

const DEFAULT_PRICE = 5.9;
const DEFAULT_CAPSULES_PER_SLEEVE = 10;

const INTENSITY_PRESETS = [
  { label: "Mild (1–4)", min: 1, max: 4 },
  { label: "Medium (5–7)", min: 5, max: 7 },
  { label: "Strong (8–10)", min: 8, max: 10 },
  { label: "Intense (11–13)", min: 11, max: 13 },
];

const SIZE_FILTERS: Array<{ id: string; label: string; icon: string }> = [
  { id: "ristretto",       label: "Ristretto",       icon: "/images/projects/nespresso/icons/cupsize-ristretto.svg" },
  { id: "espresso",        label: "Espresso",        icon: "/images/projects/nespresso/icons/cupsize-espresso.svg" },
  { id: "double-espresso", label: "Double Espresso", icon: "/images/projects/nespresso/icons/cupsize-double-espresso.svg" },
  { id: "gran-lungo",      label: "Gran Lungo",      icon: "/images/projects/nespresso/icons/cupsize-gran-lungo.svg" },
  { id: "mug",             label: "Mug",             icon: "/images/projects/nespresso/icons/cupsize-mug.svg" },
  { id: "carafe",          label: "Carafe",          icon: "/images/projects/nespresso/icons/cupsize-carafe.svg" },
];

// Plain-colour buckets. Each capsule belongs to one bucket based on its
// dominant hue. The `swatch` is the hex shown next to each chip.
const COLOR_GROUPS: Array<{
  id: string;
  label: string;
  swatch: string;
  ids: number[];
}> = [
  { id: "yellow", label: "Yellow", swatch: "#F0B430", ids: [1, 2, 3, 4, 7] },
  { id: "orange", label: "Orange", swatch: "#C0843C", ids: [5, 6] },
  { id: "pink",   label: "Pink",   swatch: "#E4786C", ids: [10] },
  { id: "red",    label: "Red",    swatch: "#CC4848", ids: [8, 9, 11] },
  { id: "purple", label: "Purple", swatch: "#542478", ids: [12, 13, 14] },
  { id: "navy",   label: "Navy",   swatch: "#0C183C", ids: [15, 17, 18] },
  { id: "blue",   label: "Blue",   swatch: "#0090C0", ids: [19, 20] },
  { id: "green",  label: "Green",  swatch: "#547818", ids: [22, 23, 24, 25, 26] },
  { id: "brown",  label: "Brown",  swatch: "#543018", ids: [27, 28, 29, 30] },
  { id: "grey",   label: "Grey",   swatch: "#909090", ids: [21, 31] },
  { id: "black",  label: "Black",  swatch: "#181818", ids: [16, 32] },
];

// Distribute intensities across the 1–13 scale so cards don't all show the
// same number. Replace with real data when available.
function intensityFor(id: number) {
  return Math.min(13, Math.max(1, Math.round((id / CAPSULES.length) * 13)));
}

function PlusIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M5 12h14" />
    </svg>
  );
}

function ProductCard({
  capsule,
  index,
  animate,
}: {
  capsule: Capsule;
  index: number;
  animate: boolean;
}) {
  const { cart, add, setQty } = useCart();
  const count = cart[capsule.id] ?? 0;
  const inCart = count > 0;
  const intensity = intensityFor(capsule.id);
  const src = encodeURI(`${CAPSULES_PATH}${capsule.filename}`);

  // Stagger delay: 25ms per visible index. ~25 tiles in view tops out near 600ms.
  const cardStyle: React.CSSProperties = {
    backgroundColor: capsule.color,
    ...(animate
      ? {
          animation:
            "rainbow-cascade 450ms cubic-bezier(0.23, 1, 0.32, 1) both",
          animationDelay: `${index * 25}ms`,
        }
      : null),
  };

  return (
    <div
      className="relative flex h-[220px] flex-col overflow-hidden rounded-2xl p-3"
      style={cardStyle}
    >
      <div className="text-[14px] font-normal leading-tight text-black">
        {capsule.name}
      </div>

      <div className="flex flex-1 items-center justify-center py-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={capsule.name}
          className="max-h-[120px] w-auto object-contain"
          loading="lazy"
        />
      </div>

      {/* Footer row — every element absolutely positioned at its true
          anchor so layout doesn't fight with the morph. The (+) button
          is the only one rendered once for both states. */}
      <div className="relative h-9">
        {/* Default: intensity + price, anchored left */}
        <div
          aria-hidden={inCart}
          className={`absolute inset-y-0 left-0 flex items-center transition-[opacity,transform,filter] duration-[260ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${
            inCart
              ? "pointer-events-none scale-[0.97] opacity-0 blur-[2px]"
              : "scale-100 opacity-100 blur-0"
          }`}
        >
          <div className="text-[11px] leading-snug text-black/70">
            <div>Intensity: {intensity}/13</div>
            <div className="mt-0.5 text-black">
              €{DEFAULT_PRICE.toFixed(2)}{" "}
              <span>({DEFAULT_CAPSULES_PER_SLEEVE} capsules)</span>
            </div>
          </div>
        </div>

        {/* In-cart: − button, anchored left */}
        <button
          type="button"
          aria-label="Decrease"
          aria-hidden={!inCart}
          onClick={() => setQty(capsule.id, count - 1)}
          className={`absolute inset-y-0 left-0 my-auto flex h-8 w-8 items-center justify-center rounded-full bg-black/10 text-black transition-[opacity,transform,filter] duration-[260ms] ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-95 ${
            inCart
              ? "scale-100 opacity-100 blur-0"
              : "pointer-events-none scale-[0.97] opacity-0 blur-[2px]"
          }`}
        >
          <MinusIcon />
        </button>

        {/* In-cart: count + total — full-width flex container centres the
            inner stack in the row, no manual translate gymnastics. */}
        <div
          aria-hidden={!inCart}
          className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-[opacity,transform,filter] duration-[260ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${
            inCart
              ? "scale-100 opacity-100 blur-0"
              : "scale-[0.97] opacity-0 blur-[2px]"
          }`}
        >
          <div className="flex flex-col items-center leading-tight">
            <div className="text-[12px] font-normal text-black">
              {count} sleeve{count > 1 ? "s" : ""}
            </div>
            <div className="text-[10px] font-normal tabular-nums text-stone-500">
              €{(count * DEFAULT_PRICE).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Always: + button, anchored right — same DOM node both states. */}
        <button
          type="button"
          aria-label={inCart ? "Increase" : `Add ${capsule.name}`}
          onClick={() => add(capsule.id)}
          className="absolute inset-y-0 right-0 my-auto flex h-8 w-8 items-center justify-center rounded-full bg-black/10 text-black transition-transform duration-150 ease-out active:scale-95"
        >
          <PlusIcon />
        </button>
      </div>
    </div>
  );
}

function SearchGlyph() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function FilterGlyph() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3Z" />
    </svg>
  );
}

export default function NespressoCoffeePage() {
  const [query, setQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [activePresets, setActivePresets] = useState<number[]>([]);
  const [activeColors, setActiveColors] = useState<string[]>([]);
  const [activeSizes, setActiveSizes] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const allowedColorIds = activeColors.length
      ? new Set(
          COLOR_GROUPS.filter((g) => activeColors.includes(g.id)).flatMap(
            (g) => g.ids
          )
        )
      : null;

    return CAPSULES.filter((c) => {
      if (q && !c.name.toLowerCase().includes(q)) return false;
      if (allowedColorIds && !allowedColorIds.has(c.id)) return false;
      if (activeSizes.length > 0 && !activeSizes.includes(c.size)) return false;
      if (activePresets.length > 0) {
        const intensity = intensityFor(c.id);
        const matches = activePresets.some((i) => {
          const p = INTENSITY_PRESETS[i];
          return intensity >= p.min && intensity <= p.max;
        });
        if (!matches) return false;
      }
      return true;
    });
  }, [query, activePresets, activeColors, activeSizes]);

  const togglePreset = (i: number) =>
    setActivePresets((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
    );
  const toggleColor = (id: string) =>
    setActiveColors((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  const toggleSize = (id: string) =>
    setActiveSizes((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const filterCount =
    activePresets.length + activeColors.length + activeSizes.length;

  // One-shot entrance cascade. After it settles, disable so subsequent
  // filter/search changes don't re-trigger the animation on every keystroke.
  const [animateGrid, setAnimateGrid] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setAnimateGrid(false), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="bg-white">
      <NespressoStatusBar />
      <NespressoNavBar />

      {/* Header: title + back link + concierge */}
      <div className="px-4">
        <nav
          aria-label="Breadcrumb"
          className="mb-3 flex items-center justify-center gap-1.5 text-[13px] font-normal text-stone-500"
        >
          <Link
            href="/projects/nespresso-color-filter/homepage"
            className="hover:text-black"
          >
            Home
          </Link>
          <svg
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="m9 6 6 6-6 6" />
          </svg>
          <span className="text-black" aria-current="page">
            Coffee
          </span>
        </nav>
        <h1 className="text-center text-[28px] font-normal leading-tight text-black">
          Vertuo Capsules
        </h1>

        {/* Search input + filter button */}
        <div className="mt-4 flex h-12 w-full items-center gap-2 rounded-full border border-stone-200 bg-white pl-5 pr-1.5">
          <span className="text-stone-500">
            <SearchGlyph />
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What are you looking for?"
            className="min-w-0 flex-1 bg-transparent text-[14px] font-normal text-black placeholder:text-stone-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setFilterOpen((o) => !o)}
            aria-label={`Filters${filterCount > 0 ? ` (${filterCount} active)` : ""}`}
            aria-expanded={filterOpen}
            className={`flex h-9 shrink-0 items-center rounded-full px-3 transition-[background,color] duration-200 ${
              filterCount > 0 || filterOpen
                ? "bg-black text-white"
                : "bg-black/10 text-black"
            }`}
          >
            <FilterGlyph />
            {/* Count slot: width animates via the grid 0fr ↔ 1fr trick.
                Always rendered so the number can fade out when filters
                are cleared. */}
            <span
              aria-hidden={filterCount === 0}
              className={`grid overflow-hidden transition-[grid-template-columns] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                filterCount > 0 ? "grid-cols-[1fr]" : "grid-cols-[0fr]"
              }`}
            >
              <span className="overflow-hidden">
                <span
                  className={`block pl-1.5 text-[12px] font-normal tabular-nums transition-opacity duration-200 ${
                    filterCount > 0 ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {filterCount}
                </span>
              </span>
            </span>
          </button>
        </div>

        {/* Filter panel — grid 1fr trick lets natural content height drive
            the open size while remaining smoothly interruptible. Asymmetric
            timing: enter slow (320ms), exit fast (200ms). */}
        <div
          aria-hidden={!filterOpen}
          className="grid overflow-hidden ease-[cubic-bezier(0.23,1,0.32,1)]"
          style={{
            gridTemplateRows: filterOpen ? "1fr" : "0fr",
            opacity: filterOpen ? 1 : 0,
            marginTop: filterOpen ? 12 : 0,
            transitionProperty: "grid-template-rows, opacity, margin-top",
            transitionDuration: filterOpen ? "320ms" : "200ms",
          }}
        >
          <div className="overflow-hidden">
            <div className="rounded-2xl border border-stone-200 bg-white p-4">
              {/* Header */}
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[12px] font-normal text-stone-500">
                  Filters
                </span>
                {filterCount > 0 ? (
                  <button
                    type="button"
                    onClick={() => {
                      setActivePresets([]);
                      setActiveColors([]);
                      setActiveSizes([]);
                    }}
                    className="text-[12px] font-normal text-stone-500 underline-offset-2 hover:underline"
                  >
                    Clear all
                  </button>
                ) : null}
              </div>

              {/* Intensity */}
              <div className="mb-1 text-[11px] font-normal uppercase tracking-wider text-stone-400">
                Intensity
              </div>
              <div className="mb-4 flex flex-wrap gap-2">
                {INTENSITY_PRESETS.map((p, i) => {
                  const active = activePresets.includes(i);
                  return (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => togglePreset(i)}
                      aria-pressed={active}
                      className={`inline-flex h-8 items-center rounded-full border px-3 text-[13px] font-normal transition-[transform,background,color,border-color] duration-150 ease-out active:scale-[0.97] ${
                        active
                          ? "border-black bg-black text-white"
                          : "border-stone-300 bg-white text-black"
                      }`}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>

              {/* Size */}
              <div className="mb-1 text-[11px] font-normal uppercase tracking-wider text-stone-400">
                Size
              </div>
              <div className="mb-4 flex flex-wrap gap-2">
                {SIZE_FILTERS.map((s) => {
                  const active = activeSizes.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleSize(s.id)}
                      aria-pressed={active}
                      className={`inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[13px] font-normal transition-[transform,background,color,border-color] duration-150 ease-out active:scale-[0.97] ${
                        active
                          ? "border-black bg-black text-white"
                          : "border-stone-300 bg-white text-black"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={s.icon}
                        alt=""
                        width={14}
                        height={14}
                        aria-hidden
                        className={`block ${active ? "invert" : ""}`}
                      />
                      {s.label}
                    </button>
                  );
                })}
              </div>

              {/* Color */}
              <div className="mb-1 text-[11px] font-normal uppercase tracking-wider text-stone-400">
                Color
              </div>
              <div className="flex flex-wrap gap-2">
                {COLOR_GROUPS.map((g) => {
                  const active = activeColors.includes(g.id);
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => toggleColor(g.id)}
                      aria-pressed={active}
                      className={`inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-[13px] font-normal transition-[transform,background,color,border-color] duration-150 ease-out active:scale-[0.97] ${
                        active
                          ? "border-black bg-black text-white"
                          : "border-stone-300 bg-white text-black"
                      }`}
                    >
                      <span
                        aria-hidden
                        className="block h-3 w-3 rounded-full ring-1 ring-black/10"
                        style={{ backgroundColor: g.swatch }}
                      />
                      {g.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product grid — capsules render in numeric order, which forms the rainbow */}
      <div className="px-4 pb-6 pt-5">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((c, i) => (
              <ProductCard
                key={c.id}
                capsule={c}
                index={i}
                animate={animateGrid}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center text-[14px] text-stone-500">
            No capsules match your search.
          </div>
        )}
      </div>

      <NespressoFooter />
    </div>
  );
}
