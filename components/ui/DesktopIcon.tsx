"use client";

interface DesktopIconProps {
  label: string;
  icon: string;
  onOpen: () => void;
}

export function DesktopIcon({ label, icon, onOpen }: DesktopIconProps) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex w-[88px] flex-col items-center gap-1 rounded border border-transparent p-1 text-center hover:border-[#808080] hover:bg-[#000033]/40"
    >
      <span
        className="flex h-12 w-12 items-center justify-center border border-win-borderLight bg-gradient-to-b from-[#e0e0ff] to-[#8080c0] text-2xl shadow-win98out"
        aria-hidden
      >
        {icon}
      </span>
      <span className="max-w-[80px] text-[11px] leading-tight text-white drop-shadow-[0_1px_0_#000]">
        {label}
      </span>
    </button>
  );
}
