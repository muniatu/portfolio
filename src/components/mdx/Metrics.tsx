import { ReactNode } from "react";

/**
 * Grid of metric callouts for "results / measuring success" sections.
 * Auto-collapses to a single column on mobile.
 */
export function Metrics({ children }: { children: ReactNode }) {
  return (
    <div className="not-prose mx-auto my-7 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
      {children}
    </div>
  );
}

export function Metric({
  value,
  delta,
  label,
}: {
  value: string;
  delta?: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      <div className="flex items-baseline gap-2">
        <span className="font-display text-[36px] leading-none tracking-tight text-white">
          {value}
        </span>
        {delta ? (
          <span className="text-[12px] font-normal tabular-nums text-emerald-400">
            {delta}
          </span>
        ) : null}
      </div>
      <div className="mt-2 text-[13px] leading-snug text-white/60">{label}</div>
    </div>
  );
}
