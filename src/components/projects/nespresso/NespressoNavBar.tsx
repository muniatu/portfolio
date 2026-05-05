"use client";

import { useEffect, useState } from "react";
import { useMenu } from "./_menu-context";

/**
 * Top navigation: burger (left), Nespresso logo (center), "Cart" (right).
 * Sticky at the top — sits just below the status bar when embedded in
 * the phone mockup, or flush at the top in standalone view (no status bar).
 */
export default function NespressoNavBar() {
  const { open, toggle } = useMenu();
  const [embedded, setEmbedded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setEmbedded(window.self !== window.top);
    }
  }, []);

  return (
    <div
      className={`sticky z-30 pb-4 pt-3 transition-[padding] duration-300 ${
        embedded ? "top-[60px]" : "top-0"
      } ${open ? "px-2" : "px-6"}`}
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
