'use client';

import React, { useState } from 'react';
import { AffordabilityTool } from './tools/Affordability';
import { CompareTool } from './tools/Compare';
import { LoanCostTool } from './tools/LoanCost';
import { DelayTool } from './tools/Delay';

interface QuestionDef {
  id: string;
  question: string;
  tagline: string;
  badge: string;
  gridSpan: string;
  component: React.ReactNode;
}

export function QuestionCards() {
  const [expandedId, setExpandedId] = useState<string | null>('affordability');

  const questions: QuestionDef[] = [
    {
      id: 'affordability',
      question: 'Should I buy this?',
      tagline: 'See what that phone, gadget, or discretionary expense really costs when financed on EMI.',
      badge: 'Affordability & Cash Flow',
      gridSpan: 'lg:col-span-7',
      component: <AffordabilityTool />,
    },
    {
      id: 'compare',
      question: 'Where should my money go?',
      tagline: 'Compare broad market index SIP, PPF, NPS, Gold, and Fixed Deposits at the exact same monthly pace.',
      badge: 'Asset Allocation',
      gridSpan: 'lg:col-span-5',
      component: <CompareTool />,
    },
    {
      id: 'loancost',
      question: 'Am I paying too much?',
      tagline: 'Uncover the full reducing-balance interest on your mortgage and see what a 1% rate cut saves.',
      badge: 'Debt Optimization',
      gridSpan: 'lg:col-span-6',
      component: <LoanCostTool />,
    },
    {
      id: 'delay',
      question: 'What happens if I wait?',
      tagline: 'The tangible rupee penalty of waiting 1, 2, or 3 years before starting systematic accumulation.',
      badge: 'Compounding Horizon',
      gridSpan: 'lg:col-span-6',
      component: <DelayTool />,
    },
  ];

  const toolkitIndex = [
    { name: 'SIP Calculator', desc: 'Annuity due monthly compounding' },
    { name: 'Reducing EMI', desc: 'True interest amortization' },
    { name: 'Tax 115BAC vs Old', desc: 'Regime threshold evaluator' },
    { name: 'Cumulative FD', desc: 'Quarterly compounding schedules' },
    { name: 'XIRR & CAGR', desc: 'Irregular cash flow returns' },
    { name: 'NPS Tier-I', desc: 'Retirement annuity split' },
    { name: 'PPF 15-Year', desc: 'Statutory sovereign yield' },
    { name: 'Prepayment Savings', desc: 'Early debt freedom schedules' },
  ];

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="questions" className="py-12 md:py-16 bg-bg border-b border-border">
      <div className="max-w-container mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-8 md:mb-10">
          <h2 className="text-display-lg font-serif text-ink tracking-tight uppercase leading-tight">
            Most financial decisions <br />
            <span className="italic font-normal lowercase tracking-normal">start with a question.</span>
          </h2>
          <p className="mt-3 text-base md:text-lg text-ink font-normal leading-relaxed">
            People don’t search for math formulas. They ask whether they can afford a car, where to allocate savings,
            or if a bank rate is bleeding them. Tap any card to test the numbers.
          </p>
        </div>

        {/* Asymmetric 4-Card Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {questions.map((q) => {
            const isExpanded = expandedId === q.id;
            return (
              <div
                key={q.id}
                className={`${q.gridSpan} bg-bg-white border transition-all duration-200 rounded-md p-6 sm:p-7 shadow-sm ${
                  isExpanded ? 'border-accent ring-1 ring-accent/30' : 'border-border hover:border-ink'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-mono uppercase tracking-wider text-accent font-semibold block">
                      {q.badge}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-serif text-ink tracking-tight font-medium">
                      {q.question}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleExpand(q.id)}
                    aria-expanded={isExpanded}
                    aria-label={`Toggle tool for: ${q.question}`}
                    className={`shrink-0 text-xs font-mono px-3.5 py-1.5 rounded-sm border transition-colors ${
                      isExpanded
                        ? 'bg-accent text-bg border-accent font-semibold shadow-xs'
                        : 'bg-bg-subtle text-ink border-border hover:border-ink font-semibold'
                    }`}
                  >
                    {isExpanded ? 'Close tool' : 'Test numbers'}
                  </button>
                </div>

                <p className="mt-2.5 text-sm text-ink-muted font-normal leading-relaxed">
                  {q.tagline}
                </p>

                {/* Inline Expanded Tool */}
                {isExpanded && <div className="mt-5">{q.component}</div>}
              </div>
            );
          })}
        </div>

        {/* Quiet Typographic Index of Full Toolkit */}
        <div className="mt-12 pt-8 border-t border-border/80">
          <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-ink font-semibold block mb-1">
                Directory &bull; Deterministic Engine
              </span>
              <h4 className="text-xl font-serif text-ink tracking-tight font-medium">
                The Broader Fermor Toolkit
              </h4>
            </div>
            <span className="text-xs font-mono text-ink-muted font-medium">
              All formulas open and inspectable
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs font-mono">
            {toolkitIndex.map((tool, idx) => (
              <div key={idx} className="space-y-1 group">
                <span className="text-ink font-bold group-hover:text-accent transition-colors block text-sm font-sans">
                  {tool.name}
                </span>
                <span className="text-ink-muted text-xs block font-normal leading-snug">
                  {tool.desc}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
