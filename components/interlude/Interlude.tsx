'use client';

import React from 'react';
import { useInView } from '@/hooks/useInView';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function Interlude() {
  const { ref, isInView } = useInView<HTMLDivElement>({ threshold: 0.25 });
  const prefersReduced = useReducedMotion();

  const lines = [
    { text: 'No jargon.', delay: '0ms' },
    { text: 'No black boxes.', delay: '140ms' },
    { text: 'Just the math.', delay: '280ms', highlight: true },
  ];

  return (
    <section
      ref={ref}
      className="py-12 md:py-16 bg-bg border-b border-border transition-colors relative overflow-hidden"
    >
      <div className="max-w-container mx-auto px-4 sm:px-6 md:px-8">
        <div className="max-w-3xl">
          <div className="space-y-1 sm:space-y-2">
            {lines.map((line, idx) => (
              <h2
                key={idx}
                style={{
                  transitionDelay: prefersReduced ? '0ms' : line.delay,
                }}
                className={`text-display-xl font-serif tracking-tight transition-all duration-700 ${
                  line.highlight ? 'italic text-accent' : 'text-ink'
                } ${
                  isInView || prefersReduced
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-6'
                }`}
              >
                {line.text}
              </h2>
            ))}
          </div>

          <div
            style={{
              transitionDelay: prefersReduced ? '0ms' : '420ms',
            }}
            className={`mt-6 pt-5 border-t border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm md:text-base text-ink transition-all duration-700 ${
              isInView || prefersReduced
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
          >
            <p className="max-w-lg leading-relaxed text-ink-muted">
              Every projection on Fermor discloses its underlying formula and assumptions.
              No sponsored funds, no proprietary black-box algorithms, no commissions.
            </p>
            <div className="font-mono text-xs uppercase tracking-wider text-accent font-semibold border border-accent/30 bg-accent-surface px-3 py-1.5 rounded-sm self-start sm:self-auto shrink-0 shadow-xs">
              Inspectable Models
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
