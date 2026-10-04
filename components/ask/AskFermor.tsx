'use client';

import React, { useState, useMemo } from 'react';
import { calculateEMI } from '@/lib/calculations';
import { formatINR, formatPercent } from '@/lib/format';
import { Slider } from '../ui/Slider';

interface ScenarioQuestion {
  id: string;
  question: string;
  income: number;
  commitments: number;
  price: number;
  downPayment: number;
  tenureYears: number;
  rate: number;
  assetLabel: string;
}

const PRESET_QUESTIONS: ScenarioQuestion[] = [
  {
    id: 'car',
    question: '“I earn ₹80k/month. Can I afford a ₹12L car?”',
    income: 80000,
    commitments: 18000,
    price: 1200000,
    downPayment: 200000,
    tenureYears: 5,
    rate: 0.095,
    assetLabel: 'Car on-road price',
  },
  {
    id: 'home',
    question: '“I earn ₹1.5L/month. Can I buy a ₹75L home?”',
    income: 150000,
    commitments: 20000,
    price: 7500000,
    downPayment: 1500000,
    tenureYears: 20,
    rate: 0.0875,
    assetLabel: 'Property agreement value',
  },
  {
    id: 'education',
    question: '“I earn ₹60k/month. Can I take an ₹8L education loan?”',
    income: 60000,
    commitments: 8000,
    price: 800000,
    downPayment: 100000,
    tenureYears: 7,
    rate: 0.105,
    assetLabel: 'Course tuition & living',
  },
];

export function AskFermor() {
  const [activeScenarioId, setActiveScenarioId] = useState<string>('car');

  // Input states
  const [income, setIncome] = useState<number>(80000);
  const [commitments, setCommitments] = useState<number>(18000);
  const [assetPrice, setAssetPrice] = useState<number>(1200000);
  const [downPayment, setDownPayment] = useState<number>(200000);
  const [tenureYears, setTenureYears] = useState<number>(5);
  const [rate, setRate] = useState<number>(0.095);

  const [hasAppliedExtraDown, setHasAppliedExtraDown] = useState<boolean>(false);
  const [showMath, setShowMath] = useState<boolean>(false);

  // Switch preset scenarios
  const applyScenario = (id: string) => {
    const sc = PRESET_QUESTIONS.find((p) => p.id === id);
    if (!sc) return;
    setActiveScenarioId(id);
    setIncome(sc.income);
    setCommitments(sc.commitments);
    setAssetPrice(sc.price);
    setDownPayment(sc.downPayment);
    setTenureYears(sc.tenureYears);
    setRate(sc.rate);
    setHasAppliedExtraDown(false);
  };

  // Calculations
  const currentDown = hasAppliedExtraDown ? downPayment + Math.min(200000, assetPrice * 0.2) : downPayment;
  const principal = Math.max(0, assetPrice - currentDown);

  const emiResult = useMemo(() => {
    return calculateEMI(principal, rate, tenureYears);
  }, [principal, rate, tenureYears]);

  const basePrincipal = Math.max(0, assetPrice - downPayment);
  const baseResult = useMemo(() => {
    return calculateEMI(basePrincipal, rate, tenureYears);
  }, [basePrincipal, rate, tenureYears]);

  const emiShareOfIncome = income > 0 ? (emiResult.monthlyEMI / income) * 100 : 0;
  const totalMonthlyDebt = emiResult.monthlyEMI + commitments;
  const totalDebtShareOfIncome = income > 0 ? (totalMonthlyDebt / income) * 100 : 0;
  const remainingCashflow = Math.max(0, income - totalMonthlyDebt);

  // Difference if putting extra down
  const extraDownAmount = Math.min(200000, assetPrice * 0.2);
  const interestSaved = baseResult.totalInterest - emiResult.totalInterest;
  const monthlySavings = baseResult.monthlyEMI - emiResult.monthlyEMI;

  const isStretched = totalDebtShareOfIncome >= 45;
  const isHealthy = totalDebtShareOfIncome < 35;

  return (
    <section id="ask-fermor" className="py-12 md:py-16 bg-bg-subtle border-b border-border">
      <div className="max-w-container mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-8 md:mb-10">
          <span className="text-xs font-mono uppercase tracking-widest text-accent font-bold block mb-2">
            Ask Fermor
          </span>
          <h2 className="text-display-lg font-serif text-ink tracking-tight uppercase leading-tight">
            Real questions. <br />
            <span className="italic font-normal lowercase tracking-normal text-accent">Clear reasoning.</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-ink font-normal leading-relaxed">
            No conversational chatbot guessing answers. Fermor audits your true cashflow commitments,
            evaluates debt strain, and demonstrates the exact levers that change the outcome.
          </p>

          {/* Quick Real Questions Chips */}
          <div className="mt-6 flex flex-wrap gap-2.5 items-center">
            <span className="text-xs font-mono text-ink font-bold uppercase mr-1">Choose a question:</span>
            {PRESET_QUESTIONS.map((sc) => (
              <button
                key={sc.id}
                type="button"
                onClick={() => applyScenario(sc.id)}
                className={`text-xs font-mono px-3.5 py-1.5 rounded-sm border transition-all ${
                  activeScenarioId === sc.id
                    ? 'bg-accent text-bg border-accent font-bold shadow-xs'
                    : 'bg-bg-white text-ink border-border hover:border-ink font-medium'
                }`}
              >
                {sc.question}
              </button>
            ))}
          </div>
        </div>

        {/* Structured Two-Column Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: The Financial Breakdown Worksheet */}
          <div className="lg:col-span-6 bg-bg-white border border-border p-6 sm:p-8 rounded-md shadow-sm space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-border/80">
              <span className="text-xs font-mono uppercase tracking-wider text-ink font-bold">
                The Financial Breakdown
              </span>
              <span className="text-xs font-mono text-ink-muted">
                {formatPercent(rate, 1)} reducing rate &bull; {tenureYears} yrs
              </span>
            </div>

            {/* Income Slider */}
            <Slider
              id="ask-income"
              label="Net Monthly In-Hand Income"
              min={30000}
              max={300000}
              step={5000}
              value={income}
              onChange={setIncome}
              formatValue={(v) => formatINR(v)}
            />

            {/* Existing Obligations */}
            <Slider
              id="ask-commitments"
              label="Existing Commitments (Rent, Loans, Cards)"
              min={0}
              max={100000}
              step={2000}
              value={commitments}
              onChange={setCommitments}
              formatValue={(v) => formatINR(v)}
            />

            {/* Price Slider */}
            <Slider
              id="ask-price"
              label={PRESET_QUESTIONS.find((p) => p.id === activeScenarioId)?.assetLabel || 'Total Asset Price'}
              min={Math.round(assetPrice * 0.5)}
              max={Math.round(assetPrice * 1.8)}
              step={50000}
              value={assetPrice}
              onChange={(v) => {
                setAssetPrice(v);
                if (downPayment >= v) setDownPayment(Math.round(v * 0.2));
              }}
              formatValue={(v) => formatINR(v, { compact: true })}
            />

            {/* Down Payment Slider */}
            <Slider
              id="ask-down"
              label="Upfront Down Payment"
              min={0}
              max={Math.round(assetPrice * 0.6)}
              step={25000}
              value={downPayment}
              onChange={setDownPayment}
              formatValue={(v) => formatINR(v, { compact: true })}
            />
          </div>

          {/* Right Column: Fermor's Reasoning & Decision Verdict */}
          <div className="lg:col-span-6 bg-bg-white border border-border p-6 sm:p-8 rounded-md shadow-sm space-y-6">
            
            <div className="pb-4 border-b border-border/80 flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold">
                Fermor’s Reasoning
              </span>
              <span className="text-xs font-mono text-ink-muted">
                Audit Results
              </span>
            </div>

            {/* Structured Numbers Ledger */}
            <div className="divide-y divide-border/70 text-sm font-mono">
              <div className="py-2.5 flex justify-between items-baseline">
                <span className="text-ink-muted">Monthly in-hand income</span>
                <span className="text-ink font-bold">{formatINR(income)}</span>
              </div>
              <div className="py-2.5 flex justify-between items-baseline">
                <span className="text-ink-muted">Existing commitments</span>
                <span className="text-ink font-bold">{formatINR(commitments)}</span>
              </div>
              <div className="py-2.5 flex justify-between items-baseline">
                <span className="text-ink-muted">Proposed EMI</span>
                <span className="text-accent font-bold text-base">{formatINR(emiResult.monthlyEMI)}</span>
              </div>
              <div className="py-3 flex justify-between items-baseline border-t-2 border-border text-base">
                <span className="text-ink font-bold">Total Monthly Debt Service</span>
                <span className="text-ink font-bold">{formatINR(totalMonthlyDebt)}</span>
              </div>
            </div>

            {/* The Decision Verdict Block */}
            <div
              className={`p-4 rounded-sm border ${
                isStretched
                  ? 'bg-red-50/95 border-red-300'
                  : isHealthy
                  ? 'bg-accent-surface/90 border-accent/40'
                  : 'bg-amber-50/95 border-amber-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isStretched ? 'bg-red-600' : isHealthy ? 'bg-accent' : 'bg-amber-600'
                  }`}
                />
                <span
                  className={`text-xs font-mono uppercase tracking-wider font-bold ${
                    isStretched
                      ? 'text-red-950'
                      : isHealthy
                      ? 'text-accent'
                      : 'text-amber-950'
                  }`}
                >
                  {isStretched
                    ? 'Debt Threshold Alert'
                    : isHealthy
                    ? 'Comfortable Debt Service'
                    : 'Moderate Debt Service'}
                </span>
              </div>

              <p className="text-sm font-sans text-ink leading-relaxed">
                That proposed EMI would be <strong className="font-bold text-ink">{emiShareOfIncome.toFixed(1)}%</strong> of your monthly income.
                Together with existing commitments, your fixed debt service reaches{' '}
                <strong className={`font-bold ${isStretched ? 'text-red-950 bg-red-100/90 px-1 py-0.5 rounded' : 'text-accent'}`}>
                  {totalDebtShareOfIncome.toFixed(1)}%
                </strong>.
                {isStretched && (
                  <span> Prudent retail lenders consider debt servicing above 40–50% as stretched, leaving you only {formatINR(remainingCashflow)} for living expenses, investing, and emergencies.</span>
                )}
                {isHealthy && (
                  <span> Well within standard 35% safe limits, leaving you healthy cashflow to invest and build an emergency buffer.</span>
                )}
              </p>
            </div>

            {/* The Actionable Lever: What changes if you put extra down */}
            <div className="p-4 bg-bg-subtle rounded border border-border space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="font-mono text-ink uppercase text-xs font-bold block mb-1">
                    The Financial Lever
                  </span>
                  <p className="text-xs sm:text-sm font-sans text-ink leading-relaxed">
                    Here’s what changes if you put {formatINR(extraDownAmount, { compact: true })} more down:
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setHasAppliedExtraDown(!hasAppliedExtraDown)}
                  className={`shrink-0 text-xs font-mono px-3 py-1.5 rounded-sm border transition-all ${
                    hasAppliedExtraDown
                      ? 'bg-accent text-bg border-accent font-bold'
                      : 'bg-bg-white text-ink border-border hover:border-ink font-semibold'
                  }`}
                >
                  {hasAppliedExtraDown ? '[ Reset Down Payment ]' : '[ See the difference ]'}
                </button>
              </div>

              {hasAppliedExtraDown && (
                <div className="pt-3 border-t border-border/70 grid grid-cols-2 gap-3 text-xs font-mono animate-fadeIn">
                  <div>
                    <span className="text-ink-muted block text-[11px]">Monthly EMI Drops By:</span>
                    <span className="text-accent font-bold text-sm">-{formatINR(monthlySavings)} / mo</span>
                  </div>
                  <div>
                    <span className="text-ink-muted block text-[11px]">Total Interest Saved:</span>
                    <span className="text-accent font-bold text-sm">+{formatINR(interestSaved, { compact: true })}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Progressive Math Breakdown */}
            <div className="pt-2 border-t border-border/70">
              <button
                type="button"
                onClick={() => setShowMath(!showMath)}
                className="text-xs font-mono text-ink font-semibold hover:text-accent flex items-center justify-between w-full focus:outline-none transition-colors"
              >
                <span>{showMath ? '[- Hide formula breakdown]' : '[+ See the EMI math breakdown]'}</span>
                <span className="text-xs text-ink-muted font-normal">Reducing balance amortisation</span>
              </button>

              {showMath && (
                <div className="mt-3 p-3.5 bg-bg-subtle border border-border/80 rounded text-xs font-mono text-ink space-y-2 animate-fadeIn">
                  <p className="font-semibold">EMI = P &times; r &times; (1 + r)^n / ((1 + r)^n - 1)</p>
                  <p className="text-ink-muted">
                    Where P = <strong className="text-ink">{formatINR(principal)}</strong>, r = <strong className="text-ink">{formatPercent(rate, 2)} / 12</strong>, n = <strong className="text-ink">{tenureYears * 12} monthly installments</strong>.
                  </p>
                  <p className="text-[11px] text-ink-muted">
                    Fermor uses exact day-count reducing balance schedules without hidden processing fees or front-loaded interest penalties.
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
