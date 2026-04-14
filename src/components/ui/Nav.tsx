"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/projects", label: "Projects" },
  { href: "/photography", label: "Photography" },
  { href: "/about", label: "About" },
];

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 flex justify-center pt-6 px-4" aria-label="Main navigation">
      <div
        className={`flex items-center gap-4 md:gap-8 px-4 md:px-6 py-2.5 md:py-3 rounded-full border transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          scrolled
            ? "bg-white/[0.03] backdrop-blur-2xl border-white/[0.08] shadow-[0_0_40px_rgba(0,0,0,0.4)] scale-[0.97]"
            : "bg-white/[0.05] backdrop-blur-xl border-white/[0.1] shadow-[0_0_30px_rgba(0,0,0,0.3)]"
        }`}
      >
        {pathname === "/" ? (
          <h1 className="text-sm m-0 p-0">
            <Link href="/" className="font-display tracking-tight whitespace-nowrap">
              Adrià Compte
            </Link>
          </h1>
        ) : (
          <Link href="/" className="font-display text-sm tracking-tight whitespace-nowrap">
            Adrià Compte
          </Link>
        )}
        <ul className="flex gap-3 md:gap-6">
          {links.map(({ href, label }) => {
            const isActive = pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`relative text-sm transition-colors duration-300 hover:text-[var(--color-accent)] ${
                    isActive ? "text-[var(--color-accent)]" : "text-white/60"
                  }`}
                >
                  {label}
                  {isActive && (
                    <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--color-accent)]" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
