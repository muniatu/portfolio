type Props = {
  /** Path to the looping hero video. Provide both mp4 and webm if available. */
  videoMp4?: string;
  videoWebm?: string;
  /** First-frame still used as a poster while the video loads. */
  poster?: string;
  /** Overlay headline. */
  title?: string;
  /** CTA button copy. */
  ctaLabel?: string;
};

/**
 * Hero block — full-bleed rounded card with a looping muted video,
 * "Welcome Coffee Lover" headline, and a CTA button. Title + button
 * are vertically centered as a single stack.
 */
export default function NespressoHero({
  videoMp4 = "/videos/nespresso/hero.mp4",
  videoWebm,
  poster,
  title = "Welcome\nCoffee Lover",
  ctaLabel = "Shop Coffee",
}: Props) {
  return (
    <section className="relative px-4 pt-[10px]">
      <div className="relative h-[582px] w-full overflow-hidden rounded-3xl bg-stone-200">
        {/* Background video */}
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

        {/* Soft top-to-bottom gradient for legibility */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.45) 100%)",
          }}
        />

        {/* Title + CTA — vertically centered as a group */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-7 px-6 text-white">
          <h1 className="whitespace-pre-line text-center text-[42px] font-light leading-[1.05] tracking-tight">
            {title}
          </h1>

          <button
            type="button"
            className="inline-flex h-[50px] items-center gap-2 rounded-full bg-white px-6 text-[15px] font-normal text-black shadow-lg"
          >
            <span>{ctaLabel}</span>
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
