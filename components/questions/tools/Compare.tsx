'use client';

import React, { useState, useMemo } from 'react';
import { compareInstruments } from '@/lib/calculations';
import { formatINR, formatPercent } from '@/lib/format';
import { Slider } from '@/components/ui/Slider';

export function CompareTool() {
  const [monthly, setMonthly] = useState(15000);
  const [years, setYears] = useState(10);

  const comparisons = useMemo(() => {
    return compareInstruments(monthly, years);
  }, [monthly, years]);

  return (
    <div className="pt-4 space-y-5 border-t border-border/80">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Slider
          id="compare-monthly"
          label="Monthly Investment"
          min={2000}
          max={100000}
          step={1000}
          value={monthly}
          onChange={setMonthly}
          formatValue={(v) => formatINR(v)}
        />
        <Slider
          id="compare-years"
          label="Time Horizon"
          min={3}
          max={25}
          step={1}
          value={years}
          onChange={setYears}
          formatValue={(v) => `${v} years`}
        />
      </div>

      {/* Comparisons Table */}
      <div className="overflow-x-auto border border-border rounded-sm">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-bg-subtle text-ink-muted border-b border-border">
            <tr>
              <th className="py-2.5 px-3 font-medium uppercase text-[10px]">Instrument</th>
              <th className="py-2.5 px-3 font-medium uppercase text-[10px]">Assumed Benchmark</th>
              <th className="py-2.5 px-3 font-medium uppercase text-[10px]">Tax Status</th>
              <th className="py-2.5 px-3 font-medium uppercase text-[10px] text-right">Projected Corpus</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 bg-bg-white">
            {comparisons.map((item) => (
              <tr key={item.id} className="hover:bg-bg-subtle/50 transition-colors">
                <td className="py-2.5 px-3 font-medium font-sans text-ink">
                  {item.name}
                  <span className="block text-[10px] font-mono text-ink-faint">
                    {item.volatilityNote}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-ink">
                  {formatPercent(item.assumedRate)}
                </td>
                <td className="py-2.5 px-3">
                  <span
                    className={`inline-block px-1.5 py-0.5 rounded text-[10px] ${
                      item.isTaxFree
                        ? 'bg-accent-surface text-accent'
                        : 'bg-bg-subtle text-ink-muted'
                    }`}
                  >
                    {item.isTaxFree ? 'EEE (Tax-free)' : 'Taxable per slab'}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right font-semibold text-accent">
                  {formatINR(item.futureValue, { compact: true })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-bg-subtle rounded text-[11px] text-ink-muted leading-relaxed">
        <strong>Important Caveat:</strong> Returns are historical illustrative assumptions (not guaranteed).
        Equity and gold experience multi-year volatility cycles; debt instruments offer stable capital preservation.
      </div>
    </div>
  );
}
