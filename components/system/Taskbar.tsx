"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DESKTOP_APPS,
  getTaskbarLabel,
  START_MENU_LABELS,
} from "@/lib/app-registry";
import { useWindowStore } from "@/lib/window-store";
import type { WindowType } from "@/lib/window-store";

export function Taskbar() {
  const windows = useWindowStore((s) => s.windows);
  const openWindow = useWindowStore((s) => s.openWindow);
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const openApp = useCallback(
    (type: WindowType) => {
      openWindow(type);
      setMenuOpen(false);
    },
    [openWindow],
  );

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, closeMenu]);

  return (
    <footer className="relative z-30 flex h-9 shrink-0 items-center border-t-2 border-white bg-win-surface px-1 shadow-[inset_0_1px_0_#dfdfdf]">
      {menuOpen ? (
        <button
          type="button"
          className="fixed inset-0 bottom-9 z-20 cursor-default bg-black/25"
          aria-label="Close start menu"
          onClick={closeMenu}
        />
      ) : null}

      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className={`flex h-7 min-w-[72px] items-center border px-2 text-xs font-bold text-black shadow-win98out ${
            menuOpen
              ? "border-win-borderDark bg-[#c0c0c0] shadow-win98in"
              : "border-win-borderLight bg-win-surface hover:bg-[#dfdfdf]"
          }`}
        >
          Start
        </button>

        {menuOpen ? (
          <div
            className="absolute bottom-full left-0 z-40 mb-0.5 w-[200px] border border-win-borderDarker bg-win-surface py-1 shadow-[2px_2px_0_#000000]"
            role="menu"
          >
            <div className="border-b border-win-borderDark px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-[#404040]">
              Programs
            </div>
            <ul className="py-0.5">
              {DESKTOP_APPS.map((app) => (
                <li key={app.type}>
                  <button
                    type="button"
                    role="menuitem"
                    className="flex w-full items-center gap-2 px-2 py-1.5 text-left text-[11px] hover:bg-[#000080] hover:text-white"
                    onClick={() => openApp(app.type)}
                  >
                    <span className="w-5 text-center" aria-hidden>
                      {app.icon}
                    </span>
                    <span>{START_MENU_LABELS[app.type]}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="ml-2 flex flex-1 items-center gap-1 overflow-x-auto">
        {windows.map((w) => (
          <span
            key={w.id}
            className="max-w-[140px] truncate border border-win-borderLight bg-win-surface px-2 py-0.5 text-[11px] text-black shadow-win98in"
            title={w.type}
          >
            {getTaskbarLabel(w.type)}
          </span>
        ))}
      </div>
      <div className="ml-auto border border-win-borderLight bg-win-surface px-2 py-0.5 text-[11px] text-black shadow-win98in">
        Xvohsome OS
      </div>
    </footer>
  );
}
