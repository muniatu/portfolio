/**
 * Mock iPhone status bar — time, signal, wifi, battery.
 * Pure SVG/CSS, no assets required.
 * Sits at the very top of the phone frame and is sticky on scroll.
 */
export default function NespressoStatusBar() {
  return (
    <div className="sticky top-0 z-40 flex h-[60px] items-center justify-between bg-white/85 px-9 pt-5 text-[15px] font-normal text-black backdrop-blur-md">
      <span className="tabular-nums">9:41</span>

      <div className="flex items-center gap-1.5">
        {/* Cellular signal */}
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor" aria-hidden>
          <rect x="0" y="7" width="3" height="4" rx="0.5" />
          <rect x="4.5" y="5" width="3" height="6" rx="0.5" />
          <rect x="9" y="2.5" width="3" height="8.5" rx="0.5" />
          <rect x="13.5" y="0" width="3" height="11" rx="0.5" />
        </svg>

        {/* Wifi */}
        <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor" aria-hidden>
          <path d="M8 10.5a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6Zm-3.3-3.3a4.7 4.7 0 0 1 6.6 0l-1 1a3.3 3.3 0 0 0-4.6 0l-1-1Zm-2.4-2.4a8.1 8.1 0 0 1 11.4 0l-1 1a6.7 6.7 0 0 0-9.4 0l-1-1Z" />
        </svg>

        {/* Battery */}
        <div className="relative ml-0.5 flex h-[11px] w-[24px] items-center rounded-[3px] border border-black/40 px-[1.5px]">
          <div className="h-[6.5px] w-[16px] rounded-[1.5px] bg-black" />
          <div className="absolute -right-[2.5px] top-1/2 h-[4px] w-[1.5px] -translate-y-1/2 rounded-r-sm bg-black/40" />
        </div>
      </div>
    </div>
  );
}
