import Image from "next/image";
import fs from "fs";
import path from "path";
import { imageSize } from "image-size";

type ProjectImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export default function ProjectImage({ src, alt, className = "my-12" }: ProjectImageProps) {
  const filePath = path.join(process.cwd(), "public", src);
  let width = 900;
  let height = 600;

  try {
    const buffer = fs.readFileSync(filePath);
    const dimensions = imageSize(new Uint8Array(buffer));
    if (dimensions.width && dimensions.height) {
      width = dimensions.width;
      height = dimensions.height;
    }
  } catch {
    // fallback to defaults if file not found
  }

  return (
    <figure className={`flex justify-center ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="max-w-full h-auto rounded-lg"
      />
    </figure>
  );
}
