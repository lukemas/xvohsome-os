"use client";

import { Window } from "@/components/ui/Window";
import { getWindowTitle } from "@/lib/app-registry";
import { useWindowStore, type WindowType } from "@/lib/window-store";
import { AboutWindow } from "@/components/windows/AboutWindow";
import { BeatStore } from "@/components/windows/BeatStore";
import { FilesWindow } from "@/components/windows/FilesWindow";
import { MusicPlayer } from "@/components/windows/MusicPlayer";

function renderWindowContent(type: WindowType) {
  switch (type) {
    case "music":
      return <MusicPlayer />;
    case "about":
      return <AboutWindow />;
    case "beats":
      return <BeatStore />;
    case "files":
      return <FilesWindow />;
    default:
      return null;
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
          title={getWindowTitle(w.type)}
          initialPosition={w.position}
          onClose={() => closeWindow(w.id)}
          onPositionCommit={(pos) => updateWindowPosition(w.id, pos)}
        >
          {renderWindowContent(w.type)}
        </Window>
      ))}
    </>
  );
}
