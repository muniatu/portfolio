import Image from "next/image";

type ImageRowProps = {
  images: string;
};

export default function ImageRow({ images }: ImageRowProps) {
  const parsed: { src: string; alt: string }[] = JSON.parse(images);

  return (
    <div className="my-12 flex gap-4 overflow-x-auto md:overflow-visible">
      {parsed.map((img) => (
        <div key={img.src} className="flex-shrink-0 md:flex-shrink md:min-w-0 md:flex-1">
          <Image
            src={img.src}
            alt={img.alt}
            width={400}
            height={700}
            className="rounded-lg w-auto h-[400px] md:w-full md:h-auto"
          />
        </div>
      ))}
    </div>
  );
}
