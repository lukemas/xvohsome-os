"use client";

const BEATS = [
  { id: "1", name: "evo99 — Night Drive", price: "$24" },
  { id: "2", name: "dust.bin — Lo-fi kit", price: "$18" },
  { id: "3", name: "chrome.wave — Synth pack", price: "$32" },
];

export function BeatStore() {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs text-[#404040]">
        Demo storefront — no checkout wired yet.
      </p>
      <ul className="flex flex-col gap-2">
        {BEATS.map((b) => (
          <li
            key={b.id}
            className="flex items-center justify-between gap-2 border border-win-borderDark bg-[#dfdfdf] px-2 py-1.5 text-xs shadow-win98in"
          >
            <span className="min-w-0 flex-1 truncate font-bold">{b.name}</span>
            <div className="flex shrink-0 items-center gap-2">
              <span className="text-[11px] text-[#404040]">{b.price}</span>
              <button
                type="button"
                className="border border-win-borderLight bg-win-surface px-2 py-0.5 text-[11px] font-bold shadow-win98out hover:bg-[#efefef] active:shadow-win98in"
              >
                Buy
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
