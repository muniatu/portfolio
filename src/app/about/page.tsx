export const metadata = {
  title: "About",
  description: "About Adria Compte - Designer, Creative Coder & Photographer",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-28 px-8 pb-16">
      <div className="max-w-2xl">
        <h1 className="text-5xl font-bold mb-8">About</h1>
        <div className="space-y-6 text-lg text-white/80 leading-relaxed">
          <p>
            Product Designer & Frontend Developer based in Barcelona. I work at
            the intersection of design and code, building digital products with a
            focus on user experience and visual craft.
          </p>
          <p>
            When I&apos;m not designing interfaces, I&apos;m exploring creative
            coding, photography, or building side projects that probably
            won&apos;t ship.
          </p>
        </div>
      </div>
    </main>
  );
}
