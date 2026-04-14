import ScrollReveal from "@/components/ui/ScrollReveal";

export const metadata = {
  title: "About",
  description:
    "Adrià Compte — Senior Product Designer with 12+ years of experience, currently Design Ops at Nespresso. Creative coder, entrepreneur, and educator based in Barcelona.",
  alternates: { canonical: "https://adriacompte.com/about" },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen pt-40 px-8 pb-24 bg-[var(--color-background)]">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-16 md:gap-20">
          {/* Left — Title + decorative element */}
          <div>
            <ScrollReveal>
              <h1 className="font-display text-6xl md:text-8xl tracking-tighter">
                About
              </h1>
            </ScrollReveal>
          </div>

          {/* Right — Bio */}
          <div className="space-y-6">
            <ScrollReveal
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }}
            >
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-display tracking-tight">
                Senior Product Designer with over 12 years of experience,
                currently working as a Design Ops specialist at Nespresso,
                based in Barcelona.
              </p>
            </ScrollReveal>

            <ScrollReveal
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }}
            >
              <p className="text-base text-white/60 leading-relaxed">
                My background is a bit unusual. I grew up in a household where
                I soaked in design and technology from an early age &mdash; my
                dad was a traditional graphic designer &mdash; then went on to
                study Telecommunications Engineering. That duality, and the
                love for both disciplines, shapes everything I do. I think in
                tokens and components, in systems and semantics. I build the
                architecture that lets design scale.
              </p>
            </ScrollReveal>

            <ScrollReveal
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }}
            >
              <p className="text-base text-white/60 leading-relaxed">
                Before joining Nespresso, I worked as a UX Engineer at
                Softonic and Hewlett Packard, and built countless e-commerce
                sites as a freelancer. At Softonic I truly understood what
                data-driven design and lean methodologies mean in practice
                &mdash; I thrived in an environment where any idea could be
                brought to production and tested extremely fast, combining
                both design and development in my toolkit.
              </p>
            </ScrollReveal>

            <ScrollReveal
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }}
            >
              <p className="text-base text-white/60 leading-relaxed">
                Outside of my day job, I&apos;m
                building{" "}
                <a
                  href="https://bibready.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white underline underline-offset-4 decoration-white/20 hover:decoration-white/50 transition-colors duration-300"
                >
                  bibready.com
                </a>
                , a marketplace for race bib transfers in the endurance sports
                world, and{" "}
                <a
                  href="https://ezascii.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white underline underline-offset-4 decoration-white/20 hover:decoration-white/50 transition-colors duration-300"
                >
                  ezascii.com
                </a>
                , a client-side ASCII art converter born from my love of
                creative coding, generative art, and the aesthetic charm of
                low-resolution graphics. Beyond the craft, what excites me
                most about these projects is the business side &mdash;
                watching an idea evolve from a rough concept into something
                people actually use and pay for. I love the full arc: the
                problem, the product, the market.
              </p>
            </ScrollReveal>

            <ScrollReveal
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }}
            >
              <p className="text-base text-white/60 leading-relaxed">
                I&apos;ve been teaching at different schools for the past five
                years. Teaching keeps me grounded and constantly in the loop.
                If I can&apos;t explain it to a student, I probably don&apos;t
                understand it well enough.
              </p>
            </ScrollReveal>

            <ScrollReveal
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }}
            >
              <p className="text-base text-white/60 leading-relaxed">
                My interests orbit around typography, editorial design,
                creative coding (Three.js, WebGL, Canvas), and photography. I
                love sports, traveling, and video games.
              </p>
            </ScrollReveal>

            <ScrollReveal
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }}
            >
              <p className="text-base text-white/80 leading-relaxed font-display italic tracking-tight">
                I&apos;m happiest when I&apos;m working at the intersection of
                design and engineering &mdash; where the craft of making
                things look right meets the craft of making things work.
              </p>
            </ScrollReveal>

            <ScrollReveal
              from={{ opacity: 0 }}
              to={{ opacity: 1, duration: 0.8, ease: "power3.out" }}
            >
              <div className="pt-8 border-t border-white/10">
                <p className="text-sm text-white/30 uppercase tracking-[0.15em]">
                  Get in touch
                </p>
                <a
                  href="mailto:compteadria@gmail.com"
                  className="text-lg text-white/60 hover:text-white transition-colors duration-300 mt-2 inline-block"
                >
                  compteadria@gmail.com
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </main>
  );
}
