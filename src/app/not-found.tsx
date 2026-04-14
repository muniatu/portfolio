import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-8 bg-[var(--color-background)]">
      <h1 className="font-display text-7xl md:text-9xl tracking-tighter mb-4">
        404
      </h1>
      <p className="text-white/40 text-lg mb-8">
        This page doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="text-sm text-white/60 hover:text-white transition-colors duration-300 flex items-center gap-2"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M13 7H1M6 2L1 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back home
      </Link>
    </main>
  );
}
