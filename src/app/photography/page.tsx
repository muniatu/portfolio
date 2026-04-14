"use client";

import Image from "next/image";
import { getAllPhotos } from "@/lib/photography";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function PhotographyPage() {
  const photos = getAllPhotos();

  return (
    <main className="min-h-screen pt-32 px-8 pb-24">
      <ScrollReveal>
        <h1 className="font-display text-[clamp(3rem,8vw,6rem)] tracking-tighter mb-20">
          Photography
        </h1>
      </ScrollReveal>

      {/* Photo grid */}
      <section className="columns-1 sm:columns-2 lg:columns-3 gap-4">
        {photos.map((photo, i) => (
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
      </section>
    </main>
  );
}
