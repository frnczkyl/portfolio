'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ExternalLink, ChevronUp, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

export type WProject = {
  title: string;
  subtitle: string;
  description: string;
  link: string;
  tags: string[];
  accent: string;
  cardBg: string;
  glowBg: string;
  image?: string;
};

type Slot = 'center' | 'up-1' | 'up-2' | 'down-1' | 'down-2' | 'hidden';

function slotOf(i: number, cur: number, n: number): Slot {
  const off = (i - cur + n) % n;
  if (off === 0)         return 'center';
  if (off === 1)         return 'down-1';
  if (off === n - 1)     return 'up-1';
  if (off === 2)         return 'down-2';
  if (off === n - 2)     return 'up-2';
  return 'hidden';
}

export default function WorkCarousel({
  projects,
  getTagIcon,
}: {
  projects: WProject[];
  getTagIcon: (tag: string) => React.ReactNode;
}) {
  const n = projects.length;
  const [cur, setCur] = useState(0);
  const busy = useRef(false);

  const go = useCallback((next: number) => {
    const target = ((next % n) + n) % n;
    if (busy.current || target === cur) return;
    busy.current = true;
    setCur(target);
    setTimeout(() => { busy.current = false; }, 800);
  }, [n, cur]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6 lg:gap-14 items-center">

      {/* ── LEFT: Vertical stacking carousel ── */}
      <div className="flex justify-center mt-14 lg:mt-0">
        <div className="vc-container">
          <div className="vc-track">
            {projects.map((p, i) => {
              const slot = slotOf(i, cur, n);
              return (
                <div
                  key={p.title}
                  className={`vc-card vc-card--${slot}`}
                  onClick={() => slot !== 'center' && go(i)}
                >
                  <div className="vc-face" style={{ background: p.cardBg }}>
                    {p.image ? (
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        className="object-cover object-top"
                      />
                    ) : (
                      <>
                        <div className="vc-grid" />
                        <div className="vc-logo">
                          <Image
                            src="https://bai-remit-frontend-production.up.railway.app/Loading/Bai%20logo.png"
                            alt="BAI Finance"
                            width={48}
                            height={48}
                            className="object-contain"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── RIGHT: Info panel ── */}
      <div className="flex flex-col items-center gap-4 lg:gap-6">

        {/* Up / Down arrows */}
        <div className="flex gap-5">
          <button className="vc-arrow" onClick={() => go(cur - 1)} aria-label="Previous">
            <ChevronUp size={24} />
          </button>
          <button className="vc-arrow" onClick={() => go(cur + 1)} aria-label="Next">
            <ChevronDown size={24} />
          </button>
        </div>

        {/* Title + subtitle */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`head-${cur}`}
            className="text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28 }}
          >
            <h3 className="vc-name">{projects[cur].title}</h3>
            <p className="vc-role" style={{ color: projects[cur].accent }}>
              {projects[cur].subtitle}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Description + tags + link */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`body-${cur}`}
            className="flex flex-col gap-3 w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, delay: 0.06 }}
          >
            <p className="hidden sm:block text-zinc-400 text-sm leading-relaxed text-center">
              {projects[cur].description}
            </p>

            <div className="flex flex-wrap gap-2 justify-center">
              {projects[cur].tags.map(tag => (
                <span key={tag} className="flex items-center gap-1.5 text-xs text-zinc-400">
                  {getTagIcon(tag)}<span>{tag}</span>
                </span>
              ))}
            </div>

            <div className="flex justify-center pt-1">
              <a
                href={projects[cur].link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 h-11 min-w-[9rem] px-5 rounded-lg bg-white text-black text-sm font-semibold hover:bg-zinc-200 active:scale-95 transition-all duration-200"
              >
                <ExternalLink className="w-4 h-4" />
                View Live
              </a>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="flex gap-2.5 mt-1">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: '10px',
                height: '10px',
                background: i === cur ? '#ffffff' : 'rgba(255,255,255,0.2)',
                transform: i === cur ? 'scale(1.3)' : 'scale(1)',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
