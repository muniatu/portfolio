import Link from "next/link";
import Image from "next/image";
import { getFeaturedProjects } from "@/lib/mdx";
import { getAllCollections } from "@/lib/photography";

export default function HomePage() {
  const featuredProjects = getFeaturedProjects();
  const collections = getAllCollections();

  return (
    <main className="min-h-screen pt-28 px-8 pb-16">
      {/* Hero */}
      <section className="mb-24">
        <h1 className="text-6xl md:text-8xl font-bold mb-6 max-w-4xl leading-tight">
          Designer &<br />
          Creative Coder
        </h1>
        <p className="text-xl text-white/60 max-w-xl">
          Product design, creative coding, and photography by Adria Compte.
        </p>
      </section>

      {/* Featured Projects */}
      <section className="mb-24">
        <h2 className="text-sm uppercase tracking-widest text-white/40 mb-8">
          Selected Work
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl">
          {featuredProjects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group block"
            >
              <div className="relative aspect-video overflow-hidden rounded-lg mb-4">
                <Image
                  src={project.cover}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="text-2xl font-bold mb-1">{project.title}</h3>
              <p className="text-white/60">{project.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Photography Preview */}
      {collections.length > 0 && (
        <section className="mb-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-sm uppercase tracking-widest text-white/40">
              Photography
            </h2>
            <Link
              href="/photography"
              className="text-sm text-white/40 hover:text-[var(--color-accent)] transition-colors"
            >
              View all
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {collections.map((collection) => (
              <Link
                key={collection.slug}
                href={`/photography/${collection.slug}`}
                className="group flex-shrink-0"
              >
                <div className="relative w-80 aspect-[3/2] overflow-hidden rounded-lg mb-2">
                  <Image
                    src={collection.cover}
                    alt={collection.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <p className="font-medium">{collection.title}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
