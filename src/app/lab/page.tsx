import ScrollReveal from "@/components/ui/ScrollReveal";
import { getTools, type Tool, type ToolCategory } from "@/lib/tools";

export const metadata = {
  title: "Lab",
  description:
    "Small browser tools and experiments by Adrià Compte — utilities for designers, built client-side and shared freely.",
  alternates: { canonical: "https://adriacompte.com/lab" },
};

const categoryOrder: ToolCategory[] = [
  "Design tool",
  "Generative",
  "Utility",
  "Toy",
];

function groupByCategory(tools: Tool[]) {
  const groups = new Map<ToolCategory, Tool[]>();
  for (const tool of tools) {
    const list = groups.get(tool.category) ?? [];
    list.push(tool);
    groups.set(tool.category, list);
  }
  return categoryOrder
    .filter((cat) => groups.has(cat))
    .map((cat) => ({ category: cat, items: groups.get(cat)! }));
}

export default function LabPage() {
  const allTools = getTools();
  const grouped = groupByCategory(allTools);

  return (
    <main className="min-h-screen flex flex-col pt-40 px-8 pb-12 bg-[var(--color-background)]">
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-16 md:gap-20">
          <div>
            <ScrollReveal>
              <h1 className="font-display text-[clamp(3rem,8vw,6rem)] tracking-tighter leading-[0.85]">
                Lab
              </h1>
            </ScrollReveal>
          </div>

          <div className="space-y-6">
            <ScrollReveal
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }}
            >
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed font-display tracking-tight">
                A growing collection of small browser tools and experiments I
                build to scratch my own design itch.{" "}
                <span className="italic">
                  Free, client-side, no signup.
                </span>
              </p>
            </ScrollReveal>

            <ScrollReveal
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }}
            >
              <p className="text-base text-white/60 leading-relaxed">
                Some are throwaway, some I keep using daily. They live here in
                case they&apos;re useful to someone else. New things show up
                whenever I get stuck on a problem worth solving twice.
              </p>
            </ScrollReveal>

            <ScrollReveal
              from={{ opacity: 0 }}
              to={{ opacity: 1, duration: 0.8, ease: "power3.out" }}
            >
              <div className="pt-2 flex gap-2 flex-wrap">
                <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 border border-white/10 rounded-full px-3 py-1">
                  {allTools.length} {allTools.length === 1 ? "tool" : "tools"}
                </span>
                {grouped.map(({ category }) => (
                  <span
                    key={category}
                    className="text-[10px] uppercase tracking-[0.2em] text-white/30 border border-white/10 rounded-full px-3 py-1"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>

        <div className="mt-24 border-t border-white/[0.08]">
          {allTools.map((tool, i) => (
            <ScrollReveal
              key={tool.slug}
              from={{ opacity: 0, y: 30 }}
              to={{
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
                delay: i * 0.06,
              }}
            >
              <a
                href={tool.href}
                target={tool.external ? "_blank" : undefined}
                rel={tool.external ? "noopener noreferrer" : undefined}
                className="group block border-b border-white/[0.08] py-10 px-8 transition-colors duration-300 hover:bg-white/[0.02]"
              >
                <div className="flex items-center gap-3 mb-3 md:mb-4 text-[11px] uppercase tracking-[0.2em] text-white/40">
                  <span>{tool.category}</span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="font-display italic normal-case tracking-normal text-white/30">
                    {tool.year}
                  </span>
                </div>
                <h3 className="font-display text-3xl md:text-5xl lg:text-6xl tracking-tighter leading-[0.9] mb-4 group-hover:text-[var(--color-accent)] transition-colors duration-300">
                  {tool.name}
                  <span
                    aria-hidden
                    className="ml-3 inline-block translate-x-0 group-hover:translate-x-2 transition-transform duration-300 text-white/40 group-hover:text-[var(--color-accent)]"
                  >
                    &rarr;
                  </span>
                </h3>
                <p className="text-base md:text-lg text-white/60 leading-relaxed max-w-2xl">
                  {tool.blurb}
                </p>
              </a>
            </ScrollReveal>
          ))}
        </div>

      </div>

      <div className="max-w-6xl mx-auto w-full mt-auto pt-24">
        <div className="border-t border-white/[0.08] pt-10">
          <p className="text-sm text-white/40 max-w-xl leading-relaxed">
            Got an idea, a bug, or want to suggest a tool?{" "}
            <a
              href="mailto:compteadria@gmail.com"
              className="text-white/70 hover:text-white underline underline-offset-4 decoration-white/20 hover:decoration-white/50 transition-colors duration-300"
            >
              compteadria@gmail.com
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
