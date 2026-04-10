"use client";

import { useCallback, useRef, useState } from "react";

/** Demo MP3 — replace with your own asset under /public when ready */
const DEMO_MP3 =
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const playEvo99 = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    void el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs leading-snug">
        Xvohsome — preview track placeholder. Wire your own file into{" "}
        <code className="rounded bg-[#a0a0a0] px-1">public/</code> when ready.
      </p>
      <audio
        ref={audioRef}
        src={DEMO_MP3}
        onEnded={() => setPlaying(false)}
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
        preload="none"
      />
      <button
        type="button"
        onClick={playEvo99}
        className="self-start border border-win-borderLight bg-win-surface px-4 py-1 text-xs font-bold text-black shadow-win98out hover:bg-[#dfdfdf] active:shadow-win98in"
      >
        Play evo99
      </button>
      {playing ? (
        <span className="text-[11px] text-[#004000]">Playing…</span>
      ) : (
        <span className="text-[11px] text-[#404040]">Stopped</span>
      )}
    </div>
  );
}
