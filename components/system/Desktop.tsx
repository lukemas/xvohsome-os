"use client";

import { DesktopIcon } from "@/components/ui/DesktopIcon";
import { DESKTOP_APPS } from "@/lib/app-registry";
import { SpotifyDesktopWidget } from "@/components/system/SpotifyDesktopWidget";
import { Taskbar } from "@/components/system/Taskbar";
import { WindowManager } from "@/components/system/WindowManager";
import { useWindowStore } from "@/lib/window-store";

export function Desktop() {
  const openWindow = useWindowStore((s) => s.openWindow);

  return (
    <div className="desktop-bitmap-bg relative flex h-screen min-h-0 w-screen flex-col font-retro text-black">
      <main className="relative min-h-0 flex-1 overflow-hidden">
        <div className="pointer-events-none absolute left-4 top-4 select-none">
          <p className="text-xs font-bold tracking-wide text-[#d4c8e8]">
            Xvohsome
          </p>
          <p className="text-[10px] text-[#8a7a9e]">Retro desktop</p>
        </div>

        <div className="absolute left-6 top-20 flex flex-col gap-3">
          {DESKTOP_APPS.map((app) => (
            <DesktopIcon
              key={app.type}
              label={app.label}
              icon={app.icon}
              onOpen={() => openWindow(app.type)}
            />
          ))}
        </div>

        <WindowManager />
        <SpotifyDesktopWidget />
      </main>
      <Taskbar />
    </div>
  );
}
