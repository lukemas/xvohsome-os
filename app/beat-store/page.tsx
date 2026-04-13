import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Beat Store — Xvohsome",
  description: "Beats, kits, and packs from Xvohsome",
};

const BEATS = [
  {
    id: "1",
    name: "evo99 — Night Drive",
    price: "$24",
    blurb: "Dark synthwave loops · 120 BPM stems",
  },
  {
    id: "2",
    name: "dust.bin — Lo-fi kit",
    price: "$18",
    blurb: "Crunchy drums & vinyl noise layers",
  },
  {
    id: "3",
    name: "chrome.wave — Synth pack",
    price: "$32",
    blurb: "Analog-style leads & arps",
  },
] as const;

export default function BeatStorePage() {
  return (
    <main className="box-border min-h-full bg-gradient-to-b from-[#e4e0f0] via-[#dcd8e8] to-[#c8c4d8] p-4 font-retro text-black">
      <header className="mb-4 border border-win-borderDarker bg-win-surface p-3 shadow-win98out">
        <p className="text-[10px] font-bold uppercase tracking-wide text-win-title">
          Xvohsome
        </p>
        <h1 className="mt-1 text-lg font-bold leading-tight">Beat Store</h1>
        <p className="mt-2 text-[11px] leading-snug text-[#404040]">
          Demo storefront — kits and packs for producers. Checkout coming soon;
          browse here inside the desktop browser.
        </p>
      </header>

      <section aria-label="Catalog">
        <h2 className="mb-2 text-[11px] font-bold text-[#303030]">Catalog</h2>
        <ul className="flex flex-col gap-2">
          {BEATS.map((b) => (
            <li
              key={b.id}
              className="border border-win-borderDark bg-[#efefef] p-2 shadow-win98in"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold leading-tight">{b.name}</p>
                  <p className="mt-0.5 text-[10px] leading-snug text-[#505050]">
                    {b.blurb}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-[11px] font-bold text-[#202020]">
                    {b.price}
                  </span>
                  <button
                    type="button"
                    className="border border-win-borderLight bg-win-surface px-2 py-0.5 text-[11px] font-bold shadow-win98out hover:bg-[#efefef] active:shadow-win98in"
                  >
                    Buy
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <footer className="mt-4 border-t border-win-borderDark pt-3 text-[10px] text-[#606060]">
        <p>
          You are viewing the Beat Store homepage inside the Xvohsome Internet
          Browser.
        </p>
      </footer>
    </main>
  );
}
