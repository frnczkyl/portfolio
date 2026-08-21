'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';

/* ─────────────────────────────────────────────
   Circuit rail — the robot takes a long walk past
   the whole stack while the camera tracks him.

   The world is laid out in px. Only the slice of it
   near the camera is ever in the DOM, and what is lit
   is derived from the robot's position rather than
   toggled by hand, so a restart can't leave lights on.
───────────────────────────────────────────── */

type Item = { name: string; icon?: string; src?: string };

/* Ordered as a walk: languages → frontend → backend → data → cloud → tools → AI */
const STACK: Item[] = [
  { name: 'Java', icon: 'devicon-java-plain colored' },
  { name: 'Python', icon: 'devicon-python-plain colored' },
  { name: 'C', icon: 'devicon-c-plain colored' },
  { name: 'C++', icon: 'devicon-cplusplus-plain colored' },
  { name: 'C#', icon: 'devicon-csharp-plain colored' },
  { name: 'JavaScript', icon: 'devicon-javascript-plain colored' },
  { name: 'TypeScript', icon: 'devicon-typescript-plain colored' },
  { name: 'Kotlin', icon: 'devicon-kotlin-plain colored' },
  { name: 'HTML', icon: 'devicon-html5-plain colored' },
  { name: 'CSS', icon: 'devicon-css3-plain colored' },
  { name: 'SQL', icon: 'devicon-mysql-plain colored' },

  { name: 'React.js', icon: 'devicon-react-original colored' },
  { name: 'Next.js', icon: 'devicon-nextjs-plain' },
  { name: 'Svelte', icon: 'devicon-svelte-plain colored' },
  { name: 'Tailwind CSS', icon: 'devicon-tailwindcss-plain colored' },

  { name: 'Node.js', icon: 'devicon-nodejs-plain colored' },
  { name: 'Django', icon: 'devicon-django-plain' },
  { name: 'Prisma', icon: 'devicon-prisma-original' },

  { name: 'PostgreSQL', icon: 'devicon-postgresql-plain colored' },
  { name: 'MySQL', icon: 'devicon-mysql-plain colored' },
  { name: 'Supabase', icon: 'devicon-supabase-plain colored' },
  { name: 'Firebase', icon: 'devicon-firebase-plain colored' },
  { name: 'XAMPP', src: '/Xampp.svg' },

  { name: 'AWS', icon: 'devicon-amazonwebservices-plain-wordmark colored' },
  { name: 'Vercel', icon: 'devicon-vercel-plain' },
  { name: 'Railway', icon: 'devicon-railway-original' },
  { name: 'Docker', icon: 'devicon-docker-plain colored' },

  { name: 'Git', icon: 'devicon-git-plain colored' },
  { name: 'GitHub', icon: 'devicon-github-plain' },
  { name: 'Postman', icon: 'devicon-postman-plain colored' },
  { name: 'Bash', icon: 'devicon-bash-plain colored' },
  { name: 'PowerShell', icon: 'devicon-powershell-plain colored' },
  { name: 'Android', icon: 'devicon-android-plain colored' },
  { name: 'Godot', icon: 'devicon-godot-plain colored' },

  { name: 'Go High Level', src: '/GoHighLevel.svg' },
  { name: 'ServiceNow', src: '/ServiceNow.svg' },
  { name: 'Asana', src: '/Asana.svg' },

  { name: 'Claude', src: '/Claude.svg' },
  { name: 'Gemini', src: '/Gemini.svg' },
];

/* Co-prime-ish cycles so the skyline never visibly repeats.
   Fixed arrays, not random — server and client must agree exactly. */
const LIFTS = [0, 26, 8, 42, 14, 34, 0, 20, 46, 10, 30, 4];
const HEIGHTS = [34, 30, 38, 30, 36, 28, 32];
const RISES = [46, 30, 58, 22, 40, 52, 26, 36, 44];
const RUNS = [58, 42, 74, 34, 50];

const CHAR_W = 5.9;
const CHIP_EXTRA = 44; // icon + padding
const GAP = 92;
const LEAD = 150; // run-up before the first chip
const TAIL = 240;
const RAIL_Y = 32; // rail sits this far off the stage floor

type Node = Item & {
  i: number;
  w: number;
  x: number;
  h: number;
  lift: number;
  rise: number;
  run: number;
  dir: 1 | -1;
};

const NODES: Node[] = (() => {
  let x = LEAD;
  return STACK.map((it, i) => {
    const w = Math.round(it.name.length * CHAR_W + CHIP_EXTRA);
    const node: Node = {
      ...it,
      i,
      w,
      x: Math.round(x + w / 2),
      h: HEIGHTS[i % HEIGHTS.length],
      lift: LIFTS[i % LIFTS.length],
      rise: RISES[i % RISES.length],
      run: RUNS[i % RUNS.length],
      dir: i % 2 === 0 ? 1 : -1,
    };
    x += w + GAP;
    return node;
  });
})();

const LAST = NODES[NODES.length - 1];
const WORLD_W = LAST.x + Math.round(LAST.w / 2) + TAIL;

/* ── board furniture, sprinkled through the gaps between chips ── */
type DecorKind = 'resistor' | 'cap' | 'led' | 'lamp' | 'coil';

const DECOR_CYCLE: DecorKind[][] = [
  ['lamp'],
  ['resistor', 'led'],
  ['cap'],
  ['led', 'coil'],
  ['lamp', 'led'],
  ['resistor'],
  ['coil'],
  ['cap', 'led'],
  ['led'],
  ['lamp', 'resistor'],
  ['coil', 'led'],
];

const DECOR: { kind: DecorKind; x: number; key: string }[] = (() => {
  const out: { kind: DecorKind; x: number; key: string }[] = [];
  for (let i = 0; i < NODES.length - 1; i++) {
    const from = NODES[i].x + NODES[i].w / 2;
    const to = NODES[i + 1].x - NODES[i + 1].w / 2;
    const kinds = DECOR_CYCLE[i % DECOR_CYCLE.length];
    kinds.forEach((kind, k) => {
      const x = Math.round(from + ((k + 1) / (kinds.length + 1)) * (to - from));
      out.push({ kind, x, key: `${kind}-${x}` });
    });
  }
  return out;
})();

const MARK_WORDS = ['L3', 'D7', 'J1', 'Q5', 'R12', 'X1', 'U2', 'C9', 'K4', 'B8', 'T6', 'M2', 'P9'];
const MARKS = NODES.filter((_, i) => i % 3 === 0).map((n, k) => ({
  x: n.x,
  t: MARK_WORDS[k % MARK_WORDS.length],
}));

/* far parallax layer — a faint skyline that drifts slower than the board */
const FAR_PARALLAX = 0.34;
const FAR = (() => {
  const out: { x: number; h: number; w: number }[] = [];
  const span = Math.round(WORLD_W * FAR_PARALLAX) + 2200;
  const hs = [42, 88, 30, 120, 64, 36, 100, 52, 76, 28];
  const ws = [10, 18, 8, 14, 22, 12];
  for (let x = 0, i = 0; x < span; x += 84, i++) {
    out.push({ x, h: hs[i % hs.length], w: ws[i % ws.length] });
  }
  return out;
})();

const SPEED = 76; // px per second — the camera's pace
const WALK_MS = Math.round((WORLD_W / SPEED) * 1000);
const OFF_MS = 1300; // lights sweep back off, right to left
const DARK_MS = 1000; // beat in the dark, then cut back to the start
const TOTAL = WALK_MS + OFF_MS + DARK_MS;
const FOCUS = 0.36; // robot's resting position across the frame
const PAD = 340; // how far outside the frame we keep rendering
const NEVER = WORLD_W * 4; // "nothing has been switched off yet"
const STEP = 6; // px of travel per React update

/* Reduced motion as an external store, so nothing has to setState in an effect */
function usePrefersReducedMotion() {
  const subscribe = useCallback((onChange: () => void) => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false
  );
}

export default function CircuitRail() {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const reduced = usePrefersReducedMotion();

  // quantised so React updates ~13×/s while the CSS vars stay per-frame smooth
  const [bot, setBot] = useState(0);
  const [off, setOff] = useState(NEVER);
  const [vw, setVw] = useState(1280);

  useEffect(() => {
    const scene = sceneRef.current;
    const stage = stageRef.current;
    if (!scene || !stage) return;

    let width = stage.clientWidth || 1280;

    // fires once on observe(), so it seeds the width too
    const ro = new ResizeObserver(() => {
      width = stage.clientWidth || 1280;
      setVw(width);
    });
    ro.observe(stage);

    if (reduced) {
      scene.style.setProperty('--cam', '0px');
      scene.style.setProperty('--bot', `${WORLD_W}px`);
      scene.style.setProperty('--lit', `${WORLD_W}px`);
      return () => ro.disconnect();
    }

    let raf = 0;
    let t0 = 0;
    let visible = true;
    let lastBot = -1;
    let lastOff = -1;

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    io.observe(stage);

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (!visible) { t0 = 0; return; }
      if (!t0) t0 = now; // fresh pass on mount, and again after scrolling back in

      const t = (now - t0) % TOTAL;

      let b: number;
      let o: number;
      if (t < WALK_MS) {
        // the walk
        b = (t / WALK_MS) * WORLD_W;
        o = NEVER;
      } else {
        b = WORLD_W;
        // power-down: the darkness front runs back across everything on screen
        const k = Math.min(1, (t - WALK_MS) / OFF_MS);
        o = WORLD_W - k * (width + PAD);
      }

      const cam = Math.max(0, Math.min(b - width * FOCUS, WORLD_W - width));
      const lit = Math.min(b, o);

      scene.style.setProperty('--cam', `${cam}px`);
      scene.style.setProperty('--bot', `${b}px`);
      scene.style.setProperty('--lit', `${lit}px`);
      scene.classList.toggle('is-cut', t > WALK_MS + OFF_MS + 200);

      const qb = Math.round(b / STEP) * STEP;
      const qo = o === NEVER ? NEVER : Math.round(o / STEP) * STEP;
      if (qb !== lastBot) { lastBot = qb; setBot(qb); }
      if (qo !== lastOff) { lastOff = qo; setOff(qo); }
    };

    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); };
  }, [reduced]);

  // with reduced motion there is no walk — the board just reads as fully powered
  const botNow = reduced ? WORLD_W : bot;
  const offNow = reduced ? NEVER : off;

  const cam = reduced ? 0 : Math.max(0, Math.min(botNow - vw * FOCUS, WORLD_W - vw));
  const from = cam - PAD;
  const to = cam + vw + PAD;
  const isLit = (x: number) => x <= botNow && x < offNow;

  const farCam = cam * FAR_PARALLAX;
  const nodes = NODES.filter((n) => n.x > from && n.x < to);
  const decor = DECOR.filter((d) => d.x > from && d.x < to);
  const marks = MARKS.filter((m) => m.x > from && m.x < to);
  const towers = FAR.filter((f) => f.x > farCam - PAD && f.x < farCam + vw + PAD);

  const activeNode = NODES.reduce<Node | null>((acc, n) => (isLit(n.x) ? n : acc), null);

  return (
    <div className="circuit">
      {/* caption reads out whichever kit the robot just powered */}
      <div className="circuit-head">
        <span className="circuit-head-no">{String((activeNode ? activeNode.i : -1) + 1).padStart(2, '0')}</span>
        <span className="circuit-head-name" key={activeNode?.name ?? 'idle'}>
          {activeNode?.name ?? 'Stack'}
        </span>
        <span className="circuit-head-sub">Daily kit</span>
      </div>

      <div className="circuit-stage" ref={stageRef} aria-hidden>
        <div className="scene" ref={sceneRef}>
          <div className="scene-far">
            {towers.map((f) => (
              <span key={f.x} className="far-tower" style={{ left: f.x, width: f.w, height: f.h }} />
            ))}
          </div>

          <div className="scene-ticks" />
          <div className="scene-line" />
          <div className="scene-line-lit" />

          <div className="scene-mid">
            {decor.map((d) => (
              <Decor key={d.key} kind={d.kind} x={d.x} lit={isLit(d.x)} />
            ))}

            {nodes.map((n) => (
              <Chip key={n.name} node={n} lit={isLit(n.x)} />
            ))}

            {marks.map((m) => (
              <span
                key={m.t + m.x}
                className={`scene-mark${isLit(m.x) ? ' is-lit' : ''}`}
                style={{ left: m.x }}
              >
                {m.t}
              </span>
            ))}
          </div>

          <Robot />
        </div>
      </div>
    </div>
  );
}

/* ── one stack chip, on its pole, with a trace running off the top ── */
function Chip({ node, lit }: { node: Node; lit: boolean }) {
  const bottom = RAIL_Y + node.lift;
  const top = bottom + node.h;
  const on = lit ? ' is-lit' : '';

  return (
    <>
      {node.lift > 0 && (
        <span
          className={`chip-pole${on}`}
          style={{ left: node.x, height: node.lift, bottom: RAIL_Y }}
        />
      )}

      <span
        className={`chip-trace${on}`}
        style={{
          left: node.x,
          bottom: top,
          height: node.rise,
          width: node.run,
          transform: node.dir === 1 ? undefined : 'scaleX(-1)',
        }}
      >
        <span className="tr-rise" />
        <span className="tr-run" />
        <span className="tr-pad" />
      </span>

      <div className={`chip${on}`} style={{ left: node.x, bottom, minWidth: node.w, height: node.h }}>
        {node.src ? (
          <Image className="chip-icon" src={node.src} alt="" width={13} height={13} loading="eager" />
        ) : (
          <i className={`chip-icon ${node.icon}`} />
        )}
        <span className="chip-name">{node.name}</span>
      </div>
    </>
  );
}

/* ── the walker ── */
function Robot() {
  return (
    <div className="robot">
      <span className="robot-glow" />
      <span className="robot-antenna" />
      <span className="robot-head">
        <span className="robot-eye" />
        <span className="robot-eye" />
      </span>
      <span className="robot-body">
        <span className="robot-core" />
      </span>
      <span className="robot-arm robot-arm-l" />
      <span className="robot-arm robot-arm-r" />
      <span className="robot-leg robot-leg-l" />
      <span className="robot-leg robot-leg-r" />
    </div>
  );
}

/* ── board furniture ── */
function Decor({ kind, x, lit }: { kind: DecorKind; x: number; lit: boolean }) {
  const cls = `circuit-part circuit-${kind}${lit ? ' is-lit' : ''}`;
  const style = { left: x };

  if (kind === 'led') return <span className={cls} style={style} />;

  if (kind === 'lamp') {
    return (
      <span className={cls} style={style}>
        <span className="lamp-post" />
        <span className="lamp-arm" />
        <span className="lamp-head" />
      </span>
    );
  }

  if (kind === 'resistor') {
    return (
      <span className={cls} style={style}>
        <svg viewBox="0 0 34 14">
          <path d="M0 7h6M28 7h6" vectorEffect="non-scaling-stroke" />
          <rect x="6" y="2" width="22" height="10" rx="2" vectorEffect="non-scaling-stroke" />
          <path d="M12 3v8M17 3v8M22 3v8" vectorEffect="non-scaling-stroke" />
        </svg>
      </span>
    );
  }

  if (kind === 'coil') {
    return (
      <span className={cls} style={style}>
        <svg viewBox="0 0 40 12">
          <path d="M2 10h3a4 4 0 0 1 8 0a4 4 0 0 1 8 0a4 4 0 0 1 8 0h3" vectorEffect="non-scaling-stroke" />
        </svg>
      </span>
    );
  }

  // capacitor
  return (
    <span className={cls} style={style}>
      <svg viewBox="0 0 18 20">
        <path d="M9 20V15" vectorEffect="non-scaling-stroke" />
        <path d="M2 15V9a7 7 0 0 1 14 0v6z" vectorEffect="non-scaling-stroke" />
      </svg>
    </span>
  );
}
