import { create } from "zustand";

export type WindowType = "music" | "about" | "beats" | "files";

export interface DesktopWindow {
  id: string;
  type: WindowType;
  position: { x: number; y: number };
}

function createId(): string {
  return `win-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

interface WindowStore {
  windows: DesktopWindow[];
  openWindow: (type: WindowType) => void;
  closeWindow: (id: string) => void;
  updateWindowPosition: (id: string, position: { x: number; y: number }) => void;
}

const defaultPosition = (index: number) => ({
  x: 80 + index * 28,
  y: 48 + index * 28,
});

export const useWindowStore = create<WindowStore>((set) => ({
  windows: [],
  openWindow: (type) =>
    set((state) => {
      const index = state.windows.length;
      const next: DesktopWindow = {
        id: createId(),
        type,
        position: defaultPosition(index),
      };
      return { windows: [...state.windows, next] };
    }),
  closeWindow: (id) =>
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== id),
    })),
  updateWindowPosition: (id, position) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, position } : w,
      ),
    })),
}));
