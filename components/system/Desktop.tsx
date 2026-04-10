"use client";

import { Taskbar } from "@/components/system/Taskbar";
import { WindowManager } from "@/components/system/WindowManager";
import { useWindowStore } from "@/lib/window-store";

export function Desktop() {
  const openWindow = useWindowStore((s) => s.openWindow);

  return (
    <div className="relative flex h-screen min-h-0 w-screen flex-col bg-black font-retro text-black">
      <main className="relative min-h-0 flex-1 overflow-hidden">
        <div className="pointer-events-none absolute left-4 top-4 select-none">
          <p className="text-xs font-bold tracking-wide text-[#a0a0a0]">
            Xvohsome
          </p>
          <p className="text-[10px] text-[#606060]">Retro desktop</p>
        </div>

        <div className="absolute left-6 top-24 flex flex-col items-center gap-1">
          <button
            type="button"
            onClick={() => openWindow("music-player")}
            className="group flex flex-col items-center gap-1 rounded border border-transparent p-1 text-center hover:border-[#808080] hover:bg-[#000033]/40"
          >
            <span
              className="flex h-12 w-12 items-center justify-center border border-win-borderLight bg-gradient-to-b from-[#e0e0ff] to-[#8080c0] text-2xl shadow-win98out"
              aria-hidden
            >
              ♪
            </span>
            <span className="max-w-[72px] text-[11px] leading-tight text-white drop-shadow-[0_1px_0_#000]">
              Music Player
            </span>
          </button>
        </div>

        <WindowManager />
      </main>
      <Taskbar />
    </div>
  );
}
