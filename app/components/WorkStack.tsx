'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useRef } from 'react';

export type WorkItem = {
  title: string;
  category: string;
  description: string;
  link: string;
  image: string;
  tag: string;
};

/* ─────────────────────────────────────────────
   Sticky card stack.

   Every card pins to the top of the viewport, so the
   next one slides over it. Cards already on the pile
   scale down from their top edge, which leaves each
   one peeking out above the card that covered it.
───────────────────────────────────────────── */

export default function WorkStack({ items }: { items: WorkItem[] }) {
  const container = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  return (
    <div ref={container} className="work-stack">
      {items.map((item, i) => (
        <StackCard
          key={item.title}
          item={item}
          index={i}
          total={items.length}
          progress={scrollYProgress}
        />
      ))}
    </div>
  );
}

function StackCard({
  item,
  index,
  total,
  progress,
}: {
  item: WorkItem;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  // the deeper a card ends up in the pile, the smaller it settles
  const targetScale = 1 - (total - index - 1) * 0.05;
  // it holds full size until the next card starts arriving
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);

  return (
    <div className="work-slot">
      <motion.a
        href={item.link}
        target="_blank"
        rel="noopener noreferrer"
        style={{ scale, top: index * 20 }}
        className="work-card"
      >
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, 62rem"
          className="object-cover object-top"
        />

        <span className="work-card-scrim" />

        <span className="work-card-open">
          <ArrowUpRight className="w-4 h-4" />
        </span>

        <span className="work-card-caption">
          <span className="work-card-meta flex items-center gap-3 mb-2">
            <span className="tag-pill">{item.tag}</span>
            <span className="text-[11px] font-bold tracking-widest text-white/50">
              {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
          </span>

          <span className="block text-xl sm:text-2xl font-bold text-white leading-tight">
            {item.title}
          </span>
          <span className="block text-sm text-white/60 mt-0.5">{item.category}</span>
          <span className="hidden sm:block text-sm text-white/75 mt-2 max-w-lg leading-relaxed">
            {item.description}
          </span>

          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white mt-3">
            Open project <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
        </span>
      </motion.a>
    </div>
  );
}
