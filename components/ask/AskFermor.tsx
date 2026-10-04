'use client';

import React, { useState, useMemo } from 'react';
import { calculateEMI } from '@/lib/calculations';
import { formatINR, formatPercent } from '@/lib/format';
import { ASSUMPTIONS, SCENARIO_PRESETS } from '@/lib/constants';
import { Slider } from '../ui/Slider';
import { AnimatedNumber } from '../ui/AnimatedNumber';

export function AskFermor() {
  const [activePreset, setActivePreset] = useState<string>('car');

  // Input states
  const [income, setIncome] = useState<number>(ASSUMPTIONS.DEFAULT_SCENARIO.monthlyIncome);
  const [commitments, setCommitments] = useState<number>(ASSUMPTIONS.DEFAULT_SCENARIO.existingCommitments);
  const [assetPrice, setAssetPrice] = useState<number>(ASSUMPTIONS.DEFAULT_SCENARIO.assetPrice);
  const [downPayment, setDownPayment] = useState<number>(ASSUMPTIONS.DEFAULT_SCENARIO.downPayment);
  const [tenureYears, setTenureYears] = useState<number>(ASSUMPTIONS.DEFAULT_SCENARIO.tenureYears);
  const [rate, setRate] = useState<number>(ASSUMPTIONS.DEFAULT_SCENARIO.annualInterestRate);

  const [showMath, setShowMath] = useState<boolean>(false);

  // Switch preset scenarios
  const applyPreset = (presetId: string) => {
    const found = SCENARIO_PRESETS.find((p) => p.id === presetId);
    if (!found) return;
    setActivePreset(presetId);
    setIncome(found.income);
    setCommitments(found.commitments);
    setAssetPrice(found.price);
    setDownPayment(found.downPayment);
    setTenureYears(found.tenureYears);
    setRate(found.rate);
  };

  // Calculations
  const principal = Math.max(0, assetPrice - downPayment);
  const emiResult = useMemo(() => {
    return calculateEMI(principal, rate, tenureYears);
  }, [principal, rate, tenureYears]);

  const emiShareOfIncome = income > 0 ? emiResult.monthlyEMI / income : 0;
  const totalMonthlyDebt = emiResult.monthlyEMI + commitments;
  const totalDebtShareOfIncome = income > 0 ? totalMonthlyDebt / income : 0;

  // Alternate scenario: what if down payment increases by ₹2 Lakhs
  const alternateDownPayment = downPayment + Math.min(200000, assetPrice * 0.2);
  const alternatePrincipal = Math.max(0, assetPrice - alternateDownPayment);
  const alternateResult = useMemo(() => {
    return calculateEMI(alternatePrincipal, rate, tenureYears);
  }, [alternatePrincipal, rate, tenureYears]);
  const interestSavedWithExtraDown = emiResult.totalInterest - alternateResult.totalInterest;

  // Debt strain assessment
  const isHealthy = totalDebtShareOfIncome < ASSUMPTIONS.DTI_HEALTHY_THRESHOLD;
  const isStretched = totalDebtShareOfIncome >= ASSUMPTIONS.DTI_STRETCH_THRESHOLD;

  return (
    <section id="ask-fermor" className="py-12 md:py-16 bg-bg-subtle border-b border-border">
      <div className="max-w-container mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-8 md:mb-10">
          <h2 className="text-display-lg font-serif text-ink tracking-tight uppercase leading-tight">
            Ask Fermor. <br />
            <span className="italic font-normal lowercase tracking-normal">Structured answers</span> without black boxes.
          </h2>
          <p className="mt-3 text-base md:text-lg text-ink font-normal leading-relaxed">
            No conversational chatbot or streaming guesses. A deterministic decision model evaluating
            your true monthly commitments, reducing-balance interest, and realistic liquidity boundaries.
          </p>

          {/* Scenario Chips */}
          <div className="mt-5 flex flex-wrap gap-2.5 items-center">
            <span className="text-xs font-mono text-ink font-semibold uppercase mr-1">Preload scenario:</span>
            {SCENARIO_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset.id)}
                className={`text-xs font-mono px-3.5 py-1.5 rounded-sm border transition-colors ${
                  activePreset === preset.id
                    ? 'bg-accent text-bg border-accent font-semibold shadow-xs'
                    : 'bg-bg-white text-ink border-border hover:border-ink font-medium'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Two-Column Structured Worksheet */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Live Inputs Worksheet */}
          <div className="lg:col-span-6 bg-bg-white border border-border p-6 sm:p-8 rounded-md shadow-sm space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-border/80">
              <span className="text-xs font-mono uppercase tracking-wider text-ink font-medium">
                Decision Inputs
              </span>
              <span className="text-xs font-mono text-ink-faint">
                Live recalculation
              </span>
            </div>

            {/* Monthly Income */}
            <Slider
              id="ask-income"
              label="Net Monthly In-Hand Income"
              min={30000}
              max={400000}
              step={5000}
              value={income}
              onChange={setIncome}
              formatValue={(v) => formatINR(v)}
            />

            {/* Existing Obligations */}
            <Slider
              id="ask-commitments"
              label="Existing Commitments (Rent, Current EMIs, PF)"
              min={0}
              max={150000}
              step={2000}
              value={commitments}
              onChange={setCommitments}
              formatValue={(v) => formatINR(v)}
            />

            {/* Asset Price */}
            <Slider
              id="ask-price"
              label="Asset Price / Total Purchase Target"
              min={200000}
              max={15000000}
              step={50000}
              value={assetPrice}
              onChange={(p) => {
                setAssetPrice(p);
                if (downPayment >= p) setDownPayment(Math.round(p * 0.2));
              }}
              formatValue={(v) => formatINR(v, { compact: true })}
            />

            {/* Down Payment */}
            <Slider
              id="ask-down"
              label="Upfront Down Payment"
              min={0}
              max={assetPrice}
              step={25000}
              value={downPayment}
              onChange={setDownPayment}
              formatValue={(v) => formatINR(v, { compact: true })}
              hint={`Financed loan principal: ${formatINR(principal, { compact: true })}`}
            />

            {/* Grid for Rate and Tenure */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/80">
              <Slider
                id="ask-rate"
                label="Interest Rate"
                min={0.07}
                max={0.16}
                step={0.0025}
                value={rate}
                onChange={setRate}
                formatValue={(v) => formatPercent(v, 2)}
              />
              <Slider
                id="ask-tenure"
                label="Loan Tenure"
                min={1}
                max={30}
                step={1}
                value={tenureYears}
                onChange={setTenureYears}
                formatValue={(v) => `${v} years`}
              />
            </div>
          </div>

          {/* Right Column: Typographic Bank-Statement Style Ledger Answer */}
          <div className="lg:col-span-6 bg-bg-white border border-border p-6 sm:p-8 rounded-md shadow-sm">
            <div className="flex items-center justify-between pb-3.5 border-b border-border/80">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-accent font-semibold block">
                  The Honest Ledger
                </span>
                <span className="text-xs text-ink-muted font-medium">
                  Auditing full obligation solvency
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono uppercase text-ink font-semibold block">Principal</span>
                <span className="text-xs font-mono font-bold text-ink">
                  {formatINR(principal, { compact: true })}
                </span>
              </div>
            </div>

            {/* Primary Calculated Figures (Ruled lines) */}
            <div className="divide-y divide-border/80 my-5 text-sm">
              
              <div className="py-3 flex justify-between items-baseline">
                <span className="text-ink font-medium">Standalone Monthly EMI</span>
                <div className="text-right font-mono font-semibold text-ink tabular-nums">
                  <AnimatedNumber
                    value={emiResult.monthlyEMI}
                    formatter={(v) => formatINR(v)}
                    className="text-lg text-ink font-bold"
                  />
                  <span className="block text-xs text-ink-muted font-medium">
                    {formatPercent(emiShareOfIncome)} of income
                  </span>
                </div>
              </div>

              <div className="py-3 flex justify-between items-baseline">
                <div>
                  <span className="text-ink font-semibold">Total Monthly Debt Service</span>
                  <span className="block text-xs text-ink-muted font-medium">
                    EMI + existing commitments ({formatINR(commitments)})
                  </span>
                </div>
                <div className="text-right font-mono tabular-nums">
                  <AnimatedNumber
                    value={totalMonthlyDebt}
                    formatter={(v) => formatINR(v)}
                    className="text-xl text-ink font-bold"
                  />
                  <span
                    className={`block text-xs font-bold ${
                      isStretched
                        ? 'text-red-700'
                        : isHealthy
                        ? 'text-accent'
                        : 'text-amber-800'
                    }`}
                  >
                    {formatPercent(totalDebtShareOfIncome)} of monthly income
                  </span>
                </div>
              </div>

              <div className="py-3 flex justify-between items-baseline">
                <span className="text-ink font-medium">Total Interest Paid over {tenureYears} yrs</span>
                <span className="font-mono text-red-700 font-bold tabular-nums">
                  {formatINR(emiResult.totalInterest, { compact: true })}
                </span>
              </div>

              <div className="py-3 flex justify-between items-baseline">
                <span className="text-ink font-medium">Total Outlay (Principal + Interest)</span>
                <span className="font-mono text-ink font-bold tabular-nums">
                  {formatINR(emiResult.totalRepayment, { compact: true })}
                </span>
              </div>

            </div>

            {/* The Honest Insight Callout (40-50% rule of thumb) */}
            <div
              className={`p-4 rounded-sm border ${
                isStretched
                  ? 'bg-red-50/60 border-red-200 text-red-900'
                  : isHealthy
                  ? 'bg-accent-surface/70 border-accent/20 text-ink'
                  : 'bg-amber-50/60 border-amber-200 text-amber-900'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isStretched ? 'bg-red-600' : isHealthy ? 'bg-accent' : 'bg-amber-600'
                  }`}
                />
                <span className="text-xs font-mono uppercase tracking-wider font-semibold">
                  {isStretched
                    ? 'Debt Threshold Alert'
                    : isHealthy
                    ? 'Comfortable Debt Service'
                    : 'Moderate Debt Service'}
                </span>
              </div>

              <p className="text-xs sm:text-sm leading-relaxed font-serif">
                {isStretched ? (
                  <>
                    Standalone EMI ({formatPercent(emiShareOfIncome)}) appears deceptively affordable, but
                    your total fixed outlays reach <strong className="font-semibold">{formatPercent(totalDebtShareOfIncome)}</strong>.
                    Many financial planners and prudent lenders consider debt servicing above 40–50% of income as stretched,
                    severely restricting your ability to invest or absorb sudden emergencies.
                  </>
                ) : (
                  <>
                    Your total monthly debt service sits at <strong className="font-semibold">{formatPercent(totalDebtShareOfIncome)}</strong>{' '}
                    of your in-hand income, remaining well inside the standard 40% prudent guideline.
                  </>
                )}
              </p>
              <p className="mt-2 text-xs font-mono text-ink-muted">
                Note: 40–50% is a common benchmark rule of thumb across retail lenders, not a rigid verdict.
              </p>
            </div>

            {/* "What changes if" line */}
            <div className="mt-4 p-3.5 bg-bg-subtle rounded-sm border border-border flex items-start justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="font-mono text-ink uppercase text-[11px] font-semibold block">
                  Sensitivity Leverage
                </span>
                <span className="text-ink font-medium text-sm font-sans">
                  Adding {formatINR(alternateDownPayment - downPayment, { compact: true })} more down saves{' '}
                  <strong className="text-accent font-semibold">{formatINR(interestSavedWithExtraDown, { compact: true })}</strong> in total interest.
                </span>
              </div>
              <span className="font-mono text-accent text-right font-semibold shrink-0">
                EMI: {formatINR(alternateResult.monthlyEMI)}
              </span>
            </div>

            {/* "See the math" expander */}
            <div className="mt-4 pt-3 border-t border-border/80">
              <button
                type="button"
                onClick={() => setShowMath(!showMath)}
                className="text-xs font-mono text-ink font-semibold hover:text-accent flex items-center justify-between w-full"
              >
                <span>{showMath ? '[- Close formula breakdown]' : '[+ See the EMI math]'}</span>
                <span className="text-xs text-ink-muted font-normal">Indicative &bull; Not investment advice</span>
              </button>

              {showMath && (
                <div className="mt-3 p-3.5 bg-bg-subtle border border-border/80 rounded text-xs font-mono text-ink space-y-2">
                  <p className="font-semibold">EMI = P &times; r &times; (1 + r)^n / ((1 + r)^n - 1)</p>
                  <p className="text-ink-muted">
                    Where P = <strong className="text-ink">{formatINR(principal)}</strong>, r = <strong className="text-ink">{formatPercent(rate)} / 12</strong>, n = <strong className="text-ink">{tenureYears * 12} months</strong>.
                  </p>
                  <p className="text-xs text-ink-muted">
                    Projections are purely educational and illustrate standard reducing balance schedules.
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
