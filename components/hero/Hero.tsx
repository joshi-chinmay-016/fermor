'use client';

import React, { useState, useMemo } from 'react';
import { calculateSIP } from '@/lib/calculations';
import { formatINR } from '@/lib/format';
import { ASSUMPTIONS } from '@/lib/constants';
import { Trajectory } from './Trajectory';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import { Slider } from '../ui/Slider';

export function Hero() {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(ASSUMPTIONS.HERO_DEFAULT_MONTHLY);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showCalculation, setShowCalculation] = useState(false);

  // Compute live 10-year trajectory at 12% benchmark
  const sipResult = useMemo(() => {
    return calculateSIP(
      monthlyInvestment,
      ASSUMPTIONS.HERO_ANNUAL_RETURN,
      ASSUMPTIONS.HERO_HORIZON_YEARS
    );
  }, [monthlyInvestment]);

  const handleSliderChange = (val: number) => {
    if (!hasInteracted) setHasInteracted(true);
    setMonthlyInvestment(val);
  };

  return (
    <section className="relative pt-8 pb-10 md:pt-12 md:pb-14 border-b border-border">
      <div className="max-w-container mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Top Header Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-baseline">
          {/* Main Title */}
          <div className="lg:col-span-8">
            <h1 className="text-display-2xl font-serif text-ink tracking-tight uppercase leading-[0.98]">
              Where is your <br />
              <span className="italic font-normal lowercase tracking-normal">money</span> taking you?
            </h1>
            <p className="mt-4 text-base md:text-lg text-ink font-normal leading-relaxed max-w-2xl">
              Your money isn’t a number. <strong className="font-semibold text-accent">It’s a trajectory.</strong>{' '}
              Watch how one monthly decision bends the next ten years.
            </p>
          </div>

          {/* Stat Callout / Assumption Tag */}
          <div className="lg:col-span-4 lg:text-right flex flex-col justify-end">
            <div className="inline-block lg:ml-auto bg-bg-white border border-border px-4 py-2.5 rounded-sm text-left shadow-xs">
              <span className="block text-xs font-mono uppercase tracking-wider text-ink font-semibold">
                Horizon & Return Benchmark
              </span>
              <span className="text-xs font-medium text-ink-muted">
                10 Years &bull; 12% annualised broad market
              </span>
            </div>
          </div>
        </div>

        {/* Live Trajectory Display & Dial */}
        <div className="mt-8 md:mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          
          {/* Left Column: Big Figure & Dial (Desktop), Recomposed on Mobile */}
          <div className="lg:col-span-5 flex flex-col justify-between order-2 lg:order-1">
            <div className="bg-bg-white border border-border p-6 sm:p-8 rounded-md shadow-[0_2px_8px_rgba(17,17,15,0.03)]">
              
              {/* Projected Value Header - Human First */}
              <div className="pb-5 border-b border-border/80">
                <span className="text-xs uppercase font-mono tracking-wider text-ink font-semibold block mb-1">
                  Ten-Year Future
                </span>
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-serif text-ink">You could have</span>
                  <AnimatedNumber
                    value={sipResult.futureValue}
                    formatter={(v) => formatINR(v, { compact: true, decimals: 2 })}
                    className="text-4xl sm:text-5xl font-serif text-accent font-medium tracking-tight"
                  />
                  <span className="text-2xl sm:text-3xl font-serif text-ink">in 10 years.</span>
                </div>
                <p className="mt-1 text-xs text-ink-muted font-sans">
                  Assuming {formatINR(monthlyInvestment)}/month at a 12% broad-market benchmark.
                </p>
                <div className="mt-3 text-xs font-mono text-ink font-medium flex items-center justify-between pt-2 border-t border-border/50">
                  <span>
                    Your outlay: <strong className="font-semibold text-ink">{formatINR(sipResult.investedAmount, { compact: true })}</strong>
                  </span>
                  <span className="text-accent font-semibold">
                    Compounded growth: +{formatINR(sipResult.totalGains, { compact: true })}
                  </span>
                </div>
              </div>

              {/* The Single Dial */}
              <div className="pt-5">
                <div className="relative">
                  <Slider
                    id="hero-monthly-dial"
                    label="Change Your Monthly Pace"
                    min={1000}
                    max={100000}
                    step={1000}
                    value={monthlyInvestment}
                    onChange={handleSliderChange}
                    formatValue={(v) => formatINR(v, { compact: false })}
                    ticks={[
                      { value: 5000, label: '5k' },
                      { value: 15000, label: '15k' },
                      { value: 25000, label: '25k' },
                      { value: 50000, label: '50k' },
                      { value: 100000, label: '1L' },
                    ]}
                  />

                  {/* Gentle First Interaction Hint */}
                  {!hasInteracted && (
                    <div className="mt-3 flex items-center gap-1.5 text-xs font-mono text-accent font-medium animate-pulse">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                      <span>Drag to change your pace. See your curve bend.</span>
                    </div>
                  )}
                </div>

                {/* Progressive Disclosure: How did we calculate this? */}
                <div className="mt-4 pt-3 border-t border-border/80">
                  <button
                    type="button"
                    onClick={() => setShowCalculation(!showCalculation)}
                    className="text-xs font-mono text-ink font-semibold hover:text-accent flex items-center justify-between w-full focus:outline-none transition-colors"
                  >
                    <span>{showCalculation ? '[- Hide calculation methodology]' : '[ See how we calculated this → ]'}</span>
                    <span className="text-xs text-ink-muted font-normal">Monthly annuity due</span>
                  </button>

                  {showCalculation && (
                    <div className="mt-2.5 p-3 bg-bg-subtle border border-border/80 rounded-sm text-xs font-mono text-ink space-y-1.5 animate-fadeIn">
                      <p className="font-semibold">FV = P &times; [((1 + r)^n - 1) / r] &times; (1 + r)</p>
                      <p className="text-ink-muted text-[11px] leading-relaxed">
                        Where P = {formatINR(monthlyInvestment)}, r = 12% / 12 (1.0% per month), n = 120 monthly cycles.
                        Compound interest credited at the beginning of each period.
                      </p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Custom SVG Trajectory Chart */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="bg-bg-subtle/50 border border-border p-4 sm:p-6 rounded-md">
              <div className="flex items-center justify-between text-xs text-ink-muted mb-2 font-mono">
                <div className="flex items-center gap-4">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-3 h-0.5 bg-accent inline-block" />
                    <span>Compounded Trajectory</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <span className="w-3 h-0.5 border-b border-dashed border-ink-muted inline-block" />
                    <span>Principal Invested</span>
                  </span>
                </div>
                <span className="hidden sm:inline">10 Years Horizon</span>
              </div>

              {/* The Trajectory Chart */}
              <Trajectory
                data={sipResult.trajectory}
                width={680}
                height={340}
                horizonYears={10}
                showInvestedBaseline={true}
                ariaSummary={`Projected trajectory for ${formatINR(monthlyInvestment)} per month over 10 years at 12% annual return, reaching ${formatINR(sipResult.futureValue, { compact: true })}.`}
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
