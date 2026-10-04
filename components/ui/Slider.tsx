'use client';

import React from 'react';

interface SliderProps {
  id: string;
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (val: number) => void;
  formatValue?: (val: number) => string;
  ariaLabel?: string;
  hint?: string;
  className?: string;
  ticks?: { value: number; label: string }[];
}

export function Slider({
  id,
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  formatValue = (v) => v.toString(),
  ariaLabel,
  hint,
  className = '',
  ticks,
}: SliderProps) {
  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-baseline justify-between">
        <label
          htmlFor={id}
          className="text-xs uppercase tracking-wider text-ink font-semibold select-none"
        >
          {label}
        </label>
        <span
          className="text-base sm:text-lg font-mono font-bold text-ink tabular-nums select-none"
          aria-hidden="true"
        >
          {formatValue(value)}
        </span>
      </div>

      <div className="relative py-2 flex items-center">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={ariaLabel || label}
          aria-valuetext={formatValue(value)}
          aria-valuenow={value}
          aria-valuemin={min}
          aria-valuemax={max}
          className="fermor-slider"
          style={{
            background: `linear-gradient(to right, #1F5C45 0%, #1F5C45 ${percentage}%, #DEDBD2 ${percentage}%, #DEDBD2 100%)`,
          }}
        />
      </div>

      {ticks && ticks.length > 0 && (
        <div className="flex justify-between text-xs text-ink font-medium tabular-nums px-0.5 select-none -mt-0.5">
          {ticks.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => onChange(t.value)}
              className="hover:text-accent transition-colors cursor-pointer py-1 underline-offset-2 hover:underline"
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {hint && (
        <p className="text-xs text-ink-muted leading-relaxed select-none">
          {hint}
        </p>
      )}
    </div>
  );
}
