"use client";

const HELP = ["Contact us", "Order history", "Recycle", "Stores"];
const LEGAL = ["Privacy", "Terms", "Cookies"];

function FooterColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="text-[11px] font-normal uppercase tracking-[0.12em] text-stone-500">
        {title}
      </div>
      <ul className="mt-3 space-y-2.5">
        {items.map((item) => (
          <li key={item}>
            <button
              type="button"
              className="text-left text-[15px] font-normal text-black"
            >
              {item}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialButton({ label, path }: { label: string; path: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-300 text-stone-700"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d={path} />
      </svg>
    </button>
  );
}

export default function NespressoFooter() {
  return (
    <footer className="mt-4 bg-stone-100 px-6 pb-10 pt-10 text-stone-700">
      {/* Newsletter */}
      <div>
        <div className="text-[11px] font-normal uppercase tracking-[0.12em] text-stone-500">
          Stay in the loop
        </div>
        <div className="mt-2 text-[20px] font-light leading-snug text-black">
          Sign up for news, exclusives and more.
        </div>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="mt-4 flex h-12 items-center rounded-full bg-white pl-5 pr-1.5"
        >
          <input
            type="email"
            placeholder="Email address"
            className="min-w-0 flex-1 bg-transparent text-[14px] font-normal text-black placeholder:text-stone-400 focus:outline-none"
          />
          <button
            type="submit"
            aria-label="Subscribe"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-black text-white"
          >
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
        </form>
      </div>

      {/* Link columns */}
      <div className="mt-9">
        <FooterColumn title="Help" items={HELP} />
      </div>

      {/* Social row */}
      <div className="mt-9 flex items-center gap-3">
        {/* Instagram */}
        <SocialButton
          label="Instagram"
          path="M16 11.4a4 4 0 1 1-4.5-3.9 4 4 0 0 1 4.5 3.9ZM3 8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8Zm14.5-1.5h0"
        />
        {/* Facebook */}
        <SocialButton
          label="Facebook"
          path="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2Z"
        />
        {/* X */}
        <SocialButton
          label="X"
          path="M18 6 6 18 M6 6l12 12"
        />
      </div>

      {/* Legal */}
      <div className="mt-9 flex flex-wrap gap-x-4 gap-y-2 text-[12px] font-normal text-stone-500">
        {LEGAL.map((item) => (
          <button key={item} type="button">
            {item}
          </button>
        ))}
      </div>

      <div className="mt-6 text-[11px] font-normal text-stone-400">
        © {new Date().getFullYear()} Nespresso
      </div>
    </footer>
  );
}
