type Props = {
  videoMp4?: string;
  videoWebm?: string;
  poster?: string;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
};

/**
 * Inline video block — full-width rounded card with a looping muted video.
 * Title + subtitle pinned top-left, white CTA pill pinned bottom-left.
 */
export default function NespressoOatlyVideo({
  videoMp4 = "/videos/nespresso/oatly.mp4",
  videoWebm,
  poster,
  title = "Nespresso × Oatly",
  subtitle = "A match made in heaven",
  ctaLabel = "Shop the collection",
}: Props) {
  return (
    <section className="px-4 py-3">
      <div className="relative h-[522px] w-full overflow-hidden rounded-3xl bg-stone-200">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
        >
          {videoWebm ? <source src={videoWebm} type="video/webm" /> : null}
          <source src={videoMp4} type="video/mp4" />
        </video>

        {/* Vignette: darker at top + bottom, transparent through the middle —
            keeps the title and the CTA readable without dimming the video. */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0) 65%, rgba(0,0,0,0.5) 100%)",
          }}
        />

        {/* Title + subtitle — top-left */}
        <div className="absolute left-4 right-3 top-5 text-white">
          <div className="text-[28px] font-normal leading-tight">{title}</div>
          <div className="mt-1 text-[15px] font-normal opacity-90">
            {subtitle}
          </div>
        </div>

        {/* CTA — bottom-left */}
        <button
          type="button"
          className="absolute bottom-4 left-3 inline-flex h-[44px] items-center gap-2 rounded-full bg-white px-5 text-[14px] font-normal text-black"
        >
          <span>{ctaLabel}</span>
          <svg
            width="14"
            height="14"
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
