import type { WindowType } from "@/lib/window-store";

export const DESKTOP_APPS: {
  type: WindowType;
  label: string;
  icon: string;
}[] = [
  { type: "music", label: "My Music", icon: "♪" },
  { type: "about", label: "About Me", icon: "ℹ️" },
  { type: "beats", label: "Beat Store", icon: "🎹" },
  { type: "files", label: "Files", icon: "📁" },
];

const titles: Record<WindowType, string> = {
  music: "My Music — Xvohsome",
  about: "About — Xvohsome",
  beats: "Beat Store",
  files: "Files",
};

const taskbarShort: Record<WindowType, string> = {
  music: "My Music",
  about: "About",
  beats: "Beat Store",
  files: "Files",
};

export function getWindowTitle(type: WindowType): string {
  return titles[type];
}

export function getTaskbarLabel(type: WindowType): string {
  return taskbarShort[type];
}

/** Labels shown in the Start menu (slightly shorter than desktop where needed) */
export const START_MENU_LABELS: Record<WindowType, string> = {
  music: "My Music",
  about: "About",
  beats: "Beat Store",
  files: "Files",
};
