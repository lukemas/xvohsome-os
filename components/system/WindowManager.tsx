"use client";

import { Window } from "@/components/ui/Window";
import { getWindowTitle } from "@/lib/app-registry";
import { useWindowStore, type WindowType } from "@/lib/window-store";
import { AboutWindow } from "@/components/windows/AboutWindow";
import { FilesWindow } from "@/components/windows/FilesWindow";
import { MusicPlayer } from "@/components/windows/MusicPlayer";
import { MyMusicFolder } from "@/components/windows/MyMusicFolder";
import { MerchWindow } from "@/components/windows/MerchWindow";
import { BrowserWindow } from "@/components/windows/BrowserWindow";

function renderWindowContent(type: WindowType) {
  switch (type) {
    case "music":
      return <MusicPlayer />;
    case "my-music":
      return <MyMusicFolder />;
    case "browser":
      return <BrowserWindow />;
    case "about":
      return <AboutWindow />;
    case "beats":
      return (
        <BrowserWindow
          initialSrc="/beat-store"
          homeUrl="/beat-store"
          footerNote="Beat Store homepage. Many external sites block embedding; same-origin pages like this one work best. Use the address bar to browse elsewhere."
        />
      );
    case "files":
      return <FilesWindow />;
    case "merch":
      return <MerchWindow />;
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
          className={
            w.type === "my-music"
              ? "w-[min(92vw,680px)] min-w-[560px] max-w-[720px]"
              :             w.type === "browser" || w.type === "beats"
                ? "w-[min(96vw,920px)] min-w-[360px] max-w-[960px]"
                : undefined
          }
          contentClassName={
            w.type === "my-music"
              ? "!min-h-[520px] !bg-white !p-0"
              : w.type === "browser" || w.type === "beats"
                ? "!flex !h-[min(72vh,560px)] !min-h-[400px] !flex-col !bg-[#c0c0c0] !p-0"
                : undefined
          }
        >
          {renderWindowContent(w.type)}
        </Window>
      ))}
    </>
  );
}
