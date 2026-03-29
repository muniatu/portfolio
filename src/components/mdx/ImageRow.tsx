import Image from "next/image";

type ImageRowProps = {
  images: string;
  height?: number;
};

export default function ImageRow({ images, height = 500 }: ImageRowProps) {
  const parsed: { src: string; alt: string }[] = JSON.parse(images);

  return (
    <div className="my-12 flex gap-4 overflow-x-auto pb-4 -mx-8 px-8">
      {parsed.map((img) => (
        <div key={img.src} className="flex-shrink-0">
          <Image
            src={img.src}
            alt={img.alt}
            width={Math.round(height * 0.56)}
            height={height}
            className="rounded-lg"
            style={{ height: `${height}px`, width: "auto" }}
          />
        </div>
      ))}
    </div>
  );
}
