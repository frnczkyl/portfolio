'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number; y: number; size: number; opacity: number;
  vx: number; vy: number;
  baseVx: number; baseVy: number;
  opacityDir: number; opacitySpeed: number; maxOpacity: number;
}

interface Spark {
  x: number; y: number; r: number; opacity: number; vx: number; vy: number;
}

function makeParticle(w: number, h: number): Particle {
  const size = Math.random() < 0.15
    ? Math.random() * 3 + 2
    : Math.random() * 1.5 + 0.4;
  const speed = size > 2 ? 0.06 : 0.14;
  const bvx = (Math.random() - 0.5) * speed;
  const bvy = (Math.random() - 0.5) * speed;
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    size,
    opacity: Math.random() * 0.25 + 0.04,
    vx: bvx, vy: bvy,
    baseVx: bvx, baseVy: bvy,
    opacityDir: Math.random() > 0.5 ? 1 : -1,
    opacitySpeed: Math.random() * 0.003 + 0.001,
    maxOpacity: size > 2 ? 0.35 : 0.5,
  };
}

export default function DotBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particles: Particle[] = [];
    let sparks: Spark[] = [];

    function init() {
      const w = canvas!.width, h = canvas!.height;
      const count = Math.min(Math.floor((w * h) / 5500), 350);
      particles = Array.from({ length: count }, () => makeParticle(w, h));
    }

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      init();
    }

    function explode(cx: number, cy: number) {
      const RADIUS = 170;
      for (const p of particles) {
        const dx = p.x - cx, dy = p.y - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < RADIUS && dist > 0) {
          const force = ((RADIUS - dist) / RADIUS) ** 1.4 * 6;
          const ang = Math.atan2(dy, dx);
          p.vx += Math.cos(ang) * force;
          p.vy += Math.sin(ang) * force;
        }
      }
      // Burst of sparks radiating outward
      const count = 28 + Math.floor(Math.random() * 10);
      for (let i = 0; i < count; i++) {
        const ang = (i / count) * Math.PI * 2 + Math.random() * 0.5;
        const speed = Math.random() * 5.5 + 1.5;
        sparks.push({
          x: cx, y: cy,
          r: Math.random() * 2.8 + 0.5,
          opacity: Math.random() * 0.55 + 0.45,
          vx: Math.cos(ang) * speed,
          vy: Math.sin(ang) * speed,
        });
      }
    }

    function onPointerDown(e: PointerEvent) {
      explode(e.clientX, e.clientY);
    }

    function draw() {
      const w = canvas!.width, h = canvas!.height;
      ctx!.clearRect(0, 0, w, h);

      // Ambient particles
      for (const p of particles) {
        p.vx += (p.baseVx - p.vx) * 0.045;
        p.vy += (p.baseVy - p.vy) * 0.045;
        p.x += p.vx;
        p.y += p.vy;

        p.opacity += p.opacityDir * p.opacitySpeed;
        if (p.opacity >= p.maxOpacity) { p.opacity = p.maxOpacity; p.opacityDir = -1; }
        if (p.opacity <= 0.02) { p.opacity = 0.02; p.opacityDir = 1; }

        if (p.x < -6) p.x = w + 6;
        if (p.x > w + 6) p.x = -6;
        if (p.y < -6) p.y = h + 6;
        if (p.y > h + 6) p.y = -6;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(255,255,255,${p.opacity.toFixed(3)})`;
        ctx!.fill();
      }

      // Sparks (click burst)
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx; s.y += s.vy;
        s.vx *= 0.87; s.vy *= 0.87;
        s.opacity -= 0.022;
        if (s.opacity <= 0) { sparks.splice(i, 1); continue; }
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(255,255,255,${s.opacity.toFixed(3)})`;
        ctx!.fill();
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener('resize', resize);
    document.addEventListener('pointerdown', onPointerDown);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', zIndex: -1, background: '#050505' }}
    />
  );
}
