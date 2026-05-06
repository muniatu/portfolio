import { ReactNode } from "react";

/**
 * Visually nested sub-section, used for hypotheses inside a parent
 * "experiment" heading. Renders an eyebrow label, a smaller display
 * heading, and the body, with a left rail to signal subordination.
 */
export default function Hypothesis({
  number,
  title,
  claim,
  children,
}: {
  number: string;
  title: string;
  claim?: string;
  children: ReactNode;
}) {
  return (
    <div className="not-prose mx-auto my-7 max-w-3xl border-l border-white/15 pl-5">
      <div className="text-[11px] font-normal uppercase tracking-[0.12em] text-white/40">
        Hypothesis {number}
      </div>
      <h3 className="font-display mt-1 text-[24px] leading-tight tracking-tight text-white">
        {title}
      </h3>
      {claim ? (
        <p className="font-display my-6 text-[19px] italic leading-snug text-white">
          &ldquo;{claim}&rdquo;
        </p>
      ) : null}
      <div className="text-[16px] leading-relaxed text-white/85 [&_p]:m-0">
        {children}
      </div>
    </div>
  );
}
