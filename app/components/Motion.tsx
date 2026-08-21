'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

/* ─────────────────────────────────────────────
   Adds `.is-in` when the element scrolls into view.
   Re-arms when it leaves so it replays on scroll-back.
───────────────────────────────────────────── */
export function useReveal<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.classList.add('is-in');
        else el.classList.remove('is-in');
      },
      { threshold, rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return ref;
}

/* Generic fade+rise on scroll-in */
export function Reveal({
  children,
  className = '',
  delay = 0,
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'section' | 'span';
}) {
  const ref = useReveal<HTMLDivElement>(0.15);
  return (
    <Tag
      ref={ref as React.Ref<HTMLDivElement>}
      className={`sv-in ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

/* ─────────────────────────────────────────────
   Line-by-line reveal: each line starts muted and
   lifts into full contrast, staggered. Pass the
   copy already split into lines.
───────────────────────────────────────────── */
export function LineReveal({
  lines,
  className = '',
  tailMuted = true,
  stagger = 90,
}: {
  lines: string[];
  className?: string;
  tailMuted?: boolean;
  stagger?: number;
}) {
  const ref = useReveal<HTMLParagraphElement>(0.2);
  return (
    <p ref={ref} className={`sv-lines ${className}`}>
      {lines.map((line, i) => (
        <span
          key={i}
          className={`sv-ln${tailMuted && i === lines.length - 1 ? ' sv-tail' : ''}`}
          style={{ transitionDelay: `${i * stagger}ms` }}
        >
          {line}
        </span>
      ))}
    </p>
  );
}

/* ─────────────────────────────────────────────
   Theme toggle — half-filled circle, persists to
   localStorage, flips `data-theme` on <html>.
───────────────────────────────────────────── */
export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const current = (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'light';
    setTheme(current);
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try {
        localStorage.setItem('theme', next);
      } catch {
        /* storage unavailable — theme still applies for this session */
      }
      return next;
    });
  }, []);

  return (
    <button
      onClick={toggle}
      className="theme-toggle"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <svg width="17" height="17" viewBox="0 0 20 20" aria-hidden="true">
        <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M10 2 A8 8 0 0 1 10 18 Z" fill="currentColor" />
      </svg>
    </button>
  );
}

/* ─────────────────────────────────────────────
   Amber bars wipe up-then-away on nav jump.
───────────────────────────────────────────── */
export function useNavWipe() {
  const [wiping, setWiping] = useState(false);

  const play = useCallback((onMidpoint: () => void) => {
    setWiping(true);
    // fire the scroll at the moment the bars fully cover the screen
    window.setTimeout(onMidpoint, 420);
    window.setTimeout(() => setWiping(false), 900);
  }, []);

  const Wipe = (
    <div className={`wipe-root${wiping ? ' is-out' : ''}`} aria-hidden="true">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="wipe-bar" style={{ animationDelay: `${i * 45}ms` }} />
      ))}
    </div>
  );

  return { play, Wipe, wiping };
}

/* Scroll progress 0→100 for the rail under the nav */
export function useScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setPct(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return pct;
}
