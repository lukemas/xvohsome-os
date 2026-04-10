"use client";

export function AboutWindow() {
  return (
    <div className="border border-black bg-black p-2 font-mono text-[11px] leading-relaxed text-[#00ff00] shadow-win98in">
      <p className="mb-2 text-[#00ffff]">C:\XVOSHOME\ABOUT&gt; whoami</p>
      <p className="mb-3 text-white">xvohsome</p>
      <p className="mb-1 text-[#c0c0c0]">
        Producer / beatmaker. This desktop is a playful nod to late-90s
        computing — built for music, not spreadsheets.
      </p>
      <p className="text-[#808080]">
        <span className="animate-pulse">_</span>
      </p>
    </div>
  );
}
