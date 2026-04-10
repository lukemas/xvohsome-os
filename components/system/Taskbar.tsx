"use client";

import { useWindowStore } from "@/lib/window-store";

export function Taskbar() {
  const windows = useWindowStore((s) => s.windows);

  return (
    <footer className="relative z-20 flex h-9 shrink-0 items-center border-t-2 border-white bg-win-surface px-1 shadow-[inset_0_1px_0_#dfdfdf]">
      <div className="flex h-7 min-w-[72px] items-center border border-win-borderLight bg-win-surface px-2 text-xs font-bold text-black shadow-win98out">
        Start
      </div>
      <div className="ml-2 flex flex-1 items-center gap-1 overflow-x-auto">
        {windows.map((w) => (
          <span
            key={w.id}
            className="max-w-[140px] truncate border border-win-borderLight bg-win-surface px-2 py-0.5 text-[11px] text-black shadow-win98in"
            title={w.type}
          >
            {w.type === "music-player" ? "Music Player" : w.type}
          </span>
        ))}
      </div>
      <div className="ml-auto border border-win-borderLight bg-win-surface px-2 py-0.5 text-[11px] text-black shadow-win98in">
        Xvohsome OS
      </div>
    </footer>
  );
}
