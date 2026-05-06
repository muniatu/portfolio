"use client";

import { CSSProperties } from "react";
import Link from "next/link";
import { useMenu } from "./_menu-context";

const PRIMARY: { label: string; href?: string }[] = [
  { label: "Coffee", href: "/projects/nespresso-color-filter/coffee-plp" },
  { label: "Machines" },
  { label: "Drinkware" },
  { label: "Sweetener and Bites" },
  { label: "Home & Lifestyle" },
];
const SECONDARY = ["Order History", "Recycle", "Stores", "Help"];

// Strong ease-out — punchier than the built-in CSS curve.
const EASE = "cubic-bezier(0.23, 1, 0.32, 1)";
const ENTER_MS = 320;
const EXIT_MS = 200;

/**
 * Per-item enter style. Items animate `opacity` and a small `translateY`
 * with a staggered delay on the way in; on the way out, all delays are
 * zero so the menu collapses synchronously and feels snappy.
 */
function reveal(open: boolean, delayMs: number): CSSProperties {
  return {
    opacity: open ? 1 : 0,
    transform: open ? "translateY(0)" : "translateY(8px)",
    transition: open
      ? `opacity ${ENTER_MS}ms ${EASE}, transform ${ENTER_MS}ms ${EASE}`
      : `opacity ${EXIT_MS}ms ${EASE}, transform ${EXIT_MS}ms ${EASE}`,
    transitionDelay: open ? `${delayMs}ms` : "0ms",
    willChange: "opacity, transform",
  };
}

/**
 * Full-screen menu overlay. The white pill in the nav bar blends with
 * the menu's white background, so the X / logo / Cart appear to float
 * on it. Inner content cascades in row-by-row.
 */
export default function NespressoMenu() {
  const { open, toggle } = useMenu();

  return (
    <div
      data-nespresso-menu
      aria-hidden={!open}
      className={`absolute inset-0 z-20 flex flex-col bg-white ${
        open ? "" : "pointer-events-none"
      }`}
      style={{
        opacity: open ? 1 : 0,
        transition: `opacity ${open ? ENTER_MS : EXIT_MS}ms ${EASE}`,
      }}
    >
      {/* Spacer reserves room for status bar (60) + nav pill area (~76) */}
      <div className="h-[136px] shrink-0" />

      {/* Scrollable menu body */}
      <div data-lenis-prevent className="flex flex-1 flex-col overflow-y-auto px-6 pb-8">
        {/* Search */}
        <div
          className="flex h-12 items-center justify-between rounded-full border border-stone-200 bg-white px-5 text-[15px] text-stone-500"
          style={reveal(open, 60)}
        >
          <span>Search</span>
          <svg
            width="20"
            height="20"
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
        </div>

        {/* Primary categories */}
        <ul className="mt-7 space-y-4 px-1">
          {PRIMARY.map((c, i) => (
            <li key={c.label} style={reveal(open, 110 + i * 40)}>
              {c.href ? (
                <Link
                  href={c.href}
                  onClick={() => toggle()}
                  className="block text-left text-[28px] font-normal leading-tight text-black"
                >
                  {c.label}
                </Link>
              ) : (
                <button
                  type="button"
                  className="text-left text-[28px] font-normal leading-tight text-black"
                >
                  {c.label}
                </button>
              )}
            </li>
          ))}
        </ul>

        {/* Secondary links */}
        <ul className="mt-9 space-y-3 px-1">
          {SECONDARY.map((s, i) => (
            <li key={s} style={reveal(open, 320 + i * 30)}>
              <button
                type="button"
                className="text-left text-[16px] font-normal text-black"
              >
                {s}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex-1" />

        {/* Bottom CTA — last in the cascade */}
        <div
          className="flex flex-col items-center gap-3 pt-6"
          style={reveal(open, 460)}
        >
          <button
            type="button"
            className="flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-black text-[15px] font-normal text-white"
          >
            <span>My account</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <circle cx="12" cy="9" r="3.5" />
              <path d="M5 21a7 7 0 0 1 14 0" />
            </svg>
          </button>
          <button
            type="button"
            className="text-[13px] font-normal tracking-wide text-stone-500"
          >
            Sign me out
          </button>
        </div>
      </div>
    </div>
  );
}
