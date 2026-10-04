'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface AnimatedNumberProps {
  value: number;
  formatter?: (val: number) => string;
  durationMs?: number;
  className?: string;
  livePolite?: boolean;
}

export function AnimatedNumber({
  value,
  formatter = (v) => Math.round(v).toLocaleString('en-IN'),
  durationMs = 380,
  className = '',
  livePolite = true,
}: AnimatedNumberProps) {
  const prefersReduced = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(value);
  const currentValRef = useRef(value);
  const targetValRef = useRef(value);
  const startTimeRef = useRef<number | null>(null);
  const startValRef = useRef(value);
  const animFrameRef = useRef<number | null>(null);

  // Debounced value for screen reader aria-live to avoid flooding
  const [debouncedAriaText, setDebouncedAriaText] = useState(formatter(value));

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedAriaText(formatter(value));
    }, 400);
    return () => clearTimeout(handler);
  }, [value, formatter]);

  useEffect(() => {
    targetValRef.current = value;

    if (prefersReduced || durationMs <= 0) {
      setDisplayValue(value);
      currentValRef.current = value;
      return;
    }

    startValRef.current = currentValRef.current;
    startTimeRef.current = null;

    const animate = (time: number) => {
      if (!startTimeRef.current) startTimeRef.current = time;
      const elapsed = time - startTimeRef.current;
      const progress = Math.min(1, elapsed / durationMs);

      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const next = startValRef.current + (targetValRef.current - startValRef.current) * ease;

      currentValRef.current = next;
      setDisplayValue(next);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(targetValRef.current);
        currentValRef.current = targetValRef.current;
      }
    };

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [value, durationMs, prefersReduced]);

  return (
    <span
      className={`tabular-nums inline-block transition-none ${className}`}
      aria-live={livePolite ? 'polite' : 'off'}
      aria-atomic="true"
    >
      <span className="sr-only">{debouncedAriaText}</span>
      <span aria-hidden="true">{formatter(displayValue)}</span>
    </span>
  );
}
