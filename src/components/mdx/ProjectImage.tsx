import Image from "next/image";

type ProjectImageProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

export default function ProjectImage({
  src,
  alt,
  width = 900,
  height = 600,
}: ProjectImageProps) {
  return (
    <figure className="my-12 max-w-5xl">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-full rounded-lg"
      />
    </figure>
  );
}
