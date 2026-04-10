"use client";

import type { UploadedTrack } from "@/lib/tracks";
import { useCallback, useEffect, useRef, useState } from "react";

function formatTime(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [tracks, setTracks] = useState<UploadedTrack[]>([]);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "ready" | "error">(
    "idle",
  );
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoadState("loading");

    async function loadLibrary(): Promise<{
      tracks: UploadedTrack[];
      error: string | null;
      fatal: boolean;
    }> {
      try {
        const r = await fetch("/api/tracks", { cache: "no-store" });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const data = (await r.json()) as {
          tracks?: UploadedTrack[];
          error?: string;
        };
        return {
          tracks: data.tracks ?? [],
          error: data.error ?? null,
          fatal: false,
        };
      } catch {
        try {
          const r = await fetch("/uploaded-tracks-manifest.json", {
            cache: "no-store",
          });
          if (!r.ok) throw new Error("manifest");
          const data = (await r.json()) as { tracks?: UploadedTrack[] };
          return {
            tracks: data.tracks ?? [],
            error: "Using static manifest (API unavailable).",
            fatal: false,
          };
        } catch {
          return {
            tracks: [],
            error: "Could not load track list.",
            fatal: true,
          };
        }
      }
    }

    void loadLibrary().then(({ tracks, error, fatal }) => {
      if (cancelled) return;
      setFetchError(error);
      setTracks(tracks);
      setLoadState(fatal ? "error" : "ready");
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const activeIndex = tracks.findIndex((t) => t.id === activeId);
  const activeTrack = activeIndex >= 0 ? tracks[activeIndex] : null;

  const loadAndPlay = useCallback(
    (track: UploadedTrack, autoplay: boolean) => {
      const el = audioRef.current;
      if (!el) return;
      setActiveId(track.id);
      el.src = track.url;
      el.load();
      if (autoplay) {
        void el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      }
    },
    [],
  );

  const togglePlay = useCallback(() => {
    const el = audioRef.current;
    if (!el || !activeTrack) return;
    if (playing) {
      el.pause();
      return;
    }
    void el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, [activeTrack, playing]);

  const playPrev = useCallback(() => {
    if (tracks.length === 0) return;
    const i = activeIndex > 0 ? activeIndex - 1 : tracks.length - 1;
    loadAndPlay(tracks[i], true);
  }, [tracks, activeIndex, loadAndPlay]);

  const playNext = useCallback(() => {
    if (tracks.length === 0) return;
    const i = activeIndex >= 0 && activeIndex < tracks.length - 1 ? activeIndex + 1 : 0;
    loadAndPlay(tracks[i], true);
  }, [tracks, activeIndex, loadAndPlay]);

  const onSeek = useCallback(
    (value: number) => {
      const el = audioRef.current;
      if (!el || !duration) return;
      el.currentTime = (value / 1000) * duration;
      setCurrentTime(el.currentTime);
    },
    [duration],
  );

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-[#404040]">
        Audio files in{" "}
        <code className="rounded bg-[#a0a0a0] px-1">public/uploaded tracks</code>{" "}
        appear here after refresh.
      </p>

      <div className="max-h-40 overflow-y-auto border border-win-borderDark bg-white shadow-win98in">
        {loadState === "loading" ? (
          <p className="p-2 text-[11px] text-[#404040]">Loading library…</p>
        ) : loadState === "error" ? (
          <p className="p-2 text-[11px] text-red-800">{fetchError ?? "Error"}</p>
        ) : tracks.length === 0 ? (
          fetchError ? (
            <p className="p-2 text-[11px] leading-snug text-red-800">{fetchError}</p>
          ) : (
            <p className="p-2 text-[11px] leading-snug text-[#404040]">
              No audio files yet. Add{" "}
              <code className="rounded bg-[#dfdfdf] px-0.5">.mp3</code>,{" "}
              <code className="rounded bg-[#dfdfdf] px-0.5">.wav</code>,{" "}
              <code className="rounded bg-[#dfdfdf] px-0.5">.ogg</code>, etc. to{" "}
              <code className="rounded bg-[#dfdfdf] px-0.5">public/uploaded tracks</code>
              , then refresh.
            </p>
          )
        ) : (
          <ul>
            {tracks.map((t) => {
              const selected = t.id === activeId;
              return (
                <li key={t.id}>
                  <button
                    type="button"
                    className={`flex w-full items-center gap-2 px-2 py-1.5 text-left text-[11px] hover:bg-[#000080] hover:text-white ${
                      selected ? "bg-[#000080] text-white" : "bg-win-surface text-black"
                    }`}
                    onClick={() => loadAndPlay(t, true)}
                  >
                    <span aria-hidden>♪</span>
                    <span className="min-w-0 flex-1 truncate font-bold">{t.title}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <audio
        ref={audioRef}
        preload="metadata"
        onEnded={() => {
          setPlaying(false);
          if (tracks.length > 1) playNext();
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration || 0);
          setCurrentTime(0);
        }}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
      />

      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between text-[10px] text-[#404040]">
          <span className="min-w-0 truncate">
            {activeTrack ? activeTrack.title : "—"}
          </span>
          <span className="shrink-0 tabular-nums">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={1000}
          step={1}
          disabled={!activeTrack || !duration}
          value={
            duration ? Math.round((currentTime / duration) * 1000) : 0
          }
          onChange={(e) => onSeek(Number(e.target.value))}
          className="h-2 w-full accent-[#000080] disabled:opacity-40"
          aria-label="Seek"
        />
      </div>

      <div className="flex items-center justify-center gap-2">
        <button
          type="button"
          disabled={tracks.length === 0}
          onClick={playPrev}
          className="border border-win-borderLight bg-win-surface px-2 py-1 text-[11px] font-bold shadow-win98out hover:bg-[#dfdfdf] active:shadow-win98in disabled:opacity-40"
        >
          |◀
        </button>
        <button
          type="button"
          disabled={!activeTrack}
          onClick={togglePlay}
          className="min-w-[72px] border border-win-borderLight bg-win-surface px-3 py-1 text-xs font-bold shadow-win98out hover:bg-[#dfdfdf] active:shadow-win98in disabled:opacity-40"
        >
          {playing ? "Pause" : "Play"}
        </button>
        <button
          type="button"
          disabled={tracks.length === 0}
          onClick={playNext}
          className="border border-win-borderLight bg-win-surface px-2 py-1 text-[11px] font-bold shadow-win98out hover:bg-[#dfdfdf] active:shadow-win98in disabled:opacity-40"
        >
          ▶|
        </button>
      </div>
    </div>
  );
}
