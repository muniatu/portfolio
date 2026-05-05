type Props = {
  image?: string;
  eyebrow?: string;
  title?: string;
};

/**
 * Full-width tall image card with a copy + arrow CTA overlay.
 * Used for the Recycling section.
 */
export default function NespressoRecycling({
  image = "/images/projects/nespresso/recycling/recycle.png",
  eyebrow = "Eco-friendly subscriptions",
  title = "Recycle your capsules",
}: Props) {
  return (
    <section className="px-4 py-3">
      <div className="relative h-[369px] w-full overflow-hidden rounded-3xl bg-stone-200">
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
              "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.55) 100%)",
          }}
        />

        <div className="absolute inset-x-0 bottom-4 flex items-end justify-between px-3 text-white">
          <div>
            <div className="text-[12px] font-normal uppercase tracking-wider opacity-90">
              {eyebrow}
            </div>
            <div className="text-[22px] font-normal leading-tight">{title}</div>
          </div>
          <button
            type="button"
            aria-label={`See ${title}`}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/95 text-black"
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
      </div>
    </section>
  );
}
