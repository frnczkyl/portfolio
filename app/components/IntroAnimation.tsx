'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const TOTAL_DOTS = 160;
const APPEAR_STAGGER = 18;
const HOLD_MS = 2800;
const DISAPPEAR_STAGGER = 16;
const FADE_IN_RATE = 0.045;
const FADE_OUT_RATE = 0.055;

// Dots start disappearing at ~6180ms — start letter exit just before so they fade together
const TEXT_IN_MS = 700;
const TEXT_EXIT_MS = 5900;
const TEXT_GONE_MS = TEXT_EXIT_MS + 1800;

const LINE1 = 'Welcome to my';
const LINE2 = 'Portfolio';

interface Dot {
  x: number; y: number; r: number;
  targetOpacity: number; currentOpacity: number;
  phase: 'waiting' | 'in' | 'hold' | 'out' | 'gone';
  appearAt: number;
  disappearAt: number;
}

export default function IntroAnimation({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hidden, setHidden] = useState(false);
  const [showText, setShowText] = useState(false);
  const [textExiting, setTextExiting] = useState(false);
  const calledDone = useRef(false);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const t1 = setTimeout(() => setShowText(true), TEXT_IN_MS);
    const t2 = setTimeout(() => setTextExiting(true), TEXT_EXIT_MS);
    const t3 = setTimeout(() => setShowText(false), TEXT_GONE_MS);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = (canvas.width = window.innerWidth);
    const H = (canvas.height = window.innerHeight);

    const totalAppearMs = TOTAL_DOTS * APPEAR_STAGGER + 500;
    const disappearStartMs = totalAppearMs + HOLD_MS;

    const appearTimes = new Array<number>(TOTAL_DOTS);
    const disappearTimes = new Array<number>(TOTAL_DOTS);
    const indices = Array.from({ length: TOTAL_DOTS }, (_, i) => i);

    [...indices].sort(() => Math.random() - 0.5)
      .forEach((di, pos) => { appearTimes[di] = pos * APPEAR_STAGGER; });
    [...indices].sort(() => Math.random() - 0.5)
      .forEach((di, pos) => { disappearTimes[di] = disappearStartMs + pos * DISAPPEAR_STAGGER; });

    const dots: Dot[] = Array.from({ length: TOTAL_DOTS }, (_, i) => ({
      x: Math.random() * (W - 60) + 30,
      y: Math.random() * (H - 60) + 30,
      r: Math.random() < 0.15 ? Math.random() * 2 + 2.5 : Math.random() * 1.2 + 0.8,
      targetOpacity: Math.random() * 0.4 + 0.3,
      currentOpacity: 0,
      phase: 'waiting' as const,
      appearAt: appearTimes[i],
      disappearAt: disappearTimes[i],
    }));

    const startTime = performance.now();
    let animId: number;

    function draw(now: number) {
      const elapsed = now - startTime;
      ctx!.clearRect(0, 0, W, H);
      let goneCount = 0;

      for (const d of dots) {
        if (d.phase === 'waiting' && elapsed >= d.appearAt) d.phase = 'in';
        if ((d.phase === 'in' || d.phase === 'hold') && elapsed >= d.disappearAt) d.phase = 'out';

        if (d.phase === 'in') {
          d.currentOpacity = Math.min(d.currentOpacity + FADE_IN_RATE, d.targetOpacity);
          if (d.currentOpacity >= d.targetOpacity) d.phase = 'hold';
        } else if (d.phase === 'out') {
          d.currentOpacity = Math.max(d.currentOpacity - FADE_OUT_RATE, 0);
          if (d.currentOpacity <= 0) d.phase = 'gone';
        } else if (d.phase === 'gone') {
          goneCount++;
        }

        if (d.currentOpacity > 0.005) {
          ctx!.beginPath();
          ctx!.arc(d.x, d.y, d.r, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(255,255,255,${d.currentOpacity.toFixed(3)})`;
          ctx!.fill();
        }
      }

      if (goneCount === TOTAL_DOTS && !calledDone.current) {
        calledDone.current = true;
        setHidden(true);
        onDoneRef.current();
        return;
      }
      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, []);

  if (hidden) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: '#050505', overflow: 'hidden' }}>
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />

      {showText && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          {/* "Welcome to my" — slides in from right, fades letter-by-letter */}
          <motion.div
            initial={{ x: '110vw' }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', stiffness: 55, damping: 13 }}
            style={{ display: 'flex', marginBottom: '0.35rem' }}
          >
            {LINE1.split('').map((char, i) => (
              <motion.span
                key={i}
                animate={{ opacity: textExiting ? 0 : 1 }}
                transition={{ duration: 0.35, delay: textExiting ? i * 0.05 : 0, ease: 'easeIn' }}
                style={{
                  display: 'inline-block',
                  color: 'rgba(255,255,255,0.45)',
                  fontSize: 'clamp(0.9rem, 2.8vw, 2rem)',
                  fontWeight: 300,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                }}
              >
                {char === ' ' ? ' ' : char}
              </motion.span>
            ))}
          </motion.div>

          {/* "Portfolio" — slides in from left, fades letter-by-letter after line 1 */}
          <motion.div
            initial={{ x: '-110vw' }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', stiffness: 55, damping: 13, delay: 0.15 }}
            style={{ display: 'flex' }}
          >
            {LINE2.split('').map((char, i) => (
              <motion.span
                key={i}
                animate={{ opacity: textExiting ? 0 : 1 }}
                transition={{
                  duration: 0.35,
                  delay: textExiting ? LINE1.length * 0.05 + i * 0.06 : 0,
                  ease: 'easeIn',
                }}
                style={{
                  display: 'inline-block',
                  color: '#ffffff',
                  fontSize: 'clamp(2.8rem, 9vw, 7.5rem)',
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
}
