const socials = [
  { href: "https://www.linkedin.com/in/adria-compte-product-designer/", label: "LinkedIn" },
  { href: "https://www.instagram.com/adria_compte/", label: "Instagram" },
  { href: "https://github.com/muniatu", label: "GitHub" },
];

export default function Footer() {
  return (
    <footer className="backdrop-blur-xl bg-white/[0.05] border-t border-white/[0.1] shadow-[0_0_30px_rgba(0,0,0,0.3)] px-8 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <nav className="flex gap-6 md:flex-1" aria-label="Social links">
          {socials.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white hover:text-white/60 transition-colors duration-300"
              aria-label={`Visit ${label} profile`}
            >
              {label}
            </a>
          ))}
        </nav>
        <p className="text-sm text-white/60 md:flex-1 text-center font-display">
          Made with <span className="text-white text-base">&#9829;</span> in Barcelona
        </p>
        <p className="text-sm text-white font-display md:flex-1 text-right">
          &copy; 2026 Adrià Compte
        </p>
      </div>
    </footer>
  );
}
