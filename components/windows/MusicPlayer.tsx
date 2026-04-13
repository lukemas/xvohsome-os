"use client";

import type { UploadedTrack } from "@/lib/tracks";
import { useCallback, useEffect, useRef, useState } from "react";

function formatTime(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const btn =
  "border border-win-borderLight bg-[#c0c0c0] font-bold text-black shadow-win98out hover:bg-[#d8d8d8] active:shadow-win98in disabled:pointer-events-none disabled:opacity-40";

const btnSm = `${btn} min-h-[22px] min-w-[26px] px-1.5 py-0.5 text-[10px] leading-none`;
const btnToggle = (on: boolean) =>
  `${btnSm} ${on ? "bg-[#a0a0a0] shadow-win98in" : ""}`;

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
  const [volume, setVolume] = useState(0.85);
  const [muted, setMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"off" | "one" | "all">("off");
  const [vizHeights, setVizHeights] = useState<number[]>(() =>
    Array.from({ length: 12 }, () => 20),
  );

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

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = muted ? 0 : volume;
  }, [volume, muted]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setVizHeights((prev) =>
        prev.map(() => 15 + Math.random() * 85),
      );
    }, 120);
    return () => window.clearInterval(id);
  }, [playing]);

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

  const stop = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    el.pause();
    el.currentTime = 0;
    setPlaying(false);
    setCurrentTime(0);
  }, []);

  const seekStart = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = 0;
    setCurrentTime(0);
  }, []);

  const playPrev = useCallback(() => {
    if (tracks.length === 0) return;
    const i = activeIndex > 0 ? activeIndex - 1 : tracks.length - 1;
    loadAndPlay(tracks[i], true);
  }, [tracks, activeIndex, loadAndPlay]);

  const goNext = useCallback(() => {
    if (tracks.length === 0) return;
    if (shuffle && tracks.length > 1) {
      let j = activeIndex;
      let guard = 0;
      while (j === activeIndex && guard < 8) {
        j = Math.floor(Math.random() * tracks.length);
        guard += 1;
      }
      loadAndPlay(tracks[j], true);
      return;
    }
    const i =
      activeIndex >= 0 && activeIndex < tracks.length - 1 ? activeIndex + 1 : 0;
    loadAndPlay(tracks[i], true);
  }, [tracks, activeIndex, loadAndPlay, shuffle]);

  const cycleRepeat = useCallback(() => {
    setRepeatMode((m) => (m === "off" ? "all" : m === "all" ? "one" : "off"));
  }, []);

  const onSeek = useCallback(
    (value: number) => {
      const el = audioRef.current;
      if (!el || !duration) return;
      el.currentTime = (value / 1000) * duration;
      setCurrentTime(el.currentTime);
    },
    [duration],
  );

  const handleEnded = useCallback(() => {
    const el = audioRef.current;
    if (!el || tracks.length === 0) return;

    if (repeatMode === "one") {
      el.currentTime = 0;
      void el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      return;
    }

    if (tracks.length === 1) {
      if (repeatMode === "all") {
        el.currentTime = 0;
        void el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
      } else {
        stop();
      }
      return;
    }

    const last = activeIndex === tracks.length - 1;

    if (repeatMode === "all" && last) {
      loadAndPlay(tracks[0], true);
      return;
    }

    if (repeatMode === "all" && !last) {
      goNext();
      return;
    }

    if (last) {
      stop();
      return;
    }

    goNext();
  }, [
    tracks,
    activeIndex,
    repeatMode,
    loadAndPlay,
    goNext,
    stop,
  ]);

  const trackLabel =
    activeTrack?.title ?? "No track";
  const trackNum =
    activeIndex >= 0 ? `${String(activeIndex + 1).padStart(2, "0")} / ${String(tracks.length).padStart(2, "0")}` : "-- / --";

  return (
    <div className="flex min-w-[300px] flex-col gap-2 text-black">
      {/* Menu strip */}
      <div className="flex gap-3 border-b border-win-borderDark pb-1 text-[10px] text-[#202020]">
        <span className="underline decoration-win-title">File</span>
        <span className="underline decoration-win-title">View</span>
        <span className="underline decoration-win-title">Options</span>
        <span className="underline decoration-win-title">Help</span>
      </div>

      {/* LCD + visualizer */}
      <div className="border border-win-borderDark bg-[#0a2a0a] p-2 shadow-win98in">
        <div className="flex items-start justify-between gap-2 font-mono text-[10px] text-[#7fff7f]">
          <div className="min-w-0 flex-1">
            <div className="mb-0.5 flex items-baseline justify-between gap-2 text-[#40c040]">
              <span>XVOHSOME-1</span>
              <span className="tabular-nums">{trackNum}</span>
            </div>
            <div className="truncate text-[11px] font-bold tracking-wide text-[#b0ffb0]">
              {loadState === "loading" ? "Loading…" : trackLabel}
            </div>
            <div className="mt-1 flex justify-between tabular-nums text-[#5fdf5f]">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          <div className="flex h-14 w-[5.5rem] shrink-0 items-end justify-center gap-px border border-[#003300] bg-black px-1 pb-0.5 pt-1">
            {vizHeights.map((h, i) => (
              <div
                key={i}
                className="w-1 bg-[#00ff66] opacity-90"
                style={{
                  height: `${playing ? Math.max(4, (h / 100) * 48) : 4}px`,
                  transition: "height 90ms linear",
                }}
              />
            ))}
          </div>
        </div>
        <div className="mt-1.5 flex justify-between text-[9px] text-[#3a8c3a]">
          <span>128 kbps</span>
          <span>44 kHz</span>
          <span>{playing ? "PLAY" : "STOP"}</span>
        </div>
      </div>

      {/* Position */}
      <div className="flex flex-col gap-0.5">
        <div className="h-2 w-full border border-win-borderDark bg-black shadow-win98in">
          <div
            className="h-full bg-win-title"
            style={{
              width: duration ? `${(currentTime / duration) * 100}%` : "0%",
            }}
          />
        </div>
        <input
          type="range"
          min={0}
          max={1000}
          step={1}
          disabled={!activeTrack || !duration}
          value={duration ? Math.round((currentTime / duration) * 1000) : 0}
          onChange={(e) => onSeek(Number(e.target.value))}
          className="h-1 w-full cursor-pointer accent-win-title disabled:opacity-40"
          aria-label="Seek"
        />
      </div>

      {/* Transport */}
      <div className="flex flex-wrap items-center justify-center gap-1 border border-win-borderLight bg-[#b8b8b8] p-1.5 shadow-win98in">
        <button type="button" className={btnSm} title="Stop" onClick={stop}>
          ■
        </button>
        <button
          type="button"
          className={btnSm}
          title="Jump to start"
          onClick={seekStart}
          disabled={!activeTrack}
        >
          |◀◀
        </button>
        <button
          type="button"
          className={btnSm}
          title="Previous"
          disabled={tracks.length === 0}
          onClick={playPrev}
        >
          |◀
        </button>
        <button
          type="button"
          className={`${btn} min-h-[28px] min-w-[52px] px-2 text-[11px]`}
          title={playing ? "Pause" : "Play"}
          disabled={!activeTrack}
          onClick={togglePlay}
        >
          {playing ? "❚❚" : "▶"}
        </button>
        <button
          type="button"
          className={btnSm}
          title="Next"
          disabled={tracks.length === 0}
          onClick={goNext}
        >
          ▶|
        </button>
        <button
          type="button"
          className={btnSm}
          title="End of list"
          disabled={tracks.length === 0}
          onClick={() => {
            if (tracks.length === 0) return;
            loadAndPlay(tracks[tracks.length - 1], true);
          }}
        >
          ▶▶|
        </button>
        <button type="button" className={btnSm} title="Eject (stop)" onClick={stop}>
          ▲
        </button>
      </div>

      {/* Options row */}
      <div className="flex flex-wrap items-center justify-between gap-2 border border-win-borderDark bg-[#d4d4d4] px-1.5 py-1 shadow-win98in">
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            className={btnToggle(shuffle)}
            title="Shuffle"
            disabled={tracks.length < 2}
            onClick={() => setShuffle((s) => !s)}
          >
            RND
          </button>
          <button
            type="button"
            className={btnToggle(repeatMode !== "off")}
            title="Repeat: off → all → one"
            onClick={cycleRepeat}
          >
            REP {repeatMode === "off" ? "○" : repeatMode === "all" ? "∞" : "1"}
          </button>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className={btnToggle(muted)}
            title="Mute"
            onClick={() => setMuted((m) => !m)}
          >
            🔇
          </button>
          <span className="text-[9px] text-[#404040]">Vol</span>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(volume * 100)}
            onChange={(e) => {
              setVolume(Number(e.target.value) / 100);
              setMuted(false);
            }}
            className="h-1 w-20 accent-win-title"
            aria-label="Volume"
          />
        </div>
      </div>

      <audio
        ref={audioRef}
        preload="metadata"
        onEnded={handleEnded}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onLoadedMetadata={(e) => {
          setDuration(e.currentTarget.duration || 0);
          setCurrentTime(0);
        }}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
      />

      {/* Playlist */}
      <div>
        <div className="mb-0.5 flex items-center justify-between text-[10px] font-bold text-[#404040]">
          <span>Playlist</span>
          <span className="font-normal">
            {fetchError ? (
              <span className="text-[#804000]">{fetchError}</span>
            ) : (
              <span>
                Folder:{" "}
                <code className="rounded bg-[#a0a0a0] px-0.5">public/uploaded tracks</code>
              </span>
            )}
          </span>
        </div>
        <div className="max-h-36 overflow-y-auto border border-win-borderDark bg-white shadow-win98in">
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
                <code className="rounded bg-[#dfdfdf] px-0.5">.wav</code>, etc. to{" "}
                <code className="rounded bg-[#dfdfdf] px-0.5">public/uploaded tracks</code>
                , then refresh.
              </p>
            )
          ) : (
            <ul>
              {tracks.map((t, idx) => {
                const selected = t.id === activeId;
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      className={`flex w-full items-center gap-2 px-2 py-1 text-left text-[11px] hover:bg-win-title hover:text-white ${
                        selected ? "bg-win-title text-white" : "bg-win-surface text-black"
                      }`}
                      onClick={() => loadAndPlay(t, true)}
                    >
                      <span className="w-5 tabular-nums text-[10px] opacity-80">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span aria-hidden>♪</span>
                      <span className="min-w-0 flex-1 truncate font-bold">{t.title}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
