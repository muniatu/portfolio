import { Children, ReactNode } from "react";

/**
 * Numbered implications/outcomes block for case studies. Renders inside
 * a prose context but opts out of prose so we control spacing and tone.
 */
export function KeyPoints({ children }: { children: ReactNode }) {
  const items = Children.toArray(children);
  return (
    <ol className="not-prose mx-auto my-10 max-w-3xl space-y-6">
      {items.map((child, i) => (
        <li key={i} className="flex gap-5">
          <span className="mt-[3px] shrink-0 text-[13px] font-normal tabular-nums text-white/30">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="flex-1">{child}</div>
        </li>
      ))}
    </ol>
  );
}

export function KeyPoint({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <>
      <div className="text-[17px] font-normal leading-snug text-white">
        {title}
      </div>
      <div className="mt-1 text-[15px] leading-relaxed text-white/60">
        {children}
      </div>
    </>
  );
}
