'use client';

import Image from 'next/image';
import { motion, useScroll } from 'framer-motion';
import ScatterText from './ScatterText';
import { useCallback, useRef, useSyncExternalStore } from 'react';

export type SkillItem =
  | { name: string; icon: string }
  | { name: string; custom: true; src: string };

/* ─────────────────────────────────────────────
   Tiles fly in from their side of the grid and
   settle as the group scrolls into view.

   Scroll progress is published once per grid as a
   CSS variable; each tile derives its own offset
   from its distance to the centre column. One value
   to update per grid instead of five per tile.
───────────────────────────────────────────── */

/* Must track the grid's Tailwind breakpoints below */
const COLS_SM = '(min-width: 640px)';
const COLS_MD = '(min-width: 768px)';

function useColumns() {
  const subscribe = useCallback((onChange: () => void) => {
    const sm = window.matchMedia(COLS_SM);
    const md = window.matchMedia(COLS_MD);
    sm.addEventListener('change', onChange);
    md.addEventListener('change', onChange);
    return () => {
      sm.removeEventListener('change', onChange);
      md.removeEventListener('change', onChange);
    };
  }, []);

  return useSyncExternalStore(
    subscribe,
    () => (window.matchMedia(COLS_MD).matches ? 6 : window.matchMedia(COLS_SM).matches ? 5 : 3),
    () => 6
  );
}

export default function SkillsGrid({ label, items }: { label: string; items: SkillItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const cols = useColumns();

  // 0 as the grid first peeks in, 1 once its top reaches the middle of the screen
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start center'],
  });

  const centerCol = (cols - 1) / 2;

  return (
    <div className="mb-10 last:mb-0">
      <div className="group-head flex items-baseline gap-2 pb-3 mb-5 border-b border-[var(--border)]">
        <ScatterText
          as="h3"
          className="text-sm font-bold"
          spread={70}
          tilt={40}
          segments={[{ text: label }]}
        />
        <span className="text-xs text-[var(--muted)]">{items.length}</span>
      </div>

      <motion.div
        ref={ref}
        className="skill-grid grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-3"
        style={{ ['--p' as string]: scrollYProgress }}
      >
        {items.map((skill, i) => {
          const d = (i % cols) - centerCol;
          return (
            <div
              key={skill.name}
              className="skill-cell"
              style={{ ['--d' as string]: d, ['--a' as string]: Math.abs(d) }}
            >
              <div className="shot-tile flex h-full flex-col items-center justify-center gap-2 p-5">
                {'custom' in skill && skill.custom ? (
                  <Image src={skill.src} alt={skill.name} width={30} height={30} className="object-contain" />
                ) : (
                  <i className={`${'icon' in skill ? skill.icon : ''} text-[30px] leading-none`} />
                )}
                <span className="text-[10px] font-semibold text-[var(--muted)] text-center leading-tight">
                  {skill.name}
                </span>
              </div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
}
