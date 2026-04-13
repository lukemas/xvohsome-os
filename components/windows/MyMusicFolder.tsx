"use client";

import { useCallback, useMemo, useState } from "react";

type FolderId = "lps" | "eps";

type FileEntry = { name: string; type: string; size: string };

type ReleaseItem = {
  id: string;
  name: string;
  type: string;
  size: string;
  files: FileEntry[];
};

type ViewState =
  | { screen: "root" }
  | { screen: "folder"; id: FolderId }
  | { screen: "release"; category: FolderId; releaseId: string };

const LP_ITEMS: ReleaseItem[] = [
  {
    id: "evo99",
    name: "evo99",
    type: "Album",
    size: "12 tracks",
    files: [
      { name: "01 - intro.wav", type: "Wave sound", size: "4.1 MB" },
      { name: "02 - main theme.wav", type: "Wave sound", size: "8.2 MB" },
      { name: "cover.jpg", type: "JPEG image", size: "128 KB" },
    ],
  },
  {
    id: "night-drive",
    name: "Night Drive",
    type: "Album",
    size: "10 tracks",
    files: [
      { name: "night_drive_master.wav", type: "Wave sound", size: "12.4 MB" },
      { name: "notes.txt", type: "Text document", size: "2 KB" },
    ],
  },
  {
    id: "halfreal2001",
    name: "halfreal2001",
    type: "Album",
    size: "9 tracks",
    files: [
      { name: "loop.wav", type: "Wave sound", size: "6.0 MB" },
      { name: "perfect loop.wav", type: "Wave sound", size: "5.8 MB" },
    ],
  },
];

const EP_ITEMS: ReleaseItem[] = [
  {
    id: "dust-bin",
    name: "dust.bin",
    type: "EP",
    size: "5 tracks",
    files: [
      { name: "dust_ep_01.wav", type: "Wave sound", size: "3.2 MB" },
      { name: "readme.txt", type: "Text document", size: "1 KB" },
    ],
  },
  {
    id: "chrome-session",
    name: "Chrome Session",
    type: "EP",
    size: "4 tracks",
    files: [{ name: "session_stems.zip", type: "ZIP archive", size: "24 MB" }],
  },
  {
    id: "friday-everyday",
    name: "friday everyday",
    type: "EP",
    size: "6 tracks",
    files: [
      { name: "friday everyday.wav", type: "Wave sound", size: "7.1 MB" },
      { name: "artwork.png", type: "PNG image", size: "256 KB" },
    ],
  },
];

const FOLDER_META: Record<FolderId, { title: string; items: ReleaseItem[] }> = {
  lps: { title: "LPs", items: LP_ITEMS },
  eps: { title: "EPs", items: EP_ITEMS },
};

function findRelease(
  category: FolderId,
  releaseId: string,
): ReleaseItem | undefined {
  return FOLDER_META[category].items.find((r) => r.id === releaseId);
}

const btn =
  "border border-win-borderLight bg-[#c0c0c0] px-2 py-0.5 text-[10px] font-bold text-black shadow-win98out hover:bg-[#dfdfdf] active:shadow-win98in disabled:cursor-default disabled:opacity-40 disabled:hover:bg-[#c0c0c0]";

function LargeFolderTile({
  label,
  onOpen,
}: {
  label: string;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex w-[104px] flex-col items-center gap-2 rounded-sm border border-transparent p-2 hover:border-dotted hover:border-win-title hover:bg-[#e8e8ff] focus:border-dotted focus:border-win-title focus:outline-none"
    >
      <span
        className="flex h-14 w-14 items-center justify-center border border-win-borderLight bg-gradient-to-b from-[#fffef0] to-[#d4c448] text-4xl shadow-win98out"
        aria-hidden
      >
        📂
      </span>
      <span className="max-w-[96px] text-center text-[11px] font-bold leading-tight text-black group-hover:underline">
        {label}
      </span>
    </button>
  );
}

function LargeAlbumTile({
  name,
  meta,
  onOpen,
}: {
  name: string;
  meta: string;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex w-[104px] flex-col items-center gap-1.5 rounded-sm border border-transparent p-2 text-center hover:border-dotted hover:border-win-title hover:bg-[#e8e8ff] focus:border-dotted focus:border-win-title focus:outline-none"
    >
      <span className="flex h-14 w-14 items-center justify-center border border-win-borderLight bg-gradient-to-b from-[#f0f0ff] to-[#b8b8d8] text-3xl shadow-win98out">
        💿
      </span>
      <span className="max-w-[96px] text-[11px] font-bold leading-tight text-black group-hover:underline">
        {name}
      </span>
      <span className="max-w-[96px] text-[9px] leading-tight text-[#404040]">
        {meta}
      </span>
    </button>
  );
}

function FileListView({ files }: { files: FileEntry[] }) {
  return (
    <div className="w-full border border-win-borderDark bg-white shadow-win98in">
      <div className="flex border-b border-win-borderDark bg-[#e0e0e0] text-[10px] font-bold text-black">
        <div className="min-w-0 flex-1 border-r border-win-borderDark px-2 py-1">
          Name
        </div>
        <div className="w-28 shrink-0 border-r border-win-borderDark px-1 py-1">
          Type
        </div>
        <div className="w-24 shrink-0 px-1 py-1">Size</div>
      </div>
      <ul className="max-h-[min(52vh,420px)] overflow-y-auto">
        {files.map((f) => (
          <li
            key={f.name}
            className="group flex border-b border-[#e8e8e8] text-[11px] last:border-b-0 hover:bg-win-title"
          >
            <span className="flex min-w-0 flex-1 items-center gap-2 px-2 py-1.5 group-hover:text-white">
              <span aria-hidden>{f.name.endsWith(".wav") ? "🎵" : "📄"}</span>
              <span className="min-w-0 truncate font-bold">{f.name}</span>
            </span>
            <span className="w-28 shrink-0 px-1 py-1.5 text-[#303030] group-hover:text-white">
              {f.type}
            </span>
            <span className="w-24 shrink-0 px-1 py-1.5 text-[#404040] group-hover:text-white">
              {f.size}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function MyMusicFolder() {
  const [view, setView] = useState<ViewState>({ screen: "root" });

  const pathLabel = useMemo(() => {
    if (view.screen === "root") return "C:\\My Music";
    if (view.screen === "folder") {
      return `C:\\My Music\\${FOLDER_META[view.id].title}`;
    }
    const rel = findRelease(view.category, view.releaseId);
    const folderTitle = FOLDER_META[view.category].title;
    const leaf = rel?.name ?? view.releaseId;
    return `C:\\My Music\\${folderTitle}\\${leaf}`;
  }, [view]);

  const openFolder = useCallback((id: FolderId) => {
    setView({ screen: "folder", id });
  }, []);

  const openRelease = useCallback((category: FolderId, releaseId: string) => {
    setView({ screen: "release", category, releaseId });
  }, []);

  const goBack = useCallback(() => {
    setView((v) => {
      if (v.screen === "release") {
        return { screen: "folder", id: v.category };
      }
      if (v.screen === "folder") {
        return { screen: "root" };
      }
      return v;
    });
  }, []);

  const canGoBack = view.screen !== "root";

  const currentRelease = useMemo(() => {
    if (view.screen !== "release") return null;
    return findRelease(view.category, view.releaseId);
  }, [view]);

  const statusText = useMemo(() => {
    if (view.screen === "root") return "2 object(s) (Large Icons)";
    if (view.screen === "folder") {
      const n = FOLDER_META[view.id].items.length;
      return `${n} object(s) (Large Icons)`;
    }
    const n = currentRelease?.files.length ?? 0;
    return `${n} file(s) (Details)`;
  }, [view, currentRelease]);

  const viewModeLabel =
    view.screen === "release" ? "Details" : "Large Icons";

  return (
    <div className="flex h-full min-h-[480px] flex-col bg-[#c0c0c0]">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-win-borderDark bg-[#d4d4d4] px-1.5 py-1">
        <button
          type="button"
          className={btn}
          disabled={!canGoBack}
          onClick={goBack}
          title="Back"
        >
          ← Back
        </button>
        <button
          type="button"
          className={btn}
          disabled={!canGoBack}
          onClick={goBack}
          title="Up one level"
        >
          Up
        </button>
        <span className="mx-1 h-4 w-px bg-win-borderDark" aria-hidden />
        <span className="text-[10px] text-[#404040]">{viewModeLabel}</span>
      </div>

      {/* Address bar */}
      <div className="flex items-center gap-1.5 border-b border-win-borderDark bg-[#e8e8e8] px-2 py-1">
        <span className="shrink-0 text-[10px] font-bold text-[#404040]">
          Address
        </span>
        <div className="min-w-0 flex-1 border border-win-borderDark bg-white px-2 py-1 font-mono text-[11px] text-black shadow-win98in">
          {pathLabel}
        </div>
      </div>

      {/* White client area */}
      <div className="min-h-0 flex-1 overflow-hidden border-t border-white bg-white shadow-[inset_1px_1px_0_#808080,inset_-1px_-1px_0_#ffffff]">
        <div className="h-full min-h-[400px] overflow-auto bg-white p-6 sm:p-8">
          {view.screen === "root" ? (
            <div className="flex flex-wrap content-start gap-x-10 gap-y-10">
              <LargeFolderTile label="LPs" onOpen={() => openFolder("lps")} />
              <LargeFolderTile label="EPs" onOpen={() => openFolder("eps")} />
            </div>
          ) : view.screen === "folder" ? (
            <div className="flex flex-wrap content-start gap-x-10 gap-y-10">
              {FOLDER_META[view.id].items.map((item) => (
                <LargeAlbumTile
                  key={item.id}
                  name={item.name}
                  meta={`${item.type} · ${item.size}`}
                  onOpen={() => openRelease(view.id, item.id)}
                />
              ))}
            </div>
          ) : currentRelease ? (
            <div className="flex flex-col gap-3">
              <p className="text-[10px] text-[#505050]">
                Opening a release folder — add or replace files here when you wire
                real assets.
              </p>
              <FileListView files={currentRelease.files} />
            </div>
          ) : (
            <p className="text-[11px] text-red-800">Folder not found.</p>
          )}
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between border-t border-white bg-[#c0c0c0] px-2 py-1 text-[10px] text-[#202020] shadow-[inset_0_1px_0_#ffffff]">
        <span>{statusText}</span>
        <span className="text-[#606060]">My Music</span>
      </div>
    </div>
  );
}
