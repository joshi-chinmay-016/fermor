'use client';

import React, { useState, useMemo } from 'react';
import { calculateEMI, calculateSIP, calculateDelayCost } from '@/lib/calculations';
import { formatINR, formatPercent } from '@/lib/format';
import { Slider } from '@/components/ui/Slider';

export function DecisionQuestions() {
  // Card 1: Can I afford this car?
  const [carPrice, setCarPrice] = useState(1200000);
  const [carSalary, setCarSalary] = useState(80000);
  const carDown = Math.round(carPrice * 0.2);
  const carLoan = carPrice - carDown;
  const carEMI = useMemo(() => calculateEMI(carLoan, 0.095, 5), [carLoan]);
  const carEmiShare = carSalary > 0 ? (carEMI.monthlyEMI / carSalary) * 100 : 0;

  // Card 2: Am I investing enough?
  const [monthlyInvest, setMonthlyInvest] = useState(20000);
  const [investSalary] = useState(80000);
  const savingsRate = Math.round((monthlyInvest / investSalary) * 100);
  const invest10Yr = useMemo(() => calculateSIP(monthlyInvest, 0.12, 10), [monthlyInvest]);

  // Card 3: Should I pay off my loan?
  const [prepayAmount, setPrepayAmount] = useState(200000);
  const homeLoanPrincipal = 4000000;
  const homeLoanRate = 0.0875;
  const baseLoan = useMemo(() => calculateEMI(homeLoanPrincipal, homeLoanRate, 20), []);
  const prepayLoan = useMemo(
    () => calculateEMI(homeLoanPrincipal - prepayAmount, homeLoanRate, 20),
    [prepayAmount]
  );
  const interestSaved = baseLoan.totalInterest - prepayLoan.totalInterest;

  // Card 4: What happens if I wait?
  const [waitYears, setWaitYears] = useState(2);
  const delayCalc = useMemo(
    () => calculateDelayCost(15000, 0.12, 15, waitYears),
    [waitYears]
  );

  return (
    <section id="questions" className="py-12 md:py-16 bg-bg border-b border-border">
      <div className="max-w-container mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-8 md:mb-10">
          <span className="text-xs font-mono uppercase tracking-widest text-accent font-bold block mb-2">
            Decision Moments
          </span>
          <h2 className="text-display-lg font-serif text-ink tracking-tight uppercase leading-tight">
            The questions that <br />
            <span className="italic font-normal lowercase tracking-normal text-accent">cost us money.</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-ink font-normal leading-relaxed max-w-2xl">
            People don’t search for financial formulas. They face immediate trade-offs.
            Here is how Fermor translates complex numbers into clear, honest decisions.
          </p>
        </div>

        {/* 4 Decision Preview Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          
          {/* Card 1: Can I afford this car? */}
          <div className="bg-bg-white border border-border rounded-md p-6 sm:p-7 shadow-sm flex flex-col justify-between hover:border-ink transition-colors">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold block mb-1">
                Affordability &bull; 20% Down &bull; 5 Yrs
              </span>
              <h3 className="text-2xl font-serif text-ink tracking-tight font-medium mb-3">
                &ldquo;Can I afford this car?&rdquo;
              </h3>
              
              <div className="space-y-4 py-2">
                <Slider
                  id="card-car-price"
                  label="On-Road Price"
                  min={600000}
                  max={2500000}
                  step={50000}
                  value={carPrice}
                  onChange={setCarPrice}
                  formatValue={(v) => formatINR(v, { compact: true })}
                />
              </div>

              {/* Decision Metrics */}
              <div className="mt-4 p-3.5 bg-bg-subtle rounded border border-border text-xs font-mono space-y-1.5">
                <div className="flex justify-between items-baseline">
                  <span className="text-ink-muted">Monthly EMI (9.5%):</span>
                  <span className="text-ink font-bold text-sm">{formatINR(carEMI.monthlyEMI)}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-ink-muted">Share of ₹80k salary:</span>
                  <span className={`font-bold ${carEmiShare > 25 ? 'text-red-950 font-bold' : 'text-accent'}`}>
                    {carEmiShare.toFixed(1)}% of income
                  </span>
                </div>
              </div>
            </div>

            {/* Verdict */}
            <div className="mt-5 pt-3.5 border-t border-border/80">
              <p className="text-xs sm:text-sm font-sans text-ink leading-relaxed">
                {carEmiShare > 25 ? (
                  <>
                    <strong className="text-red-950 font-bold">Stretched:</strong> At {carEmiShare.toFixed(0)}% of income, this car leaves very little breathing room for rent, investing, or emergencies. Consider a lower trim or larger down payment.
                  </>
                ) : (
                  <>
                    <strong className="text-accent font-bold">Healthy:</strong> Inside the 20% guideline. Leaves healthy headroom for your regular monthly investments.
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Card 2: Am I investing enough? */}
          <div className="bg-bg-white border border-border rounded-md p-6 sm:p-7 shadow-sm flex flex-col justify-between hover:border-ink transition-colors">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold block mb-1">
                Savings Pace &bull; 10-Yr Milestone
              </span>
              <h3 className="text-2xl font-serif text-ink tracking-tight font-medium mb-3">
                &ldquo;Am I investing enough?&rdquo;
              </h3>

              <div className="space-y-4 py-2">
                <Slider
                  id="card-invest-pace"
                  label="Monthly Investment"
                  min={5000}
                  max={40000}
                  step={1000}
                  value={monthlyInvest}
                  onChange={setMonthlyInvest}
                  formatValue={(v) => formatINR(v)}
                />
              </div>

              {/* Decision Metrics */}
              <div className="mt-4 p-3.5 bg-bg-subtle rounded border border-border text-xs font-mono space-y-1.5">
                <div className="flex justify-between items-baseline">
                  <span className="text-ink-muted">Savings Rate (₹80k base):</span>
                  <span className="text-accent font-bold text-sm">{savingsRate}% of income</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-ink-muted">10-Yr Corpus (@12%):</span>
                  <span className="text-ink font-bold text-sm">{formatINR(invest10Yr.futureValue, { compact: true })}</span>
                </div>
              </div>
            </div>

            {/* Verdict */}
            <div className="mt-5 pt-3.5 border-t border-border/80">
              <p className="text-xs sm:text-sm font-sans text-ink leading-relaxed">
                Saving <strong className="font-semibold text-ink">{savingsRate}%</strong> puts you in the top tier of salaried savers.
                Increasing by just ₹5k/mo adds <strong className="text-accent font-bold">{formatINR(invest10Yr.futureValue * 0.25, { compact: true })}</strong> to your 10-year future.
              </p>
            </div>
          </div>

          {/* Card 3: Should I pay off my loan? */}
          <div className="bg-bg-white border border-border rounded-md p-6 sm:p-7 shadow-sm flex flex-col justify-between hover:border-ink transition-colors">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold block mb-1">
                Prepayment Arbitrage &bull; Home Loan
              </span>
              <h3 className="text-2xl font-serif text-ink tracking-tight font-medium mb-3">
                &ldquo;Should I pay off my loan?&rdquo;
              </h3>

              <div className="space-y-4 py-2">
                <Slider
                  id="card-prepay-amount"
                  label="Lump-sum Prepayment"
                  min={50000}
                  max={500000}
                  step={25000}
                  value={prepayAmount}
                  onChange={setPrepayAmount}
                  formatValue={(v) => formatINR(v, { compact: true })}
                />
              </div>

              {/* Decision Metrics */}
              <div className="mt-4 p-3.5 bg-accent-surface/90 border border-accent/40 rounded text-xs font-mono space-y-1.5">
                <div className="flex justify-between items-baseline">
                  <span className="text-ink">Total Interest Saved:</span>
                  <span className="text-accent font-bold text-sm">{formatINR(interestSaved, { compact: true })}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-ink">Guaranteed Risk-Free Yield:</span>
                  <span className="text-accent font-bold text-sm">8.75% Tax-Free</span>
                </div>
              </div>
            </div>

            {/* Verdict */}
            <div className="mt-5 pt-3.5 border-t border-border/80">
              <p className="text-xs sm:text-sm font-sans text-ink leading-relaxed">
                Prepaying {formatINR(prepayAmount, { compact: true })} saves <strong className="text-accent font-bold">{formatINR(interestSaved, { compact: true })}</strong> in total interest. That equals a guaranteed, zero-risk return you cannot find in any fixed-income instrument.
              </p>
            </div>
          </div>

          {/* Card 4: What happens if I wait? */}
          <div className="bg-bg-white border border-border rounded-md p-6 sm:p-7 shadow-sm flex flex-col justify-between hover:border-ink transition-colors">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-accent font-bold block mb-1">
                Cost of Inaction &bull; 15-Yr Horizon
              </span>
              <h3 className="text-2xl font-serif text-ink tracking-tight font-medium mb-3">
                &ldquo;What happens if I wait?&rdquo;
              </h3>

              <div className="space-y-4 py-2">
                <Slider
                  id="card-wait-years"
                  label="Years Postponed"
                  min={1}
                  max={5}
                  step={1}
                  value={waitYears}
                  onChange={setWaitYears}
                  formatValue={(v) => `${v} yrs`}
                />
              </div>

              {/* Decision Metrics */}
              <div className="mt-4 p-3.5 bg-red-50/95 border border-red-300 rounded text-xs font-mono space-y-1.5">
                <div className="flex justify-between items-baseline">
                  <span className="text-red-950">Deposits avoided:</span>
                  <span className="text-ink font-semibold text-sm">{formatINR(delayCalc.missedContributions, { compact: true })}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-red-950 font-bold">Wealth lost at maturity:</span>
                  <span className="text-red-950 font-bold text-sm">-{formatINR(delayCalc.costOfDelay, { compact: true })}</span>
                </div>
              </div>
            </div>

            {/* Verdict */}
            <div className="mt-5 pt-3.5 border-t border-border/80">
              <p className="text-xs sm:text-sm font-sans text-ink leading-relaxed">
                Waiting {waitYears} years saves {formatINR(delayCalc.missedContributions, { compact: true })} in cash today, but wipes out <strong className="text-red-950 font-bold">{formatINR(delayCalc.costOfDelay, { compact: true })}</strong> at maturity. Time is the one leverage you cannot buy back.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
