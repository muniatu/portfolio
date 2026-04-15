import Image from "next/image";
import fs from "fs";
import path from "path";
import { imageSize } from "image-size";

type ImageRowProps = {
  images: string;
  className?: string;
};

function getDimensions(src: string) {
  try {
    const filePath = path.join(process.cwd(), "public", src);
    const buffer = fs.readFileSync(filePath);
    const dimensions = imageSize(new Uint8Array(buffer));
    if (dimensions.width && dimensions.height) {
      return { width: dimensions.width, height: dimensions.height };
    }
  } catch {
    // fallback
  }
  return { width: 400, height: 300 };
}

export default function ImageRow({ images, className = "my-12" }: ImageRowProps) {
  const parsed: { src: string; alt: string }[] = JSON.parse(images);

  return (
    <div className={`grid gap-4 ${className}`} style={{ gridTemplateColumns: `repeat(${parsed.length}, 1fr)` }}>
      {parsed.map((img) => {
        const { width, height } = getDimensions(img.src);
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
