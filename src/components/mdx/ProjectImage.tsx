import Image from "next/image";
import path from "path";
import sharp from "sharp";

type ProjectImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export default async function ProjectImage({ src, alt, className = "my-12" }: ProjectImageProps) {
  const filePath = path.join(process.cwd(), "public", src);
  let width = 900;
  let height = 600;

  try {
    const metadata = await sharp(filePath).metadata();
    if (metadata.width && metadata.height) {
      width = metadata.width;
      height = metadata.height;
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
