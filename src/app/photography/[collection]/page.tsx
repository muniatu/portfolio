import { notFound } from "next/navigation";
import Image from "next/image";
import { getAllCollections, getCollectionBySlug } from "@/lib/photography";

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
    <main className="min-h-screen pt-28 px-8 pb-16">
      <h1 className="text-5xl font-bold mb-4">{collection.title}</h1>
      <p className="text-white/60 mb-12">{collection.description}</p>

      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
        {collection.photos.map((photo, i) => (
          <div key={`${photo.src}-${i}`} className="mb-4 break-inside-avoid">
            <Image
              src={photo.src}
              alt={photo.alt}
              width={800}
              height={600}
              className="w-full rounded-lg"
            />
          </div>
        ))}
      </div>
    </main>
  );
}
