"use client";

import { useState } from "react";
import { useRouter } from "./_router-context";
import NespressoStatusBar from "./NespressoStatusBar";
import NespressoNavBar from "./NespressoNavBar";
import NespressoFooter from "./NespressoFooter";

type Product = {
  id: string;
  name: string;
  intensity: number;
  price: number; // EUR per sleeve
  capsules: number;
  bg: string; // card background tint
};

// Hardcoded sample list — colours nod to Nespresso's pastel grid.
const PRODUCTS: Product[] = [
  { id: "diavolitto", name: "Diavolitto", intensity: 11, price: 7.7, capsules: 10, bg: "#F4ECE3" },
  { id: "alapie",     name: "Alapie Power", intensity: 9,  price: 5.9, capsules: 10, bg: "#FCE7DD" },
  { id: "whisky",     name: "Whisky Essence", intensity: 8, price: 5.9, capsules: 10, bg: "#F1E4D5" },
  { id: "forest",     name: "Forest Fruit", intensity: 6, price: 5.9, capsules: 10, bg: "#F2E9DD" },
  { id: "ginseng",    name: "Ginseng Delight", intensity: 7, price: 5.9, capsules: 10, bg: "#EFE4D2" },
  { id: "strawberry", name: "Strawberry White Chocolate", intensity: 5, price: 5.9, capsules: 10, bg: "#FAE2DA" },
  { id: "decaso",     name: "Decaso", intensity: 6, price: 5.9, capsules: 10, bg: "#F3EBDC" },
  { id: "calorima",   name: "Calorima", intensity: 8, price: 5.9, capsules: 10, bg: "#FBEED2" },
  { id: "almasta",    name: "Almasta", intensity: 7, price: 5.9, capsules: 10, bg: "#F8E7D9" },
  { id: "alcalia",    name: "Alcalia decaffeinato", intensity: 5, price: 5.9, capsules: 10, bg: "#F4E6CF" },
  { id: "diavolore",  name: "Diavolore", intensity: 12, price: 5.9, capsules: 10, bg: "#EFE3D0" },
  { id: "cuba",       name: "Café de Cuba", intensity: 9, price: 5.9, capsules: 10, bg: "#FBEFE0" },
  { id: "rastine",    name: "Rastine reforzegada", intensity: 10, price: 5.9, capsules: 10, bg: "#F0E5D5" },
  { id: "blue",       name: "Blue Bestio", intensity: 7, price: 5.9, capsules: 10, bg: "#E5EEF1" },
  { id: "rica",       name: "Costa Rica", intensity: 8, price: 5.9, capsules: 10, bg: "#F2E8D7" },
  { id: "kona",       name: "Hawaii Kona", intensity: 6, price: 5.9, capsules: 10, bg: "#F7EBD3" },
  { id: "diluso",     name: "Diluso", intensity: 7, price: 5.9, capsules: 10, bg: "#EFE7D5" },
  { id: "pep",        name: "Peppermint", intensity: 5, price: 5.9, capsules: 10, bg: "#E8F0E0" },
];

const FILTERS = ["Vertuo", "Collection", "Cup size", "Intensity"];

function CapsuleIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 4h10l-1.5 16h-7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <path d="M5 12h14" />
    </svg>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [count, setCount] = useState(0);
  const inCart = count > 0;

  return (
    <div
      className="relative flex h-[194px] flex-col justify-between overflow-hidden rounded-2xl p-3"
      style={{ backgroundColor: product.bg }}
    >
      <div className="text-[14px] font-normal leading-tight text-black">
        {product.name}
      </div>

      {inCart ? (
        <div className="flex items-center justify-between">
          <button
            type="button"
            aria-label="Decrease"
            onClick={() => setCount((c) => Math.max(0, c - 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/10 text-black"
          >
            <MinusIcon />
          </button>
          <div className="text-[12px] text-black">
            {count} sleeve{count > 1 ? "s" : ""}
          </div>
          <button
            type="button"
            aria-label="Increase"
            onClick={() => setCount((c) => c + 1)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/10 text-black"
          >
            <PlusIcon />
          </button>
        </div>
      ) : (
        <div className="flex items-end justify-between">
          <div className="text-[11px] leading-snug text-black/70">
            <div>Intensity: {product.intensity}/13</div>
            <div className="mt-0.5 flex items-center gap-1">
              €{product.price.toFixed(2)}
              <span className="opacity-60">({product.capsules}</span>
              <CapsuleIcon />
              <span className="opacity-60">)</span>
            </div>
          </div>
          <button
            type="button"
            aria-label={`Add ${product.name}`}
            onClick={() => setCount(1)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-black/10 text-black"
          >
            <PlusIcon />
          </button>
        </div>
      )}
    </div>
  );
}

function FilterChip({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="inline-flex h-8 shrink-0 items-center gap-1 rounded-full border border-stone-300 bg-white px-3 text-[13px] font-normal text-black"
    >
      <span>{label}</span>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  );
}

export default function NespressoCoffeePage() {
  const { navigate } = useRouter();

  return (
    <div className="bg-white">
      <NespressoStatusBar />
      <NespressoNavBar />

      {/* Header: title + back link + concierge */}
      <div className="px-4 pt-3">
        <button
          type="button"
          onClick={() => navigate("home")}
          className="mb-3 inline-flex items-center gap-1 text-[13px] font-normal text-stone-500"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back
        </button>
        <h1 className="text-[34px] font-normal leading-tight text-black">
          Coffee
        </h1>

        {/* Concierge / search */}
        <button
          type="button"
          className="mt-4 flex h-12 w-full items-center gap-3 rounded-full border border-stone-200 bg-white px-5 text-left text-[14px] text-stone-500"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          What are you looking for?
        </button>

        {/* Filter chips */}
        <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1" style={{ scrollbarWidth: "none" }}>
          {FILTERS.map((f) => (
            <FilterChip key={f} label={f} />
          ))}
        </div>
      </div>

      {/* Product grid */}
      <div className="px-4 pb-6 pt-5">
        <div className="grid grid-cols-2 gap-3">
          {PRODUCTS.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>

      <NespressoFooter />
    </div>
  );
}
