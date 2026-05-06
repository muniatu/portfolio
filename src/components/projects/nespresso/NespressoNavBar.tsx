"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useMenu } from "./_menu-context";
import { useCart } from "./_cart-context";

/**
 * Top navigation: burger (left), Nespresso logo (center), "Cart" (right).
 * Sticky at the top — sits just below the status bar when embedded in
 * the phone mockup, or flush at the top in standalone view (no status bar).
 */
export default function NespressoNavBar() {
  const { open, toggle } = useMenu();
  const { totalItems, setOpen: setCartOpen } = useCart();
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
      {/* Floating pill — visible on any background.
          Three equal columns so the logo always lands at the row's
          true centre regardless of how wide the Cart label gets. */}
      <div className="grid h-12 grid-cols-3 items-center rounded-full bg-white px-4">
        {/* Burger — left column, content aligned to start */}
        <button
          type="button"
          onClick={toggle}
          aria-label={open ? "Close menu" : "Open menu"}
          className="flex h-7 w-7 flex-col items-center justify-center gap-[5px] justify-self-start"
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

        {/* Nespresso logo — middle column, dead-centre. Links home. */}
        <Link
          href="/projects/nespresso-color-filter/homepage"
          aria-label="Nespresso home"
          className="justify-self-center"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/projects/nespresso/logo-nespresso.svg"
            alt="Nespresso"
            width={24}
            height={24}
            draggable={false}
            className="select-none"
          />
        </Link>

        {/* Cart label + count — right column, content aligned to end */}
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          aria-label={`Open cart${totalItems > 0 ? `, ${totalItems} items` : ""}`}
          className="flex items-center gap-1 justify-self-end text-[15px] font-normal tracking-wide text-black"
        >
          <span>Cart</span>
          <span
            aria-hidden={totalItems === 0}
            className={`grid overflow-hidden transition-[grid-template-columns] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] ${
              totalItems > 0 ? "grid-cols-[1fr]" : "grid-cols-[0fr]"
            }`}
          >
            <span className="overflow-hidden">
              <span
                className={`block min-w-[20px] rounded-full bg-black px-1.5 text-center text-[11px] font-normal tabular-nums leading-[20px] text-white transition-opacity duration-200 ${
                  totalItems > 0 ? "opacity-100" : "opacity-0"
                }`}
              >
                {totalItems}
              </span>
            </span>
          </span>
        </button>
      </div>
    </div>
  );
}
