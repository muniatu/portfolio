"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/projects", label: "Projects" },
  { href: "/photography", label: "Photography" },
  { href: "/about", label: "About" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6">
      <Link href="/" className="text-lg font-bold tracking-tight">
        Adria Compte
      </Link>
      <ul className="flex gap-8">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className={`text-sm transition-colors hover:text-[var(--color-accent)] ${
                pathname.startsWith(href)
                  ? "text-[var(--color-accent)]"
                  : "text-white/70"
              }`}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
