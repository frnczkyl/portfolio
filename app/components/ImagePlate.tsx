'use client';

import React from 'react';

/* ─────────────────────────────────────────────
   Image plate.

   Replaces the plain bordered box. Reads as a part
   mounted on the board, to match the hero rail:
   focus brackets standing off the corners, a ruler
   edge, a spec line underneath and a live indicator.
───────────────────────────────────────────── */

export default function ImagePlate({
  code,
  label,
  className = '',
  children,
}: {
  /** short mono designation, e.g. "FIG.01" */
  code: string;
  /** what the picture is of */
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`plate ${className}`}>
      <span className="plate-corner pc-tl" aria-hidden />
      <span className="plate-corner pc-tr" aria-hidden />
      <span className="plate-corner pc-bl" aria-hidden />
      <span className="plate-corner pc-br" aria-hidden />

      <span className="plate-rule" aria-hidden />

      <div className="plate-frame">
        {children}
        <span className="plate-sheen" aria-hidden />
      </div>

      <div className="plate-meta" aria-hidden>
        <span className="plate-code">{code}</span>
        <span className="plate-label">{label}</span>
        <span className="plate-led" />
      </div>
    </div>
  );
}
