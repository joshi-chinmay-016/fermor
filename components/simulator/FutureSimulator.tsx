'use client';

import React, { useState, useMemo } from 'react';
import { calculateSIP, calculateDelayCost, calculateInflationAdjusted } from '@/lib/calculations';
import { formatINR, formatPercent, formatYears } from '@/lib/format';
import { ASSUMPTIONS } from '@/lib/constants';
import { Slider } from '../ui/Slider';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import { Trajectory } from '../hero/Trajectory';
import { MathDisclosure } from './MathDisclosure';

export function FutureSimulator() {
  // Baseline initial values (for the Ghost line)
  const baselineMonthly = 5000;
  const baselineReturn = 0.12;
  const baselineYears = 10;

  // Active state variables
  const [monthly, setMonthly] = useState<number>(15000);
  const [annualReturn, setAnnualReturn] = useState<number>(baselineReturn);
  const [years, setYears] = useState<number>(baselineYears);
  const [delayYears, setDelayYears] = useState<number>(0);
  const [inflationAdjusted, setInflationAdjusted] = useState<boolean>(false);
  const inflationRate = ASSUMPTIONS.DEFAULT_INFLATION_RATE;

  // Baseline curve (ghost line)
  const baselineResult = useMemo(() => {
    return calculateSIP(baselineMonthly, baselineReturn, baselineYears);
  }, []);

  // Live active curve
  const effectiveYears = Math.max(1, years - delayYears);
  const activeResult = useMemo(() => {
    const raw = calculateSIP(monthly, annualReturn, effectiveYears);
    
    // If delayed, pad the first delayYears with 0 in trajectory for chart alignment
    let alignedTrajectory = raw.trajectory;
    if (delayYears > 0) {
      const delayOffsetTrajectory = [];
      for (let y = 0; y < delayYears; y++) {
        delayOffsetTrajectory.push({ month: y * 12, year: y, invested: 0, value: 0 });
      }
      raw.trajectory.forEach((pt) => {
        delayOffsetTrajectory.push({
          month: pt.month + delayYears * 12,
          year: +(pt.year + delayYears).toFixed(1),
          invested: pt.invested,
          value: pt.value,
        });
      });
      alignedTrajectory = delayOffsetTrajectory;
    }

    if (!inflationAdjusted) {
      return { ...raw, trajectory: alignedTrajectory };
    }

    // Apply inflation discount
    const adjustedFV = calculateInflationAdjusted(raw.futureValue, inflationRate, years);
    const adjustedTrajectory = alignedTrajectory.map((pt) => ({
      ...pt,
      value: calculateInflationAdjusted(pt.value, inflationRate, pt.year),
    }));

    return {
      investedAmount: raw.investedAmount,
      futureValue: adjustedFV,
      totalGains: Math.max(0, adjustedFV - raw.investedAmount),
      trajectory: adjustedTrajectory,
    };
  }, [monthly, annualReturn, effectiveYears, delayYears, years, inflationAdjusted, inflationRate]);

  // Delay analysis
  const delayAnalysis = useMemo(() => {
    return calculateDelayCost(monthly, annualReturn, years, delayYears);
  }, [monthly, annualReturn, years, delayYears]);

  // Delta against initial baseline
  const deltaValue = activeResult.futureValue - baselineResult.futureValue;
  const deltaFormatted = useMemo(() => {
    if (Math.abs(deltaValue) < 1000) return 'Identical to baseline';
    return `${deltaValue > 0 ? '+' : ''}${formatINR(deltaValue, { compact: true })}`;
  }, [deltaValue]);

  // Thoughtful generated insight written like a person focusing on the difference
  const generatedInsight = useMemo(() => {
    if (delayYears > 0) {
      return `Waiting ${formatYears(delayYears)} costs you ${formatINR(
        delayAnalysis.costOfDelay,
        { compact: true }
      )} at maturity. Missed contributions only saved you ${formatINR(delayAnalysis.missedContributions, { compact: true })}, but ${formatINR(delayAnalysis.lostCompounding, { compact: true })} vanished in lost compounding momentum.`;
    }

    if (inflationAdjusted) {
      return `At ${formatPercent(inflationRate)} inflation, ₹${formatINR(activeResult.futureValue, { compact: true })} in ${years} years will purchase what ₹${formatINR(activeResult.futureValue, { compact: true })} buys today. Real compounding is about beating purchasing power erosion.`;
    }

    if (monthly > baselineMonthly) {
      const extraSaved = (monthly - baselineMonthly) * years * 12;
      const extraGains = Math.max(0, deltaValue - extraSaved);
      return `Increasing this by ${formatINR(monthly - baselineMonthly)} changes your future by ${formatINR(
        deltaValue,
        { compact: true }
      )}. You only deposited ${formatINR(extraSaved, { compact: true })} more, but compounding handed you ${formatINR(extraGains, { compact: true })} extra.`;
    }

    if (monthly < baselineMonthly) {
      return `Dropping your monthly allocation by ${formatINR(baselineMonthly - monthly)} reduces your 10-year future by ${formatINR(
        Math.abs(deltaValue),
        { compact: true }
      )}.`;
    }

    return `At ${formatINR(monthly)} a month and ${formatPercent(annualReturn)} return, you accumulate ${formatINR(
      activeResult.futureValue,
      { compact: true }
    )} over ${years} years with total capital outlay of ${formatINR(activeResult.investedAmount, {
      compact: true,
    })}.`;
  }, [
    delayYears,
    delayAnalysis,
    inflationAdjusted,
    inflationRate,
    activeResult,
    years,
    annualReturn,
    monthly,
    baselineMonthly,
    deltaValue,
  ]);

  return (
    <section id="simulator" className="py-12 md:py-16 bg-bg border-b border-border">
      <div className="max-w-container mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-8 md:mb-10">
          <h2 className="text-display-xl font-serif text-ink tracking-tight uppercase leading-tight">
            Move the future. <br />
            <span className="italic font-normal lowercase tracking-normal">Change one thing.</span> See what happens.
          </h2>
          <p className="mt-3 text-base md:text-lg text-ink font-normal leading-relaxed max-w-2xl">
            You don’t need an opaque spreadsheet. Test how one single adjustment bends your 10-year trajectory.
            The important moment is the difference.
          </p>
        </div>

        {/* Experiment Hero Card: Baseline vs New vs The Difference */}
        <div className="bg-bg-white border border-border rounded-md p-6 sm:p-8 mb-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Baseline Reference */}
            <div className="md:col-span-4 p-4 rounded bg-bg-subtle/80 border border-border">
              <span className="text-xs font-mono uppercase tracking-wider text-ink-muted font-bold block mb-1">
                Baseline (Before)
              </span>
              <div className="text-sm font-sans text-ink font-medium">
                {formatINR(baselineMonthly)}/mo &bull; 10 years
              </div>
              <div className="text-2xl sm:text-3xl font-serif text-ink font-medium mt-1">
                {formatINR(baselineResult.futureValue, { compact: true })}
              </div>
              <span className="text-[11px] font-mono text-ink-muted block mt-0.5">
                Invested: {formatINR(baselineResult.investedAmount, { compact: true })}
              </span>
            </div>

            {/* The Difference Highlight (The "Aha!" Moment) */}
            <div className="md:col-span-4 text-center p-4 rounded border border-accent/30 bg-accent-surface/90 shadow-xs">
              <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold block mb-1">
                The Difference
              </span>
              <div className="text-3xl sm:text-4xl font-serif font-bold text-accent">
                {deltaFormatted}
              </div>
              <span className="text-xs font-sans text-ink font-medium block mt-1">
                {deltaValue >= 0 ? 'added to your 10-year future' : 'reduction in your future'}
              </span>
            </div>

            {/* Active Adjusted Outcome */}
            <div className="md:col-span-4 p-4 rounded bg-bg-subtle/80 border border-border md:text-right">
              <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold block mb-1">
                10 Years from Now
              </span>
              <div className="text-sm font-sans text-ink font-medium">
                {formatINR(monthly)}/mo {delayYears > 0 ? `(wait ${delayYears}y)` : ''}
              </div>
              <div className="text-2xl sm:text-3xl font-serif text-accent font-medium mt-1">
                <AnimatedNumber
                  value={activeResult.futureValue}
                  formatter={(v) => formatINR(v, { compact: true, decimals: 2 })}
                />
              </div>
              <span className="text-[11px] font-mono text-ink-muted block mt-0.5">
                Outlay: {formatINR(activeResult.investedAmount, { compact: true })}
              </span>
            </div>

          </div>
        </div>

        {/* Main Work Area: Single Major Dial & Levers + Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-6 bg-bg-white border border-border p-6 sm:p-8 rounded-md shadow-sm">
            <div className="flex justify-between items-center pb-4 border-b border-border/80">
              <span className="text-xs font-mono uppercase tracking-wider text-ink font-bold">
                Change One Assumption
              </span>
              <button
                type="button"
                onClick={() => {
                  setMonthly(15000);
                  setAnnualReturn(baselineReturn);
                  setYears(baselineYears);
                  setDelayYears(0);
                  setInflationAdjusted(false);
                }}
                className="text-xs font-mono text-accent hover:underline font-semibold"
              >
                Reset experiment
              </button>
            </div>

            {/* Primary Slider: Monthly Pace */}
            <div>
              <Slider
                id="sim-monthly"
                label="Monthly Investment"
                min={2000}
                max={50000}
                step={1000}
                value={monthly}
                onChange={setMonthly}
                formatValue={(v) => formatINR(v)}
                ticks={[
                  { value: 5000, label: '5k' },
                  { value: 15000, label: '15k' },
                  { value: 25000, label: '25k' },
                  { value: 50000, label: '50k' },
                ]}
              />
              <span className="text-xs font-sans text-ink-muted block mt-2">
                Slide to watch the difference update instantly compared to your ₹5,000 baseline.
              </span>
            </div>

            {/* Quick One-Click Levers */}
            <div className="pt-4 border-t border-border/70 space-y-2.5">
              <span className="text-xs font-mono uppercase tracking-wider text-ink font-bold block">
                Quick What-If Experiments:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setMonthly((prev) => Math.min(50000, prev + 5000))}
                  className="text-xs font-mono px-3 py-1.5 rounded-sm border border-border bg-bg-subtle text-ink hover:border-ink transition-colors font-medium"
                >
                  +₹5,000/mo
                </button>
                <button
                  type="button"
                  onClick={() => setMonthly((prev) => Math.min(50000, prev + 10000))}
                  className="text-xs font-mono px-3 py-1.5 rounded-sm border border-border bg-bg-subtle text-ink hover:border-ink transition-colors font-medium"
                >
                  +₹10,000/mo
                </button>
                <button
                  type="button"
                  onClick={() => setDelayYears((prev) => (prev === 2 ? 0 : 2))}
                  className={`text-xs font-mono px-3 py-1.5 rounded-sm border transition-colors font-medium ${
                    delayYears === 2
                      ? 'bg-red-50 text-red-950 border-red-300 font-bold'
                      : 'border-border bg-bg-subtle text-ink hover:border-ink'
                  }`}
                >
                  {delayYears === 2 ? 'Delay: 2 yrs active' : 'What if I wait 2 yrs?'}
                </button>
                <button
                  type="button"
                  onClick={() => setInflationAdjusted(!inflationAdjusted)}
                  className={`text-xs font-mono px-3 py-1.5 rounded-sm border transition-colors font-medium ${
                    inflationAdjusted
                      ? 'bg-accent text-bg border-accent font-bold'
                      : 'border-border bg-bg-subtle text-ink hover:border-ink'
                  }`}
                >
                  {inflationAdjusted ? 'Inflation (6% Real)' : 'Adjust 6% inflation'}
                </button>
              </div>
            </div>

            {/* Expected Return Slider */}
            <Slider
              id="sim-return"
              label="Expected Annual Return"
              min={0.06}
              max={0.16}
              step={0.005}
              value={annualReturn}
              onChange={setAnnualReturn}
              formatValue={(v) => formatPercent(v, 1)}
              ticks={[
                { value: 0.07, label: '7% (Debt/PPF)' },
                { value: 0.12, label: '12% (Index)' },
                { value: 0.15, label: '15% (Aggressive)' },
              ]}
            />

            {/* Time Period Slider */}
            <Slider
              id="sim-years"
              label="Time Horizon"
              min={3}
              max={30}
              step={1}
              value={years}
              onChange={(y) => {
                setYears(y);
                if (delayYears >= y) setDelayYears(Math.max(0, y - 1));
              }}
              formatValue={(v) => `${v} years`}
              ticks={[
                { value: 5, label: '5y' },
                { value: 10, label: '10y' },
                { value: 15, label: '15y' },
                { value: 20, label: '20y' },
                { value: 30, label: '30y' },
              ]}
            />

            {/* Cost of Waiting / Delay Slider */}
            <div className="pt-2 border-t border-border/80">
              <Slider
                id="sim-delay"
                label="Start Later by (Cost of Waiting)"
                min={0}
                max={Math.min(5, years - 1)}
                step={1}
                value={delayYears}
                onChange={setDelayYears}
                formatValue={(v) => (v === 0 ? 'Start Immediately' : `Delay ${v} yrs`)}
                hint={
                  delayYears > 0
                    ? `Postponing by ${delayYears} years reduces compounding duration to ${effectiveYears} years.`
                    : 'See how a few years of procrastination degrades compounding.'
                }
              />
            </div>

            {/* Inflation-Adjusted Toggle */}
            <div className="pt-4 border-t border-border/80 flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider font-mono text-ink font-semibold block">
                  Inflation Adjustment
                </span>
                <span className="text-xs text-ink-muted font-medium">
                  Assumes 6% annual inflation (RBI target corridor)
                </span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={inflationAdjusted}
                onClick={() => setInflationAdjusted(!inflationAdjusted)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-accent ${
                  inflationAdjusted ? 'bg-accent' : 'bg-border-dark'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    inflationAdjusted ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

          </div>

          {/* Chart & Narrative Insight Column */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* The SVG Trajectory Chart with Ghost Line and Area Fill */}
            <div className="bg-bg-subtle/60 border border-border p-5 sm:p-6 rounded-md">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-ink mb-3">
                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center gap-1.5 font-medium">
                    <span className="w-3.5 h-0.5 bg-accent inline-block" />
                    <span>Active Scenario</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-medium text-ink-muted">
                    <span className="w-3.5 h-0.5 border-b border-dashed border-ink inline-block" />
                    <span>Baseline (Ghost)</span>
                  </span>
                </div>
                {deltaFormatted && (
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                      deltaValue >= 0
                        ? 'bg-accent-surface text-accent border border-accent/30'
                        : 'bg-red-50 text-red-950 border border-red-300'
                    }`}
                  >
                    Variance: {deltaFormatted}
                  </span>
                )}
              </div>

              <Trajectory
                data={activeResult.trajectory}
                ghostData={baselineResult.trajectory}
                width={700}
                height={350}
                horizonYears={years}
                showInvestedBaseline={true}
                showDifferenceArea={true}
                differenceLabel={deltaFormatted || undefined}
              />
            </div>

            {/* Generated Human-Sounding Insight */}
            <div className="p-5 rounded-md bg-accent-surface/90 border border-accent/40 shadow-xs">
              <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold block mb-1.5">
                Mathematical Takeaway
              </span>
              <p className="text-base text-ink font-sans font-medium leading-relaxed">
                &ldquo;{generatedInsight}&rdquo;
              </p>
            </div>

            {/* Substituted Math Formula Disclosure */}
            <MathDisclosure
              monthlyInvestment={monthly}
              annualReturn={annualReturn}
              years={years}
              delayYears={delayYears}
              inflationAdjusted={inflationAdjusted}
              inflationRate={inflationRate}
              futureValue={activeResult.futureValue}
              investedAmount={activeResult.investedAmount}
            />

          </div>

        </div>

      </div>
    </section>
  );
}
