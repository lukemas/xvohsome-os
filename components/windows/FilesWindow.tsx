"use client";

const SECTIONS = [
  {
    name: "Documents",
    items: ["Lyrics drafts", "Session notes", "Cover art refs"],
  },
  {
    name: "Samples",
    items: ["Kicks", "Snares", "One-shots"],
  },
  {
    name: "Projects",
    items: ["evo99_master", "dust_remix", "live_set_2026"],
  },
];

export function FilesWindow() {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-[#404040]">
        Browse folders — display only (no filesystem access).
      </p>
      <div className="flex flex-col gap-2">
        {SECTIONS.map((section) => (
          <div
            key={section.name}
            className="border border-win-borderDark bg-white shadow-win98in"
          >
            <div className="border-b border-win-borderDark bg-[#000080] px-2 py-0.5 text-[11px] font-bold text-white">
              📂 {section.name}
            </div>
            <ul className="divide-y divide-[#c0c0c0] bg-win-surface">
              {section.items.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 px-2 py-1 text-[11px] hover:bg-[#000080] hover:text-white"
                >
                  <span aria-hidden>📄</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
