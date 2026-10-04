'use client';

import React from 'react';

interface ToolItem {
  code: string;
  name: string;
  question: string;
  formulaHint: string;
  benchmark: string;
}

const TOOLS: ToolItem[] = [
  {
    code: 'SIP',
    name: 'Systematic Investment',
    question: 'How does a monthly deposit compound over 10–25 years?',
    formulaHint: 'FV = P × [((1+r)^n - 1) / r] × (1+r)',
    benchmark: '12% Equity Index',
  },
  {
    code: 'EMI',
    name: 'Reducing Balance Loan',
    question: 'How much of my payment is pure interest vs borrowed principal?',
    formulaHint: 'P × r × (1+r)^n / ((1+r)^n - 1)',
    benchmark: '8.5% Home / 12% Auto',
  },
  {
    code: 'TAX',
    name: '115BAC Regime Arbitrage',
    question: 'At my salary and deductions, does the new or old regime leave more cash?',
    formulaHint: 'Min(Tax_Old(80C, HRA), Tax_New)',
    benchmark: 'FY 2024–25 Slabs',
  },
  {
    code: 'FD',
    name: 'Cumulative Fixed Deposit',
    question: 'After quarterly compounding and 6% inflation, what is my real purchasing power?',
    formulaHint: 'P × (1 + r/4)^(4n) / (1+i)^n',
    benchmark: '7.1% Sovereign / Bank',
  },
  {
    code: 'CAGR',
    name: 'Compound Annual Growth',
    question: 'What is the true smoothed annual rate of a multi-year investment?',
    formulaHint: '(Final / Initial)^(1/n) - 1',
    benchmark: 'Historical Benchmarks',
  },
  {
    code: 'XIRR',
    name: 'Irregular Cash Flows',
    question: 'What is my actual annualized return across irregular investments and redemptions?',
    formulaHint: '∑ CF_t / (1 + r)^(t_i / 365) = 0',
    benchmark: 'Real Portfolio Returns',
  },
];

export function ToolkitDeeper() {
  return (
    <section id="toolkit" className="py-12 md:py-16 bg-bg-subtle border-b border-border">
      <div className="max-w-container mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-8 md:mb-10">
          <span className="text-xs font-mono uppercase tracking-widest text-accent font-bold block mb-2">
            The Instrument Ecosystem
          </span>
          <h2 className="text-display-lg font-serif text-ink tracking-tight uppercase leading-tight">
            When you need to <br />
            <span className="italic font-normal lowercase tracking-normal text-accent">go deeper.</span>
          </h2>
          <p className="mt-4 text-base md:text-lg text-ink font-normal leading-relaxed max-w-2xl">
            Clean, deterministic instruments built for specific edge cases.
            No sales funnels, no promoted mutual funds, no opaque calculations.
          </p>
        </div>

        {/* Quiet 6-Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {TOOLS.map((tool) => (
            <div
              key={tool.code}
              className="bg-bg-white border border-border rounded-md p-5 sm:p-6 flex flex-col justify-between hover:border-ink transition-all shadow-xs group"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-border/70 mb-3">
                  <span className="text-xs font-mono font-bold text-accent uppercase tracking-wider">
                    {tool.code}
                  </span>
                  <span className="text-[11px] font-mono text-ink-muted">
                    {tool.benchmark}
                  </span>
                </div>

                <h3 className="text-lg font-serif font-medium text-ink group-hover:text-accent transition-colors">
                  {tool.name}
                </h3>
                
                <p className="mt-2 text-xs sm:text-sm text-ink-muted leading-relaxed font-sans">
                  {tool.question}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border/60">
                <span className="font-mono text-[11px] text-ink block truncate">
                  {tool.formulaHint}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
