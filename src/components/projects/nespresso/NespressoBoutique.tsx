type Props = {
  image?: string;
  eyebrow?: string;
  title?: string;
};

/**
 * Short banner card with image background, side-aligned copy, and arrow CTA.
 * Matches the Figma "P_4713 KV11" tile pattern (191px tall).
 */
export default function NespressoBoutique({
  image = "/images/projects/nespresso/boutique/boutique.png",
  eyebrow = "Find a store",
  title = "Visit a Boutique",
}: Props) {
  return (
    <section className="px-4 py-3">
      <div className="relative h-[191px] w-full overflow-hidden rounded-3xl bg-stone-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.8) 100%)",
          }}
        />

        <div className="absolute bottom-4 left-3 text-white">
          <div className="text-[12px] font-normal opacity-90">
            {eyebrow}
          </div>
          <div className="text-[22px] font-normal leading-tight">{title}</div>
        </div>

        <button
          type="button"
          aria-label={`See ${title}`}
          className="absolute bottom-4 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-black"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M5 12h14" />
            <path d="m13 6 6 6-6 6" />
          </svg>
        </button>
      </div>
    </section>
  );
}
