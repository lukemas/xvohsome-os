import type { WindowType } from "@/lib/window-store";

export const DESKTOP_APPS: {
  type: WindowType;
  label: string;
  icon: string;
}[] = [
  { type: "music", label: "Music Player", icon: "\u266A" },
  { type: "my-music", label: "My Music", icon: "\uD83D\uDCC2" },
  { type: "browser", label: "Internet Browser", icon: "\uD83C\uDF10" },
  { type: "about", label: "About Me", icon: "\u2139\uFE0F" },
  { type: "beats", label: "Beat Store", icon: "\uD83C\uDFB9" },
  { type: "files", label: "Files", icon: "\uD83D\uDCC1" },
  { type: "merch", label: "Merch", icon: "\uD83D\uDED2" },
];

const titles: Record<WindowType, string> = {
  music: "Music Player — Xvohsome",
  "my-music": "My Music",
  browser: "Internet Browser",
  about: "About — Xvohsome",
  beats: "Beat Store",
  files: "Files",
  merch: "Merch — Xvohsome",
};

const taskbarShort: Record<WindowType, string> = {
  music: "Music Player",
  "my-music": "My Music",
  browser: "Browser",
  about: "About",
  beats: "Beat Store",
  files: "Files",
  merch: "Merch",
};

export function getWindowTitle(type: WindowType): string {
  return titles[type];
}

export function getTaskbarLabel(type: WindowType): string {
  return taskbarShort[type];
}

/** Labels shown in the Start menu (slightly shorter than desktop where needed) */
export const START_MENU_LABELS: Record<WindowType, string> = {
  music: "Music Player",
  "my-music": "My Music",
  browser: "Internet Browser",
  about: "About",
  beats: "Beat Store",
  files: "Files",
  merch: "Merch",
};
