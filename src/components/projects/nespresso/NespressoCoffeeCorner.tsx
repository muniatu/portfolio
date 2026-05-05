"use client";

import { useState } from "react";

type Hotspot = {
  /** Normalized 0–1 x position relative to the image */
  x: number;
  /** Normalized 0–1 y position */
  y: number;
  /** Tooltip label shown when the dot is tapped */
  label?: string;
};

type Props = {
  title?: string;
  subtitle?: string;
  /** Big top image, ~370×343 */
  mainImage?: string;
  mainHotspots?: Hotspot[];
  mainEyebrow?: string;
  mainCaption?: string;
  /** Two side-by-side images, ~177×167 each */
  secondaryImage1?: string;
  secondary1Hotspots?: Hotspot[];
  secondaryImage2?: string;
  secondary2Hotspots?: Hotspot[];
  /** Bottom recipe highlight card */
  recipeImage?: string;
  recipeEyebrow?: string;
  recipeTitle?: string;
};

const DEFAULT_MAIN_HOTSPOTS: Hotspot[] = [
  { x: 0.34, y: 0.42, label: "Vertuo machine" },
  { x: 0.55, y: 0.5, label: "Pod set" },
  { x: 0.78, y: 0.6, label: "Recycled glass cup" },
];

const DEFAULT_SECONDARY1_HOTSPOTS: Hotspot[] = [
  { x: 0.42, y: 0.4, label: "Travel tumbler" },
  { x: 0.7, y: 0.65, label: "Almond bites" },
];

const DEFAULT_SECONDARY2_HOTSPOTS: Hotspot[] = [
  { x: 0.45, y: 0.45, label: "Iced glass" },
  { x: 0.6, y: 0.65, label: "Pour-over kit" },
];

// Pulse cycle. Stagger steps must divide evenly into this so each dot
// settles into its own phase of the loop.
const PULSE_DURATION_MS = 4000;
const PULSE_STAGGER_MS = 1000;

function Hotspot({
  hotspot,
  active,
  onClick,
  index = 0,
}: {
  hotspot: Hotspot;
  active: boolean;
  onClick: () => void;
  index?: number;
}) {
  // Modulo the cycle so 4+ dots still distribute evenly across the loop
  const delayMs = (index * PULSE_STAGGER_MS) % PULSE_DURATION_MS;

  return (
    <button
      type="button"
      onClick={onClick}
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${hotspot.x * 100}%`, top: `${hotspot.y * 100}%` }}
      aria-label={hotspot.label ?? "View product"}
    >
      <span className="relative flex h-4 w-4 items-center justify-center">
        {/* Pulsing ring — slower, gentler ease-in-out, staggered per dot */}
        <span
          className={`absolute inline-flex h-full w-full rounded-full bg-white/70 ${
            active
              ? ""
              : "animate-[nespresso-pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite]"
          }`}
          style={{ animationDelay: `${delayMs}ms` }}
        />
        {/* Solid dot */}
        <span className="relative inline-flex h-2 w-2 rounded-full bg-white shadow-md ring-1 ring-black/10" />
      </span>

      {hotspot.label && active ? (
        <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/85 px-2.5 py-1 text-[11px] font-normal text-white shadow-md backdrop-blur">
          {hotspot.label}
        </span>
      ) : null}
    </button>
  );
}

function HotspotImage({
  src,
  alt,
  hotspots,
  className,
  children,
}: {
  src: string;
  alt: string;
  hotspots: Hotspot[];
  className?: string;
  children?: React.ReactNode;
}) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-stone-200 ${
        className ?? ""
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        loading="lazy"
      />
      {hotspots.map((h, i) => (
        <Hotspot
          key={i}
          hotspot={h}
          index={i}
          active={activeIdx === i}
          onClick={() => setActiveIdx(activeIdx === i ? null : i)}
        />
      ))}
      {children}
    </div>
  );
}

export default function NespressoCoffeeCorner({
  title = "Style your coffee moment",
  subtitle = "Find the accessories to match your vibe.",
  mainImage = "/images/projects/nespresso/coffee-corner/corner1.png",
  mainHotspots = DEFAULT_MAIN_HOTSPOTS,
  mainEyebrow = "Morning Ritual",
  mainCaption = "Crisp and cozy",
  secondaryImage1 = "/images/projects/nespresso/coffee-corner/corner2.png",
  secondary1Hotspots = DEFAULT_SECONDARY1_HOTSPOTS,
  secondaryImage2 = "/images/projects/nespresso/coffee-corner/corner3.png",
  secondary2Hotspots = DEFAULT_SECONDARY2_HOTSPOTS,
  recipeImage = "/images/projects/nespresso/coffee-corner/chocostrawberry.jpg",
  recipeEyebrow = "Recipe Highlight",
  recipeTitle = "White Chocolate Strawberry",
}: Props) {
  return (
    <section className="px-4 pb-2 pt-10 text-black">
      {/* Heading */}
      <header className="px-2">
        <h2 className="text-[26px] font-normal leading-tight tracking-tight">
          {title}
        </h2>
        <p className="mt-1 text-[15px] text-stone-600">{subtitle}</p>
      </header>

      {/* Main hotspot image */}
      <div className="mt-4">
        <HotspotImage
          src={mainImage}
          alt={`${mainEyebrow}: ${mainCaption}`}
          hotspots={mainHotspots}
          className="h-[343px]"
        >
          {/* Bottom gradient + label */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[140px]"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 100%)",
            }}
          />
          <div className="absolute inset-x-0 bottom-4 px-3 text-white">
            <div className="text-[12px] font-normal uppercase tracking-wider opacity-90">
              {mainEyebrow}
            </div>
            <div className="text-[22px] font-normal leading-snug">
              {mainCaption}
            </div>
          </div>
        </HotspotImage>
      </div>

      {/* Secondary row */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <HotspotImage
          src={secondaryImage1}
          alt="Coffee accessories"
          hotspots={secondary1Hotspots}
          className="h-[167px]"
        />
        <HotspotImage
          src={secondaryImage2}
          alt="Coffee accessories"
          hotspots={secondary2Hotspots}
          className="h-[167px]"
        />
      </div>

      {/* Recipe Highlight card */}
      <div className="relative mt-4 h-[191px] overflow-hidden rounded-3xl bg-stone-300">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={recipeImage}
          alt={recipeTitle}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.55) 100%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-4 flex items-end justify-between px-3 text-white">
          <div>
            <div className="text-[12px] font-normal uppercase tracking-wider opacity-90">
              {recipeEyebrow}
            </div>
            <div className="text-[22px] font-normal leading-snug">
              {recipeTitle}
            </div>
          </div>
          <button
            type="button"
            aria-label={`See ${recipeTitle}`}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-black shadow"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
