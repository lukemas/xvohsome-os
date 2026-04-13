"use client";

const MERCH_ITEMS = [
  {
    id: "cd",
    label: "CDs",
    hint: "Digipak · signed option",
    icon: "💿",
    tile: "from-[#f8f8ff] to-[#b8b8e8]",
  },
  {
    id: "tape",
    label: "Cassettes",
    hint: "Chrome Type II shells",
    icon: "📼",
    tile: "from-[#f5f0e8] to-[#c8b8a0]",
  },
  {
    id: "tee",
    label: "T‑Shirts",
    hint: "Heavy cotton · S–XXL",
    icon: "👕",
    tile: "from-[#ffffff] to-[#d0d0d8]",
  },
  {
    id: "hat",
    label: "Hats",
    hint: "Snapback · embroidered",
    icon: "🧢",
    tile: "from-[#2a2a30] to-[#101018]",
  },
] as const;

export function MerchWindow() {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-[11px] leading-snug text-[#404040]">
        Xvohsome merch catalog — placeholder storefront. Hook up a real shop link
        when ready.
      </p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {MERCH_ITEMS.map((item) => (
          <div
            key={item.id}
            className="flex flex-col items-center gap-2 rounded-sm border border-win-borderDark bg-white p-3 text-center shadow-win98in"
          >
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-sm border border-win-borderLight bg-gradient-to-b ${item.tile} text-4xl shadow-win98out`}
              aria-hidden
            >
              {item.icon}
            </div>
            <div>
              <p className="text-[11px] font-bold leading-tight text-black">
                {item.label}
              </p>
              <p className="mt-0.5 text-[9px] leading-tight text-[#505050]">
                {item.hint}
              </p>
            </div>
            <button
              type="button"
              disabled
              className="mt-1 w-full border border-win-borderLight bg-win-surface py-0.5 text-[9px] font-bold text-[#808080] shadow-win98out"
              title="Coming soon"
            >
              Coming soon
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
