"use client";

import { motion, useDragControls, useMotionValue } from "framer-motion";
import { useEffect } from "react";

interface WindowProps {
  title: string;
  children: React.ReactNode;
  initialPosition: { x: number; y: number };
  onClose: () => void;
  onPositionCommit: (position: { x: number; y: number }) => void;
  /** Extra classes on the outer window frame (e.g. min width for folder views). */
  className?: string;
  /** Override default gray padded content area (e.g. flush white client surface). */
  contentClassName?: string;
}

export function Window({
  title,
  children,
  initialPosition,
  onClose,
  onPositionCommit,
  className,
  contentClassName,
}: WindowProps) {
  const x = useMotionValue(initialPosition.x);
  const y = useMotionValue(initialPosition.y);
  const dragControls = useDragControls();

  useEffect(() => {
    x.set(initialPosition.x);
    y.set(initialPosition.y);
  }, [initialPosition.x, initialPosition.y, x, y]);

  return (
    <motion.div
      className={`absolute z-10 flex min-w-[280px] flex-col overflow-hidden rounded-sm border border-win-borderDarker bg-win-surface font-retro text-sm text-black shadow-win98out ${className ?? ""}`}
      style={{ x, y }}
      drag
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      onDragEnd={() => {
        onPositionCommit({ x: x.get(), y: y.get() });
      }}
    >
      <div
        className="flex cursor-grab select-none items-center justify-between border-b border-black bg-win-title px-1 py-0.5 active:cursor-grabbing"
        onPointerDown={(e) => dragControls.start(e)}
      >
        <span className="truncate pl-1 text-xs font-bold text-white">
          {title}
        </span>
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="flex h-[18px] min-w-[18px] items-center justify-center border border-win-borderLight bg-win-surface text-[11px] font-bold leading-none text-black shadow-win98out hover:bg-[#dfdfdf] active:shadow-win98in"
          aria-label="Close window"
        >
          ×
        </button>
      </div>
      <div
        className={`min-h-[120px] bg-win-surface p-3 shadow-win98in ${contentClassName ?? ""}`}
      >
        {children}
      </div>
    </motion.div>
  );
}
