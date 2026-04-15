import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getProjectBySlug, getProjectSlugs } from "@/lib/mdx";
import { mdxComponents } from "@/components/mdx";
import ScrollReveal from "@/components/ui/ScrollReveal";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  try {
    const { frontmatter } = getProjectBySlug(slug);
    return {
      title: frontmatter.title,
      description: frontmatter.description,
      alternates: { canonical: `https://adriacompte.com/projects/${slug}` },
      openGraph: {
        title: frontmatter.title,
        description: frontmatter.description,
        type: "article",
        images: frontmatter.cover ? [{ url: frontmatter.cover }] : [],
      },
    };
  } catch {
    return {};
  }
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { slug } = await params;

  let project;
  try {
    project = getProjectBySlug(slug);
  } catch {
    notFound();
  }

  const { frontmatter, content } = project;

  return (
    <main className="min-h-screen pt-32 pb-24 bg-[var(--color-background)]">
      <article className="mx-auto max-w-5xl px-8">
        <header className="mx-auto max-w-3xl mb-16">
          <ScrollReveal>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-[var(--color-accent)] transition-colors duration-300 mb-8"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M13 7H1M6 2L1 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Projects
            </Link>
          </ScrollReveal>
          <ScrollReveal
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0, duration: 1, ease: "power3.out" }}
          >
            <h1 className="font-display text-[clamp(2.5rem,7vw,5rem)] tracking-tighter leading-[0.95] mb-6">
              {frontmatter.title}
            </h1>
          </ScrollReveal>
          <ScrollReveal
            from={{ opacity: 0, y: 30 }}
            to={{ opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }}
          >
            <p className="text-xl text-white/50 leading-relaxed mb-6">
              {frontmatter.description}
            </p>
            <div className="flex gap-2">
              {frontmatter.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-white/[0.06] text-white/40"
                >
                  {tag}
                </span>
              ))}
            </div>
          </ScrollReveal>
        </header>

        {/* Hero cover image with parallax */}
        {frontmatter.cover && (
          <ScrollReveal
            from={{ opacity: 0, y: 60, scale: 0.98 }}
            to={{ opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "power3.out" }}
            className="mb-16"
          >
            <div>
              <div className="relative overflow-hidden rounded-lg">
                <Image
                  src={frontmatter.cover}
                  alt={frontmatter.title}
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full h-auto"
                  priority
                />
              </div>
              {frontmatter.coverCaption && (
                <p className="mt-3 text-sm text-white/30 text-center"
                  dangerouslySetInnerHTML={{ __html: frontmatter.coverCaption }}
                />
              )}
            </div>
          </ScrollReveal>
        )}

        <div className="prose prose-invert prose-lg max-w-none prose-p:text-white/[0.85] prose-p:leading-relaxed prose-headings:font-display prose-headings:tracking-tight [&>p]:mx-auto [&>p]:max-w-3xl [&>h1]:mx-auto [&>h1]:max-w-3xl [&>h2]:mx-auto [&>h2]:max-w-3xl [&>h3]:mx-auto [&>h3]:max-w-3xl [&>h4]:mx-auto [&>h4]:max-w-3xl [&>ul]:mx-auto [&>ul]:max-w-3xl [&>ol]:mx-auto [&>ol]:max-w-3xl [&>blockquote]:mx-auto [&>blockquote]:max-w-3xl [&>a]:mx-auto [&>a]:max-w-3xl [&>a]:block">
          <MDXRemote source={content} components={mdxComponents} />
        </div>
      </article>
    </main>
  );
}
