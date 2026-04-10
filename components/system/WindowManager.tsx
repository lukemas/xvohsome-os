"use client";

import { Window } from "@/components/ui/Window";
import { MusicPlayer } from "@/components/windows/MusicPlayer";
import { useWindowStore } from "@/lib/window-store";

function windowTitle(type: string): string {
  switch (type) {
    case "music-player":
      return "Music Player — Xvohsome";
    default:
      return "Window";
  }
}

export function WindowManager() {
  const windows = useWindowStore((s) => s.windows);
  const closeWindow = useWindowStore((s) => s.closeWindow);
  const updateWindowPosition = useWindowStore((s) => s.updateWindowPosition);

  return (
    <>
      {windows.map((w) => (
        <Window
          key={w.id}
          title={windowTitle(w.type)}
          initialPosition={w.position}
          onClose={() => closeWindow(w.id)}
          onPositionCommit={(pos) => updateWindowPosition(w.id, pos)}
        >
          {w.type === "music-player" ? <MusicPlayer /> : null}
        </Window>
      ))}
    </>
  );
}
