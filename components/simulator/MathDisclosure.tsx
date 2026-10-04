'use client';

import React, { useState } from 'react';
import { formatINR, formatPercent } from '@/lib/format';

interface MathDisclosureProps {
  monthlyInvestment: number;
  annualReturn: number;
  years: number;
  delayYears: number;
  inflationAdjusted: boolean;
  inflationRate: number;
  futureValue: number;
  investedAmount: number;
}

export function MathDisclosure({
  monthlyInvestment,
  annualReturn,
  years,
  delayYears,
  inflationAdjusted,
  inflationRate,
  futureValue,
  investedAmount,
}: MathDisclosureProps) {
  const [isOpen, setIsOpen] = useState(false);

  const effectiveYears = Math.max(0, years - delayYears);
  const n = effectiveYears * 12;
  const r = annualReturn / 12;
  const rPercent = (r * 100).toFixed(4);

  return (
    <div className="mt-8 border-t border-border/80 pt-4">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center justify-between w-full py-2 text-left focus:outline-none"
        aria-expanded={isOpen}
      >
        <span className="text-xs font-mono uppercase tracking-wider text-ink font-semibold group-hover:text-accent transition-colors flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          <span>Show the math behind these figures</span>
        </span>
        <span className="text-xs font-mono text-ink font-medium group-hover:text-accent transition-colors">
          {isOpen ? '[- Hide formula]' : '[+ Inspect substitution]'}
        </span>
      </button>

      {isOpen && (
        <div className="mt-4 p-5 bg-bg-white border border-border rounded-sm space-y-4 text-xs font-mono text-ink">
          <div>
            <div className="text-ink font-semibold text-xs uppercase tracking-wider mb-1.5">
              1. Future Value of Monthly SIP (Annuity Due)
            </div>
            <div className="p-2.5 bg-bg-subtle border border-border/80 rounded text-ink font-semibold overflow-x-auto">
              FV = P &times; [((1 + r)^n - 1) / r] &times; (1 + r)
            </div>
            <p className="mt-2 text-ink-muted leading-relaxed">
              Where <strong className="text-ink font-semibold">P</strong> = monthly contribution ({formatINR(monthlyInvestment)}),{' '}
              <strong className="text-ink font-semibold">r</strong> = monthly return rate ({formatPercent(annualReturn)} / 12 = {rPercent}%),{' '}
              and <strong className="text-ink font-semibold">n</strong> = total months ({effectiveYears} years &times; 12 = {n} months).
            </p>
          </div>

          <div className="pt-2 border-t border-border/60">
            <div className="text-ink font-semibold text-xs uppercase tracking-wider mb-1.5">
              2. Numbers Substituted
            </div>
            <div className="p-2.5 bg-bg-subtle border border-border/80 rounded text-ink font-medium overflow-x-auto leading-relaxed">
              FV = {monthlyInvestment} &times; [((1 + {(r).toFixed(6)})^{n} - 1) / {(r).toFixed(6)}] &times; (1 + {(r).toFixed(6)})
              <br />
              FV = <strong className="text-accent font-bold text-sm">{formatINR(futureValue)}</strong> (Principal: <strong className="text-ink">{formatINR(investedAmount)}</strong>)
            </div>
          </div>

          {delayYears > 0 && (
            <div className="pt-2 border-t border-border/60">
              <div className="text-ink font-semibold text-xs uppercase tracking-wider mb-1.5">
                3. Cost of {delayYears}-Year Delay
              </div>
              <p className="text-ink-muted leading-relaxed">
                Waiting {delayYears} years reduces compounding duration from {years} years to {effectiveYears} years.
                Missed deposits equal {formatINR(monthlyInvestment * delayYears * 12)}, but forgone compounding turns the total cost into a substantial gap.
              </p>
            </div>
          )}

          {inflationAdjusted && (
            <div className="pt-2 border-t border-border/60">
              <div className="text-ink font-semibold text-xs uppercase tracking-wider mb-1.5">
                4. Inflation Deflator
              </div>
              <div className="p-2.5 bg-bg-subtle border border-border/80 rounded text-ink font-medium overflow-x-auto">
                Real Value = Nominal FV / (1 + {formatPercent(inflationRate)})^{years}
              </div>
              <p className="mt-1.5 text-ink-muted leading-relaxed">
                Deflated by {formatPercent(inflationRate)} compounding annually to reflect actual purchasing power in today’s rupees.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
