"use client";

import { useCallback, useEffect, useId, useState } from "react";

const DEFAULT_HOME_URL = "https://example.com";

function normalizeUrl(input: string): string {
  const t = input.trim();
  if (!t) return "about:blank";
  if (t.startsWith("/") && !t.startsWith("//")) return t;
  if (/^https?:\/\//i.test(t)) return t;
  if (/^\/\//.test(t)) return `https:${t}`;
  if (/^[a-z][a-z0-9+.-]*:/i.test(t)) return t;
  return `https://${t}`;
}

type HistoryState = { urls: string[]; idx: number };

export type BrowserWindowProps = {
  /** First page to load (path like `/beat-store` or full URL). */
  initialSrc?: string;
  /** Target for the Home (H) button; defaults to `initialSrc` or the global default. */
  homeUrl?: string;
  /** Replaces the default footer hint. */
  footerNote?: string;
};

export function BrowserWindow({
  initialSrc,
  homeUrl,
  footerNote,
}: BrowserWindowProps = {}) {
  const urlFieldId = useId();
  const startUrl = initialSrc ?? DEFAULT_HOME_URL;
  const home = homeUrl ?? initialSrc ?? DEFAULT_HOME_URL;
  const [history, setHistory] = useState<HistoryState>({
    urls: [startUrl],
    idx: 0,
  });
  const [input, setInput] = useState(startUrl);
  const [reloadKey, setReloadKey] = useState(0);

  const currentUrl = history.urls[history.idx] ?? startUrl;

  useEffect(() => {
    setInput(currentUrl);
  }, [currentUrl]);

  const navigate = useCallback((raw: string) => {
    const u = normalizeUrl(raw);
    setHistory((h) => {
      const urls = h.urls.slice(0, h.idx + 1);
      urls.push(u);
      return { urls, idx: urls.length - 1 };
    });
  }, []);

  const go = useCallback(() => {
    navigate(input);
  }, [input, navigate]);

  const goBack = useCallback(() => {
    setHistory((h) => (h.idx > 0 ? { ...h, idx: h.idx - 1 } : h));
  }, []);

  const goForward = useCallback(() => {
    setHistory((h) =>
      h.idx < h.urls.length - 1 ? { ...h, idx: h.idx + 1 } : h,
    );
  }, []);

  const reload = useCallback(() => {
    setReloadKey((k) => k + 1);
  }, []);

  const goHome = useCallback(() => {
    navigate(home);
  }, [navigate, home]);

  const canBack = history.idx > 0;
  const canForward = history.idx < history.urls.length - 1;

  const btn =
    "shrink-0 border border-win-borderLight bg-win-surface px-2 py-0.5 text-[10px] font-bold text-black shadow-win98out hover:bg-[#dfdfdf] active:shadow-win98in disabled:cursor-not-allowed disabled:opacity-45 disabled:shadow-none";

  return (
    <div className="flex h-full min-h-[min(70vh,520px)] flex-col">
      <div className="flex shrink-0 flex-wrap items-center gap-1 border-b border-win-borderDark bg-[#d4d4d4] px-2 py-1.5 shadow-win98in">
        <button
          type="button"
          className={btn}
          onClick={goBack}
          disabled={!canBack}
          title="Back"
        >
          {"\u2190"}
        </button>
        <button
          type="button"
          className={btn}
          onClick={goForward}
          disabled={!canForward}
          title="Forward"
        >
          {"\u2192"}
        </button>
        <button type="button" className={btn} onClick={reload} title="Reload">
          R
        </button>
        <button type="button" className={btn} onClick={goHome} title="Home">
          H
        </button>
        <form
          className="flex min-w-0 flex-1 items-center gap-1"
          onSubmit={(e) => {
            e.preventDefault();
            go();
          }}
        >
          <label htmlFor={urlFieldId} className="sr-only">
            Address
          </label>
          <input
            id={urlFieldId}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            spellCheck={false}
            autoComplete="off"
            className="min-w-0 flex-1 border border-win-borderDark bg-white px-1.5 py-0.5 text-[11px] text-black shadow-win98in outline-none focus:ring-1 focus:ring-win-title"
            placeholder="https://..."
          />
          <button type="submit" className={btn}>
            Go
          </button>
        </form>
      </div>

      <div className="relative min-h-0 flex-1 bg-[#c0c0c0] p-1 shadow-win98in">
        <iframe
          key={`${currentUrl}-${reloadKey}`}
          title="Web page"
          src={currentUrl}
          className="h-full min-h-[320px] w-full rounded-sm border border-win-borderDark bg-white"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <p className="shrink-0 border-t border-win-borderDark bg-win-surface px-2 py-1 text-[9px] leading-snug text-[#505050]">
        {footerNote ??
          "Some sites block embedding and will not load here (browser security). Home is example.com; type any URL and press Go."}
      </p>
    </div>
  );
}
