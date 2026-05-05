"use client";

import { useMenu } from "./_menu-context";

/**
 * Top navigation: burger (left), Nespresso logo (center), "Cart" (right).
 * Sticky just below the status bar. The burger toggles a shared menu
 * state (provided by PrototypeShell) which the menu overlay reads.
 */
export default function NespressoNavBar() {
  const { open, toggle } = useMenu();

  return (
    <div
      className={`sticky top-[60px] z-30 pb-4 pt-3 transition-[padding] duration-300 ${
        open ? "px-2" : "px-6"
      }`}
    >
      {/* Floating pill — visible on any background */}
      <div
        className="flex h-12 items-center justify-between rounded-full bg-white px-4"
      >
        {/* Burger */}
        <button
          type="button"
          onClick={toggle}
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-7 w-7 flex-col items-center justify-center gap-[5px]"
        >
          <span
            className={`block h-[2px] w-4 bg-black transition-transform duration-300 ${
              open ? "translate-y-[3.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-[2px] w-4 bg-black transition-transform duration-300 ${
              open ? "-translate-y-[3.5px] -rotate-45" : ""
            }`}
          />
        </button>

        {/* Nespresso logo — the SVG already includes the dark badge */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/projects/nespresso/logo-nespresso.svg"
          alt="Nespresso"
          width={24}
          height={24}
          draggable={false}
          className="select-none"
        />

        {/* Cart label */}
        <button
          type="button"
          className="text-[15px] font-normal tracking-wide text-black"
        >
          Cart
        </button>
      </div>
    </div>
  );
}
