'use client';

import { motion, useScroll } from 'framer-motion';
import React, { useRef } from 'react';

/* ─────────────────────────────────────────────
   Text that flies apart from its centre and
   reassembles as it scrolls into view.

   Like the grid, scroll progress is published once
   per block as a CSS variable and each unit derives
   its own offset from its distance to the middle.

   Characters are grouped into words so the line
   still wraps at word boundaries, and the plain
   string is kept for screen readers.
───────────────────────────────────────────── */

type Segment = { text: string; className?: string };
type Unit = { text: string; className?: string; d: number };

export default function ScatterText({
  segments,
  as: Tag = 'div',
  className = '',
  unit = 'char',
  spread = 150,
  tilt = 52,
}: {
  segments: Segment[];
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div' | 'span';
  className?: string;
  /** split per letter, or per word for smaller body copy */
  unit?: 'char' | 'word';
  /** furthest horizontal travel, px */
  spread?: number;
  /** furthest rotation, deg */
  tilt?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start center'],
  });

  const plain = segments.map((s) => s.text).join('');
  const words = unit === 'char' ? splitChars(segments) : splitWords(segments);

  return (
    <Tag className={className}>
      <span className="sr-only">{plain}</span>

      <motion.span
        ref={ref}
        className="scatter"
        aria-hidden
        style={{
          ['--p' as string]: scrollYProgress,
          ['--sx' as string]: `${spread}px`,
          ['--sr' as string]: `${tilt}deg`,
        }}
      >
        {words.map((w, wi) => (
          <React.Fragment key={wi}>
            {wi > 0 && ' '}
            <span className="scatter-word">
              {w.map((u, ui) => (
                <span
                  key={ui}
                  className={`scatter-unit ${u.className ?? ''}`}
                  style={{ ['--d' as string]: u.d }}
                >
                  {u.text}
                </span>
              ))}
            </span>
          </React.Fragment>
        ))}
      </motion.span>
    </Tag>
  );
}

/* distance to the middle, normalised to -1…1 so the
   outermost unit always travels the full `spread` */
function offsets(count: number) {
  const centre = (count - 1) / 2;
  return (i: number) => (centre === 0 ? 0 : (i - centre) / centre);
}

function splitChars(segments: Segment[]): Unit[][] {
  const total = segments.reduce((n, s) => n + s.text.length, 0);
  const at = offsets(total);

  const words: Unit[][] = [];
  let current: Unit[] = [];
  let i = -1;

  for (const seg of segments) {
    for (const ch of seg.text) {
      i++;
      if (ch === ' ') {
        if (current.length) words.push(current);
        current = [];
        continue;
      }
      current.push({ text: ch, className: seg.className, d: at(i) });
    }
  }
  if (current.length) words.push(current);
  return words;
}

function splitWords(segments: Segment[]): Unit[][] {
  const pieces: { text: string; className?: string }[] = [];

  for (const seg of segments) {
    for (const word of seg.text.split(' ')) {
      if (word) pieces.push({ text: word, className: seg.className });
    }
  }

  const at = offsets(pieces.length);
  return pieces.map((p, i) => [{ ...p, d: at(i) }]);
}
