"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  getAllCollections,
  getAllPhotos,
  getAllTags,
  getPhotosByTag,
} from "@/lib/photography";

export default function PhotographyPage() {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const collections = getAllCollections();
  const tags = getAllTags();
  const photos = activeTag ? getPhotosByTag(activeTag) : getAllPhotos();

  return (
    <main className="min-h-screen pt-28 px-8 pb-16">
      <h1 className="text-5xl font-bold mb-8">Photography</h1>

      {/* Collections */}
      <section className="mb-16">
        <h2 className="text-sm uppercase tracking-widest text-white/40 mb-6">
          Collections
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {collections.map((collection) => (
            <Link
              key={collection.slug}
              href={`/photography/${collection.slug}`}
              className="group flex-shrink-0"
            >
              <div className="relative w-64 aspect-[3/2] overflow-hidden rounded-lg mb-2">
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

      {/* Tag filter */}
      <section className="mb-8">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveTag(null)}
            className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
              activeTag === null
                ? "bg-white text-black"
                : "bg-white/10 hover:bg-white/20"
            }`}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                activeTag === tag
                  ? "bg-white text-black"
                  : "bg-white/10 hover:bg-white/20"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* Photo grid */}
      <section className="columns-1 sm:columns-2 lg:columns-3 gap-4">
        {photos.map((photo, i) => (
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
      </section>
    </main>
  );
}
