import Image from "next/image";
import path from "path";
import sharp from "sharp";

type ImageRowProps = {
  images: string;
  className?: string;
};

async function getDimensions(src: string) {
  try {
    const filePath = path.join(process.cwd(), "public", src);
    const metadata = await sharp(filePath).metadata();
    if (metadata.width && metadata.height) {
      return { width: metadata.width, height: metadata.height };
    }
  } catch {
    // fallback
  }
  return { width: 400, height: 300 };
}

export default async function ImageRow({ images, className = "my-12" }: ImageRowProps) {
  const parsed: { src: string; alt: string }[] = JSON.parse(images);
  const dimensions = await Promise.all(parsed.map((img) => getDimensions(img.src)));

  return (
    <div className={`grid gap-4 ${className}`} style={{ gridTemplateColumns: `repeat(${parsed.length}, 1fr)` }}>
      {parsed.map((img, i) => {
        const { width, height } = dimensions[i];
        return (
          <Image
            key={img.src}
            src={img.src}
            alt={img.alt}
            width={width}
            height={height}
            className="rounded-lg w-full h-auto !my-0"
          />
        );
      })}
    </div>
  );
}
