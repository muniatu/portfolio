"use client";

import { useEffect, useState } from "react";
import { useCart } from "./_cart-context";
import capsulesData from "./capsules.json";
import { trackEvent } from "@/lib/proto/events";

type Capsule = {
  id: number;
  filename: string;
  name: string;
  color: string;
  size: string;
};

const CAPSULES: Capsule[] = capsulesData;
const CAPSULES_BY_ID: Record<number, Capsule> = Object.fromEntries(
  CAPSULES.map((c) => [c.id, c])
);
const CAPSULES_PATH = "/images/projects/nespresso/capsules/";
const PRICE_PER_SLEEVE = 5.9;
const SUBSCRIPTION_DISCOUNT = 0.1; // 10%

const FREQUENCIES: Array<{ label: string; months: number }> = [
  { label: "1 month", months: 1 },
  { label: "2 months", months: 2 },
  { label: "3 months", months: 3 },
  { label: "6 months", months: 6 },
];

function TagIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 12 12 20l-9-9V3h8z" />
      <circle cx="7.5" cy="7.5" r="1.5" />
    </svg>
  );
}

function RepeatIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M17 1l4 4-4 4" />
      <path d="M3 11V9a4 4 0 0 1 4-4h14" />
      <path d="M7 23l-4-4 4-4" />
      <path d="M21 13v2a4 4 0 0 1-4 4H3" />
    </svg>
  );
}

function RecycleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M7 19l-3-5 3-5" />
      <path d="M4 14h7" />
      <path d="M11 5l3 5-3 5" />
      <path d="M14 10h7" />
      <path d="M14 19l3-5-3-5" />
    </svg>
  );
}

function XSmallIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="m9 9 6 6M15 9l-6 6" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
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

export default function NespressoCart() {
  const { cart, open, setOpen, setQty, remove, clear, totalItems } = useCart();
  const [checkedOut, setCheckedOut] = useState(false);
  const [subscribe, setSubscribe] = useState(false);
  const [frequency, setFrequency] = useState(FREQUENCIES[0]);

  // Fire once per closed → open transition so a single drawer open counts
  // once, not on every re-render while open.
  useEffect(() => {
    if (open) trackEvent("cart_opened");
  }, [open]);

  const handleCheckout = () => {
    trackEvent("checkout_reached");
    setCheckedOut(true);
  };

  const handleSubscribeClick = () => {
    trackEvent("subscription_explored");
    setSubscribe(true);
  };

  const handleClose = () => {
    setOpen(false);
    // Reset success state after the drawer animates out
    if (checkedOut) {
      setTimeout(() => {
        clear();
        setCheckedOut(false);
        setSubscribe(false);
      }, 300);
    }
  };

  const items = Object.entries(cart)
    .map(([id, count]) => {
      const capsule = CAPSULES_BY_ID[Number(id)];
      return capsule ? { capsule, count } : null;
    })
    .filter((x): x is { capsule: Capsule; count: number } => x !== null);

  const subtotal = items.reduce(
    (sum, { count }) => sum + count * PRICE_PER_SLEEVE,
    0
  );
  const discount = subscribe ? subtotal * SUBSCRIPTION_DISCOUNT : 0;
  const total = subtotal - discount;
  // Yearly savings projection: (discount per order) × (orders per year)
  const yearlySavings =
    subtotal * SUBSCRIPTION_DISCOUNT * (12 / frequency.months);

  return (
    <div
      data-lenis-prevent
      data-nespresso-menu
      aria-hidden={!open}
      className={`absolute inset-x-0 bottom-0 top-[60px] z-30 flex flex-col bg-white transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        open ? "translate-x-0" : "pointer-events-none translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 flex h-[60px] items-center justify-between bg-white/90 px-5 pt-3 backdrop-blur-md">
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close cart"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-black/10 text-black transition-transform duration-150 ease-out active:scale-95"
        >
          <CloseIcon />
        </button>
        <div className="text-[15px] font-normal text-black">
          {checkedOut ? "Order placed" : `Cart${totalItems > 0 ? ` (${totalItems})` : ""}`}
        </div>
        {!checkedOut && items.length > 0 ? (
          <button
            type="button"
            onClick={clear}
            className="text-[12px] font-normal text-stone-500 hover:underline"
          >
            Clear
          </button>
        ) : (
          <span className="w-8" aria-hidden />
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 pt-2">
        {checkedOut ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 px-8 text-center">
            <div
              aria-hidden
              className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-white"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 13l4 4 10-10" />
              </svg>
            </div>
            <div className="text-[20px] font-normal text-black">
              Thanks, your order is on its way.
            </div>
            <div className="max-w-xs text-[14px] text-stone-500">
              You&apos;ll get a confirmation email shortly.
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-8 text-center">
            <div className="text-[18px] font-normal text-black">
              Your cart is empty
            </div>
            <div className="text-[14px] text-stone-500">
              Add some capsules from the Coffee page.
            </div>
          </div>
        ) : (
          <ul className="space-y-3">
            {items.map(({ capsule, count }) => (
              <li
                key={capsule.id}
                className="flex items-center gap-3 rounded-2xl p-3"
                style={{ backgroundColor: capsule.color }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={encodeURI(`${CAPSULES_PATH}${capsule.filename}`)}
                  alt={capsule.name}
                  className="h-14 w-14 shrink-0 object-contain"
                />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[14px] font-normal text-black">
                    {capsule.name}
                  </div>
                  <div className="mt-0.5 text-[12px] tabular-nums text-black/70">
                    €{(count * PRICE_PER_SLEEVE).toFixed(2)}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    aria-label="Decrease"
                    onClick={() => setQty(capsule.id, count - 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-black transition-transform duration-150 ease-out active:scale-95"
                  >
                    <MinusIcon />
                  </button>
                  <div className="min-w-5 text-center text-[13px] tabular-nums text-black">
                    {count}
                  </div>
                  <button
                    type="button"
                    aria-label="Increase"
                    onClick={() => setQty(capsule.id, count + 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-black transition-transform duration-150 ease-out active:scale-95"
                  >
                    <PlusIcon />
                  </button>
                </div>
                <button
                  type="button"
                  aria-label={`Remove ${capsule.name}`}
                  onClick={() => remove(capsule.id)}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-black/50 transition-transform duration-150 ease-out hover:text-black active:scale-95"
                >
                  <CloseIcon />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      {checkedOut ? (
        <div className="border-t border-stone-200 bg-white px-5 pb-6 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="flex h-[52px] w-full items-center justify-center rounded-full bg-black text-[15px] font-normal text-white transition-transform duration-150 ease-out active:scale-[0.98]"
          >
            Done
          </button>
        </div>
      ) : items.length > 0 ? (
        <div className="border-t border-stone-200 bg-white px-5 pb-6 pt-4">
          {/* Subscribe-only block — value props, frequency, eco badge.
              Opens above the toggle. Grid 0fr↔1fr gives natural-height
              open/close. */}
          <div
            aria-hidden={!subscribe}
            className="grid overflow-hidden ease-[cubic-bezier(0.32,0.72,0,1)] transition-[grid-template-rows]"
            style={{
              gridTemplateRows: subscribe ? "1fr" : "0fr",
              transitionDuration: subscribe ? "320ms" : "200ms",
            }}
          >
            <div className="overflow-hidden">
              <div className="space-y-4 px-4 pb-4">
                {/* Value props */}
                <ul className="space-y-1.5 text-[12px] leading-snug text-stone-600">
                  <li className="flex items-center gap-2">
                    <TagIcon /> Save 10% on all your capsules.
                  </li>
                  <li className="flex items-center gap-2">
                    <RepeatIcon /> Auto repeat or modify your order easily.
                  </li>
                  <li className="flex items-center gap-2">
                    <RecycleIcon /> We collect and recycle your Nespresso capsules
                    when new ones arrive.
                  </li>
                  <li className="flex items-center gap-2">
                    <XSmallIcon /> Cancel anytime.
                  </li>
                </ul>

                {/* Frequency */}
                <label className="block">
                  <div className="text-[10px] font-normal uppercase tracking-wider text-stone-400">
                    Shipment every
                  </div>
                  <div className="relative mt-1 flex h-11 items-center rounded-full border border-stone-300 bg-white px-4 text-[14px] text-black">
                    <select
                      value={frequency.label}
                      onChange={(e) => {
                        const f = FREQUENCIES.find(
                          (x) => x.label === e.target.value
                        );
                        if (f) setFrequency(f);
                      }}
                      className="absolute inset-0 cursor-pointer appearance-none bg-transparent px-4 text-[14px] text-black focus:outline-none"
                    >
                      {FREQUENCIES.map((f) => (
                        <option key={f.label} value={f.label}>
                          {f.label}
                        </option>
                      ))}
                    </select>
                    <span className="pointer-events-none">
                      {frequency.label}
                    </span>
                    <span className="pointer-events-none ml-auto text-stone-500">
                      <ChevronDown />
                    </span>
                  </div>
                </label>

                {/* Eco-friendly + savings */}
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] uppercase tracking-wider text-emerald-700">
                    Eco-friendly
                  </span>
                  <span className="text-[12px] uppercase tracking-wider text-emerald-700">
                    Save €{yearlySavings.toFixed(2)} yearly
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Subtotal + Discount lines — collapse together with subscribe.
              Divider sits inside the padded zone, just above Total. */}
          <div
            aria-hidden={!subscribe}
            className="grid overflow-hidden ease-[cubic-bezier(0.32,0.72,0,1)] transition-[grid-template-rows]"
            style={{
              gridTemplateRows: subscribe ? "1fr" : "0fr",
              transitionDuration: subscribe ? "320ms" : "200ms",
            }}
          >
            <div className="overflow-hidden">
              <div className="px-4 text-[14px]">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Subtotal</span>
                    <span className="tabular-nums text-black">
                      €{subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Subscription discount</span>
                    <span className="tabular-nums text-emerald-700">
                      −€{discount.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="mt-2 h-px bg-stone-200" />
              </div>
            </div>
          </div>

          {/* Total — always visible */}
          <div className="mb-4 mt-3 flex items-center justify-between px-4 text-[16px]">
            <span className="uppercase tracking-wider text-black">Total</span>
            <span className="tabular-nums text-black">€{total.toFixed(2)}</span>
          </div>

          {/* Buy Once / Subscribe toggle — sits between Total and the CTA */}
          <div className="relative mb-3 flex h-[52px] items-center rounded-full bg-stone-100 p-1 text-[14px] font-normal">
            <span
              aria-hidden
              className="absolute inset-y-1 left-1 rounded-full border border-black bg-white transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
              style={{
                width: "calc(50% - 4px)",
                transform: subscribe ? "translateX(100%)" : "translateX(0)",
              }}
            />
            <button
              type="button"
              onClick={() => setSubscribe(false)}
              aria-pressed={!subscribe}
              className={`relative h-full flex-1 rounded-full transition-colors duration-200 ${
                !subscribe ? "text-black" : "text-stone-500"
              }`}
            >
              Buy Once
            </button>
            <button
              type="button"
              onClick={handleSubscribeClick}
              aria-pressed={subscribe}
              className={`relative flex h-full flex-1 items-center justify-center gap-1.5 rounded-full transition-colors duration-200 ${
                subscribe ? "text-black" : "text-stone-500"
              }`}
            >
              <span>Subscribe</span>
              <span className="rounded-full bg-emerald-600 px-1.5 py-px text-[11px] leading-tight text-white">
                -10%
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleCheckout}
            className="flex h-[52px] w-full items-center justify-center rounded-full bg-black text-[15px] font-normal text-white transition-transform duration-150 ease-out active:scale-[0.98]"
          >
            Finish your purchase
          </button>
        </div>
      ) : null}
    </div>
  );
}
