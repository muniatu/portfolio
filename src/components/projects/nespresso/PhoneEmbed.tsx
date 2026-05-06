/**
 * Renders the iPhone mockup PNG with an iframe overlaid on the screen
 * area. The iframe loads a real prototype route, so navigation, drag,
 * cursor, and menu state all happen inside the iframe document.
 *
 * Use from MDX:
 *   <PhoneEmbed src="/projects/nespresso-color-filter/homepage" />
 */

const FRAME_W = 448;
const FRAME_H = 916;
const BEZEL_LEFT_PCT = 5.36;
const BEZEL_RIGHT_PCT = 4.91;
const BEZEL_TOP_PCT = 2.2;
const BEZEL_BOTTOM_PCT = 2.2;
const SCREEN_RADIUS = 60;

type Props = {
  src: string;
  /** Total frame width including bezel. Defaults to 448 (matches the PNG). */
  width?: number;
  /** Iframe accessible label. */
  title?: string;
};

export default function PhoneEmbed({
  src,
  width = FRAME_W,
  title = "Mobile prototype",
}: Props) {
  return (
    <div className="not-prose my-12 flex flex-col items-center gap-5">
      <div
        className="relative inline-block"
        style={{ width: `min(100%, ${width}px)` }}
      >
        {/* Mockup PNG drives wrapper height via intrinsic aspect ratio. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/projects/nespresso/mockup/Phone.png"
          alt=""
          width={FRAME_W}
          height={FRAME_H}
          aria-hidden
          draggable={false}
          className="pointer-events-none relative z-20 block h-auto w-full select-none"
        />

        {/* Wrapper sized via insets — iframes default to 300×150 when
            given width:auto/height:auto, so we drive the size with a
            div and let the iframe fill it 100%. */}
        <div
          className="absolute z-10 overflow-hidden bg-white"
          style={{
            top: `${BEZEL_TOP_PCT}%`,
            bottom: `${BEZEL_BOTTOM_PCT}%`,
            left: `${BEZEL_LEFT_PCT}%`,
            right: `${BEZEL_RIGHT_PCT}%`,
            borderRadius: `${SCREEN_RADIUS}px`,
          }}
        >
          <iframe
            src={src}
            title={title}
            loading="lazy"
            className="block h-full w-full bg-white"
            style={{ border: "none" }}
          />
        </div>
      </div>

      <p className="font-display max-w-md text-center text-[15px] italic leading-snug text-white/55">
        This is a fully operational Next.js prototype running in your browser.
        Not a clunky Figma.
      </p>

      {/* Open the prototype standalone, full browser, in a new tab */}
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-[13px] text-white/70 transition-colors hover:border-white/40 hover:text-white"
      >
        <span>Open prototype in a new tab</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M14 5h5v5" />
          <path d="M19 5 10 14" />
          <path d="M19 13v6H5V5h6" />
        </svg>
      </a>
    </div>
  );
}
