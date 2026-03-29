import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getProjectBySlug, getProjectSlugs } from "@/lib/mdx";
import { mdxComponents } from "@/components/mdx";

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
    <main className="min-h-screen pt-28 pb-16">
      <article className="mx-auto max-w-3xl px-8">
        <header className="mb-12">
          <h1 className="text-5xl font-bold mb-4">{frontmatter.title}</h1>
          <p className="text-xl text-white/60">{frontmatter.description}</p>
          <div className="flex gap-2 mt-4">
            {frontmatter.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded-full bg-white/10"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>
        <div className="prose prose-invert prose-lg max-w-none">
          <MDXRemote source={content} components={mdxComponents} />
        </div>
      </article>
    </main>
  );
}
