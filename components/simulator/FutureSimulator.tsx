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
  const baselineMonthly = ASSUMPTIONS.SIMULATOR_DEFAULT_MONTHLY;
  const baselineReturn = ASSUMPTIONS.SIMULATOR_DEFAULT_RETURN;
  const baselineYears = ASSUMPTIONS.SIMULATOR_DEFAULT_YEARS;

  // Active state variables
  const [monthly, setMonthly] = useState<number>(baselineMonthly);
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
    if (Math.abs(deltaValue) < 10000) return null;
    return `${deltaValue > 0 ? '+' : ''}${formatINR(deltaValue, { compact: true })}`;
  }, [deltaValue]);

  // Thoughtful generated insight written like a person
  const generatedInsight = useMemo(() => {
    if (delayYears > 0) {
      return `Waiting ${formatYears(delayYears)} costs you about ${formatINR(
        delayAnalysis.costOfDelay,
        { compact: true }
      )} in lost wealth, of which ${formatINR(delayAnalysis.lostCompounding, {
        compact: true,
      })} is pure compounded momentum you can never make back with effort alone.`;
    }

    if (inflationAdjusted) {
      return `At ${formatPercent(inflationRate)} assumed inflation, ${formatINR(
        activeResult.futureValue,
        { compact: true }
      )} in ${years} years has the exact purchasing power of ${formatINR(
        activeResult.futureValue,
        { compact: true }
      )} today. Real growth is what beats the basket.`;
    }

    if (activeResult.totalGains > activeResult.investedAmount * 2) {
      const multiple = (activeResult.totalGains / activeResult.investedAmount).toFixed(1);
      return `At ${formatPercent(annualReturn)} over ${years} years, market growth creates ${multiple}x more money than your physical deposits (${formatINR(
        activeResult.investedAmount,
        { compact: true }
      )} deposited vs ${formatINR(activeResult.totalGains, { compact: true })} earned).`;
    }

    if (monthly > baselineMonthly) {
      return `Adding ${formatINR(monthly - baselineMonthly)} per month lifts your final corpus by ${formatINR(
        deltaValue,
        { compact: true }
      )} over ${years} years.`;
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
            The dashed line is your baseline benchmark. Adjust your monthly pace, horizon, or start date
            to watch the divergence compound in real time.
          </p>
        </div>

        {/* 3-Part Output Dashboard: Final Value, Invested, Gains */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border border border-border rounded-md overflow-hidden mb-8 shadow-xs">
          
          <div className="bg-bg-white p-5 sm:p-6">
            <span className="text-xs font-mono uppercase tracking-wider text-ink font-semibold block mb-1">
              {inflationAdjusted ? 'Inflation-Adjusted Corpus' : 'Projected Future Corpus'}
            </span>
            <div className="flex items-baseline gap-2">
              <AnimatedNumber
                value={activeResult.futureValue}
                formatter={(v) => formatINR(v, { compact: true, decimals: 2 })}
                className="text-3xl sm:text-4xl font-serif font-medium text-accent"
              />
            </div>
            <span className="text-xs font-mono text-ink-muted font-medium block mt-1">
              At Yr {years} horizon ({formatYears(effectiveYears)} active)
            </span>
          </div>

          <div className="bg-bg-white p-5 sm:p-6">
            <span className="text-xs font-mono uppercase tracking-wider text-ink font-semibold block mb-1">
              Your Capital Outlay
            </span>
            <div className="flex items-baseline gap-2">
              <AnimatedNumber
                value={activeResult.investedAmount}
                formatter={(v) => formatINR(v, { compact: true, decimals: 2 })}
                className="text-3xl sm:text-4xl font-serif font-medium text-ink"
              />
            </div>
            <span className="text-xs font-mono text-ink-muted font-medium block mt-1">
              {formatINR(monthly)} &times; {effectiveYears * 12} contributions
            </span>
          </div>

          <div className="bg-bg-white p-5 sm:p-6">
            <span className="text-xs font-mono uppercase tracking-wider text-ink font-semibold block mb-1">
              Compounded Earnings (The Gap)
            </span>
            <div className="flex items-baseline gap-2">
              <AnimatedNumber
                value={activeResult.totalGains}
                formatter={(v) => `+${formatINR(v, { compact: true, decimals: 2 })}`}
                className="text-3xl sm:text-4xl font-serif font-medium text-accent"
              />
            </div>
            <span className="text-xs font-mono text-accent font-semibold block mt-1">
              Wealth generated by time &amp; return
            </span>
          </div>

        </div>

        {/* Main Work Area: Multi-variable Controls & Ghost Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-6 bg-bg-white border border-border p-6 sm:p-8 rounded-md shadow-sm">
            <div className="flex justify-between items-center pb-4 border-b border-border/80">
              <span className="text-xs font-mono uppercase tracking-wider text-ink font-medium">
                Simulation Variables
              </span>
              <button
                type="button"
                onClick={() => {
                  setMonthly(baselineMonthly);
                  setAnnualReturn(baselineReturn);
                  setYears(baselineYears);
                  setDelayYears(0);
                  setInflationAdjusted(false);
                }}
                className="text-xs font-mono text-accent hover:underline"
              >
                Reset to baseline
              </button>
            </div>

            {/* Monthly Investment Slider */}
            <Slider
              id="sim-monthly"
              label="Monthly Investment"
              min={2000}
              max={150000}
              step={1000}
              value={monthly}
              onChange={setMonthly}
              formatValue={(v) => formatINR(v)}
              ticks={[
                { value: 10000, label: '10k' },
                { value: 25000, label: '25k' },
                { value: 50000, label: '50k' },
                { value: 100000, label: '1L' },
              ]}
            />

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
