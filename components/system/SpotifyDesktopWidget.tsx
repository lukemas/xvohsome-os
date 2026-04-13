"use client";

import { getSpotifyEmbedSrc } from "@/lib/spotify-config";
import { useMemo, useState } from "react";

function embedUrlWithTheme(src: string): string {
  try {
    const u = new URL(src);
    if (!u.searchParams.has("theme")) {
      u.searchParams.set("theme", "0");
    }
    return u.toString();
  } catch {
    return src;
  }
}

export function SpotifyDesktopWidget() {
  const [minimized, setMinimized] = useState(false);
  const rawSrc = useMemo(() => getSpotifyEmbedSrc(), []);
  const src = embedUrlWithTheme(rawSrc);

  return (
    <div
      className={`pointer-events-auto absolute right-3 z-[25] w-[min(calc(100vw-1.5rem),380px)] select-none ${
        minimized
          ? "bottom-10"
          : "bottom-10 top-20 flex flex-col"
      }`}
      role="region"
      aria-label="Spotify player"
    >
      <div
        className={`flex flex-col overflow-hidden border border-win-borderDarker bg-win-surface shadow-win98out ${
          minimized ? "" : "min-h-0 flex-1"
        }`}
      >
        <div className="flex shrink-0 cursor-default items-center justify-between border-b border-black bg-win-title px-1 py-0.5">
          <span className="truncate pl-1 text-[11px] font-bold text-white">
            Spotify · Xvohsome
          </span>
          <button
            type="button"
            onClick={() => setMinimized((m) => !m)}
            className="shrink-0 border border-win-borderLight bg-win-surface px-1.5 py-0 text-[10px] font-bold text-black shadow-win98out hover:bg-[#dfdfdf] active:shadow-win98in"
            title={minimized ? "Expand" : "Minimize"}
          >
            {minimized ? "▲" : "▼"}
          </button>
        </div>

        {!minimized ? (
          <div className="flex min-h-0 flex-1 flex-col bg-[#e8e8e8] p-1.5 shadow-win98in">
            <iframe
              title="Spotify — Xvohsome"
              src={src}
              className="min-h-0 w-full flex-1 rounded-sm border border-win-borderDark bg-white"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
            <p className="mt-1.5 shrink-0 text-[9px] leading-snug text-[#505050]">
              Override in{" "}
              <code className="rounded bg-[#d4d4d4] px-0.5">
                NEXT_PUBLIC_SPOTIFY_EMBED_SRC
              </code>
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
