'use client';

import { useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

type Cert = { name: string; image: string; link: string };

const SPEED_DRAG = -0.1;

export default function CertCarousel({ certs }: { certs: Cert[] }) {
  const n = certs.length;
  const progressRef = useRef(0);
  const activeRef  = useRef(0);   // source of truth for current index
  const isDownRef  = useRef(false);
  const startXRef  = useRef(0);
  const itemRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Apply CSS custom properties directly to the DOM elements.
  // Accepts an optional `targetActive` to bypass the progress calculation
  // (avoids floating-point drift on click/button navigation).
  const applyFrame = useCallback((targetActive?: number) => {
    progressRef.current = Math.max(0, Math.min(progressRef.current, 100));
    const active =
      targetActive !== undefined
        ? targetActive
        : n > 1
          ? Math.floor((progressRef.current / 100) * (n - 1))
          : 0;
    activeRef.current = active;

    itemRefs.current.forEach((item, i) => {
      if (!item) return;
      const z = i === active ? n : n - Math.abs(active - i);
      item.style.setProperty('--zIndex', String(z));
      item.style.setProperty('--active', String((i - active) / n));
      item.style.zIndex = String(z);
    });
  }, [n]);

  const handleDown = useCallback((e: MouseEvent | TouchEvent) => {
    isDownRef.current = true;
    startXRef.current = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
  }, []);

  const handleMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDownRef.current) return;
    const x = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
    progressRef.current += (x - startXRef.current) * SPEED_DRAG;
    startXRef.current = x;
    applyFrame();
  }, [applyFrame]);

  const handleUp = useCallback(() => { isDownRef.current = false; }, []);

  useEffect(() => {
    applyFrame();
    const el = containerRef.current;
    if (!el) return;

    el.addEventListener('mousedown', handleDown as EventListener);
    window.addEventListener('mousemove', handleMove as EventListener);
    window.addEventListener('mouseup', handleUp);
    el.addEventListener('touchstart', handleDown as EventListener, { passive: true });
    window.addEventListener('touchmove', handleMove as EventListener, { passive: true });
    window.addEventListener('touchend', handleUp);

    return () => {
      el.removeEventListener('mousedown', handleDown as EventListener);
      window.removeEventListener('mousemove', handleMove as EventListener);
      window.removeEventListener('mouseup', handleUp);
      el.removeEventListener('touchstart', handleDown as EventListener);
      window.removeEventListener('touchmove', handleMove as EventListener);
      window.removeEventListener('touchend', handleUp);
    };
  }, [applyFrame, handleDown, handleMove, handleUp]);

  // Navigate by clicking a card — sets progress AND passes the exact index
  const goToIndex = useCallback((i: number) => {
    progressRef.current = n > 1 ? (i / (n - 1)) * 100 : 0;
    applyFrame(i);
  }, [applyFrame, n]);

  // Prev / next buttons — use activeRef so index never drifts
  const go = useCallback((dir: 1 | -1) => {
    const next = Math.max(0, Math.min(n - 1, activeRef.current + dir));
    goToIndex(next);
  }, [goToIndex, n]);

  return (
    <div className="cc-wrap">
      <div ref={containerRef} className="cc-carousel">
        {certs.map((cert, i) => (
          <div
            key={cert.name}
            ref={el => { itemRefs.current[i] = el; }}
            className="cc-item"
            style={{ '--items': n } as React.CSSProperties}
            onClick={() => goToIndex(i)}
          >
            <div className="cc-box">
              <Image src={cert.image} alt={cert.name} fill className="object-contain" />
              <div className="cc-overlay" />
            </div>
            <span className="cc-num">{String(i + 1).padStart(2, '0')}</span>
            <p className="cc-title">{cert.name}</p>
            <a
              href={cert.link}
              target="_blank"
              rel="noopener noreferrer"
              className="cc-link"
              onClick={e => e.stopPropagation()}
            >
              <ExternalLink size={11} />
              View
            </a>
          </div>
        ))}
      </div>

      <div className="cc-nav">
        <button onClick={() => go(-1)} className="cc-nav-btn" aria-label="Previous">
          <ChevronLeft size={18} />
        </button>
        <span className="cc-hint">drag to explore</span>
        <button onClick={() => go(1)} className="cc-nav-btn" aria-label="Next">
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
