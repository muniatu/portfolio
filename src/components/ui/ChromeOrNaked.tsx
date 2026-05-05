"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import SmoothScroll from "./SmoothScroll";
import HeroCanvas from "./HeroCanvas";
import Nav from "./Nav";
import Footer from "./Footer";

/**
 * "Naked" routes render without the global site chrome (no Nav, Footer,
 * HeroCanvas, or Lenis). Currently used for full-screen mobile prototype
 * pages that should look like real apps when accessed directly.
 *
 * Match by suffix because these pages live under `/projects/[slug]/...`
 * and only the trailing segments identify them.
 */
const NAKED_SUFFIXES = ["/homepage", "/coffee-plp"];

function isNaked(pathname: string) {
  return NAKED_SUFFIXES.some((suffix) => pathname.endsWith(suffix));
}

export default function ChromeOrNaked({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (isNaked(pathname)) {
    return <div className="relative">{children}</div>;
  }

  return (
    <>
      <SmoothScroll />
      <HeroCanvas />
      <Nav />
      <div className="relative">
        {children}
        <Footer />
      </div>
    </>
  );
}
