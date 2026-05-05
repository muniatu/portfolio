/**
 * Layout for the standalone prototype routes.
 * Render plain — the global chrome (Nav, Footer, HeroCanvas, Lenis) is
 * already removed for these paths via ChromeOrNaked in the root layout.
 */
export default function PrototypeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      className="min-h-screen"
      style={{ fontFamily: '"Host Grotesk", system-ui, sans-serif' }}
    >
      {children}
    </main>
  );
}
