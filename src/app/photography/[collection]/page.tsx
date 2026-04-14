import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getAllCollections, getCollectionBySlug } from "@/lib/photography";
import ScrollReveal from "@/components/ui/ScrollReveal";

type Params = Promise<{ collection: string }>;

export async function generateStaticParams() {
  return getAllCollections().map((c) => ({ collection: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { collection: slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) return {};
  return {
    title: collection.title,
    description: collection.description,
  };
}

export default async function CollectionPage({ params }: { params: Params }) {
  const { collection: slug } = await params;
  const collection = getCollectionBySlug(slug);

  if (!collection) {
    notFound();
  }

  return (
    <main className="min-h-screen pt-32 px-8 pb-24 bg-[var(--color-background)]">
      <ScrollReveal>
        <Link
          href="/photography"
          className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-[var(--color-accent)] transition-colors duration-300 mb-8"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M13 7H1M6 2L1 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Photography
        </Link>
      </ScrollReveal>
      <ScrollReveal>
        <h1 className="font-display text-6xl md:text-8xl tracking-tighter mb-4">
          {collection.title}
        </h1>
      </ScrollReveal>
      <ScrollReveal>
        <p className="text-white/50 text-lg mb-16 max-w-xl leading-relaxed">
          {collection.description}
        </p>
      </ScrollReveal>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
        {collection.photos.map((photo, i) => (
          <div
            key={`${photo.src}-${i}`}
            className="mb-4 break-inside-avoid group"
          >
            <div className="overflow-hidden rounded-lg transition-shadow duration-500 group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
              <Image
                src={photo.src}
                alt={photo.alt}
                width={800}
                height={600}
                className="w-full transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03]"
              />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
