'use client';

import React, { useState, useMemo } from 'react';
import { calculateDelayCost } from '@/lib/calculations';
import { formatINR, formatPercent, formatYears } from '@/lib/format';
import { Slider } from '@/components/ui/Slider';

export function DelayTool() {
  const [monthly, setMonthly] = useState(20000);
  const [years, setYears] = useState(15);
  const [delayYears, setDelayYears] = useState(2);
  const [rate, setRate] = useState(0.12);

  const delayRes = useMemo(() => {
    return calculateDelayCost(monthly, rate, years, delayYears);
  }, [monthly, rate, years, delayYears]);

  return (
    <div className="pt-4 space-y-5 border-t border-border/80">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Slider
          id="delaytool-monthly"
          label="Monthly Target"
          min={2000}
          max={100000}
          step={1000}
          value={monthly}
          onChange={setMonthly}
          formatValue={(v) => formatINR(v)}
        />
        <Slider
          id="delaytool-delay"
          label="Years Postponed"
          min={1}
          max={Math.min(5, years - 1)}
          step={1}
          value={delayYears}
          onChange={setDelayYears}
          formatValue={(v) => `${v} yrs`}
        />
        <Slider
          id="delaytool-horizon"
          label="Horizon"
          min={5}
          max={25}
          step={1}
          value={years}
          onChange={setYears}
          formatValue={(v) => `${v} yrs`}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
        <div className="p-3 bg-bg-subtle rounded border border-border/80">
          <span className="text-ink-muted block text-[10px] uppercase">Starting Today</span>
          <span className="text-lg font-serif font-bold text-accent">
            {formatINR(delayRes.startNowFV, { compact: true })}
          </span>
          <span className="text-[10px] text-ink-faint block mt-0.5">
            Full {years} years of compounding
          </span>
        </div>
        <div className="p-3 bg-bg-subtle rounded border border-border/80">
          <span className="text-ink-muted block text-[10px] uppercase">
            Starting in {formatYears(delayYears)}
          </span>
          <span className="text-lg font-serif font-bold text-ink">
            {formatINR(delayRes.startLaterFV, { compact: true })}
          </span>
          <span className="text-[10px] text-ink-faint block mt-0.5">
            Compounding for {years - delayYears} years
          </span>
        </div>
        <div className="p-3 bg-red-50/70 rounded border border-red-200">
          <span className="text-red-800 block text-[10px] uppercase font-semibold">
            The Cost of Inaction
          </span>
          <span className="text-lg font-serif font-bold text-red-700">
            -{formatINR(delayRes.costOfDelay, { compact: true })}
          </span>
          <span className="text-[10px] text-red-600 block mt-0.5">
            {formatINR(delayRes.lostCompounding, { compact: true })} lost compounding
          </span>
        </div>
      </div>

      <p className="text-xs font-serif text-ink-muted leading-relaxed">
        Postponing your start date by {formatYears(delayYears)} only avoids {formatINR(delayRes.missedContributions, { compact: true })} in
        deposits, but robs you of {formatINR(delayRes.costOfDelay, { compact: true })} at maturity. Time is the one leverage you cannot buy back.
      </p>
    </div>
  );
}
