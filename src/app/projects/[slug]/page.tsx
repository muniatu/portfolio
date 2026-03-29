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
      <article className="mx-auto max-w-5xl px-8">
        <header className="mx-auto max-w-3xl mb-12">
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
        <div className="prose prose-invert prose-lg max-w-none [&>p]:mx-auto [&>p]:max-w-3xl [&>h1]:mx-auto [&>h1]:max-w-3xl [&>h2]:mx-auto [&>h2]:max-w-3xl [&>h3]:mx-auto [&>h3]:max-w-3xl [&>h4]:mx-auto [&>h4]:max-w-3xl [&>ul]:mx-auto [&>ul]:max-w-3xl [&>ol]:mx-auto [&>ol]:max-w-3xl [&>blockquote]:mx-auto [&>blockquote]:max-w-3xl [&>a]:mx-auto [&>a]:max-w-3xl [&>a]:block">
          <MDXRemote source={content} components={mdxComponents} />
        </div>
      </article>
    </main>
  );
}
