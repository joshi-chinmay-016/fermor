'use client';

import React, { useState, useMemo } from 'react';
import { calculateEMI, calculateLoanRateSavings } from '@/lib/calculations';
import { formatINR, formatPercent } from '@/lib/format';
import { Slider } from '@/components/ui/Slider';

export function LoanCostTool() {
  const [loanAmount, setLoanAmount] = useState(4500000); // 45L Home loan
  const [rate, setRate] = useState(0.09); // 9.0%
  const [tenureYears, setTenureYears] = useState(20);

  const emiRes = useMemo(() => {
    return calculateEMI(loanAmount, rate, tenureYears);
  }, [loanAmount, rate, tenureYears]);

  const sensitivity = useMemo(() => {
    return calculateLoanRateSavings(loanAmount, rate, tenureYears, 0.01);
  }, [loanAmount, rate, tenureYears]);

  return (
    <div className="pt-4 space-y-5 border-t border-border/80">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Slider
          id="loancost-principal"
          label="Loan Amount"
          min={500000}
          max={15000000}
          step={100000}
          value={loanAmount}
          onChange={setLoanAmount}
          formatValue={(v) => formatINR(v, { compact: true })}
        />
        <Slider
          id="loancost-rate"
          label="Current Rate"
          min={0.07}
          max={0.15}
          step={0.0025}
          value={rate}
          onChange={setRate}
          formatValue={(v) => formatPercent(v, 2)}
        />
        <Slider
          id="loancost-tenure"
          label="Tenure"
          min={3}
          max={30}
          step={1}
          value={tenureYears}
          onChange={setTenureYears}
          formatValue={(v) => `${v} yrs`}
        />
      </div>

      {/* Main Loan Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
        <div className="p-3 bg-bg-subtle rounded border border-border/80">
          <span className="text-ink-muted block text-[10px] uppercase">Monthly EMI</span>
          <span className="text-lg font-serif font-bold text-ink">
            {formatINR(emiRes.monthlyEMI)}
          </span>
        </div>
        <div className="p-3 bg-bg-subtle rounded border border-border/80">
          <span className="text-ink-muted block text-[10px] uppercase">Total Interest Outflow</span>
          <span className="text-lg font-serif font-bold text-red-700">
            {formatINR(emiRes.totalInterest, { compact: true })}
          </span>
          <span className="text-[10px] text-ink-faint block mt-0.5">
            {(emiRes.interestToPrincipalRatio * 100).toFixed(0)}% of borrowed principal
          </span>
        </div>
        <div className="p-3 bg-bg-subtle rounded border border-border/80">
          <span className="text-ink-muted block text-[10px] uppercase">Total Cash Repaid</span>
          <span className="text-lg font-serif font-bold text-ink">
            {formatINR(emiRes.totalRepayment, { compact: true })}
          </span>
        </div>
      </div>

      {/* 1% Reduction Savings Banner */}
      <div className="p-4 bg-accent-surface rounded border border-accent/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="font-mono text-accent uppercase tracking-wider text-[11px] font-semibold block mb-0.5">
            The 1% Refinance Arbitrage
          </span>
          <p className="text-ink font-serif text-sm">
            Negotiating or transferring your loan to a 1.0% lower rate ({formatPercent(rate - 0.01, 2)}) saves{' '}
            <strong className="text-accent font-semibold">{formatINR(sensitivity.totalSavings, { compact: true })}</strong> in total interest.
          </p>
        </div>
        <div className="shrink-0 text-right font-mono">
          <span className="text-accent font-bold text-base block">
            -{formatINR(sensitivity.monthlySavings)} / mo
          </span>
          <span className="text-[10px] text-ink-muted">Lower monthly EMI</span>
        </div>
      </div>
    </div>
  );
}
