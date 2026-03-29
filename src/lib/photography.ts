import collectionsData from "@/content/photography/collections.json";

export type Photo = {
  src: string;
  alt: string;
  tags: string[];
  exif?: {
    camera?: string;
    lens?: string;
    aperture?: string;
    shutter?: string;
    iso?: string;
  };
};

export type Collection = {
  slug: string;
  title: string;
  description: string;
  cover: string;
  photos: Photo[];
};

export function getAllCollections(): Collection[] {
  return collectionsData.collections as Collection[];
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  return getAllCollections().find((c) => c.slug === slug);
}

export function getAllPhotos(): Photo[] {
  return getAllCollections().flatMap((c) => c.photos);
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  getAllPhotos().forEach((p) => p.tags.forEach((t) => tags.add(t)));
  return Array.from(tags).sort();
}

export function getPhotosByTag(tag: string): Photo[] {
  return getAllPhotos().filter((p) => p.tags.includes(tag));
}
