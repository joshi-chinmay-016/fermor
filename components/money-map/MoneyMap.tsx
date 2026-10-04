'use client';

import React, { useState } from 'react';

interface NodeItem {
  id: string;
  title: string;
  shortDesc: string;
  exampleQuestion: string;
  concreteInsight: string;
  formulaNote: string;
  cx: number;
  cy: number;
}

const NODES: NodeItem[] = [
  {
    id: 'investments',
    title: 'Investments',
    shortDesc: 'Systematic capital accumulation across broad equity indices, debt, and hybrid assets.',
    exampleQuestion: 'How much corpus will ₹25,000/month create in 15 years at 12%?',
    concreteInsight: '₹1.26 Cr projected corpus with ₹81.3L in compounded earnings.',
    formulaNote: 'FV = P * [((1+r)^n - 1) / r] * (1+r)',
    cx: 120,
    cy: 70,
  },
  {
    id: 'goals',
    title: 'Goals & Savings',
    shortDesc: 'Inflation-adjusted target planning for retirement, milestones, and emergency cushions.',
    exampleQuestion: 'What will a ₹30 Lakh college education cost in 12 years at 7% inflation?',
    concreteInsight: '₹67.57 Lakhs required nominal corpus at matriculation.',
    formulaNote: 'FV = PV * (1 + inflation)^years',
    cx: 480,
    cy: 70,
  },
  {
    id: 'tax',
    title: 'Tax Optimization',
    shortDesc: 'Side-by-side Old vs New Regime audit factoring Sec 80C, 80D, 80CCD(1B), and HRA.',
    exampleQuestion: 'At ₹22 Lakhs CTC, does New Regime 115BAC save more cash than Old Regime deductions?',
    concreteInsight: 'New Regime wins by ₹34,200 unless total deductions exceed ₹4.25 Lakhs.',
    formulaNote: 'Tax(Old) vs Tax(New Section 115BAC)',
    cx: 520,
    cy: 220,
  },
  {
    id: 'loans',
    title: 'Loans & Debt',
    shortDesc: 'Reducing balance amortization, total interest visibility, and prepayment leverage.',
    exampleQuestion: 'Does paying 1 extra EMI every year cut a 20-year mortgage by over 4 years?',
    concreteInsight: 'Saves ₹14.8 Lakhs in interest and ends the loan 51 months earlier.',
    formulaNote: 'Amortization schedule delta on balance principal',
    cx: 300,
    cy: 330,
  },
  {
    id: 'spending',
    title: 'Commitments & DTI',
    shortDesc: 'Fixed obligation debt-to-income audit to prevent insolvency and overextension.',
    exampleQuestion: 'Are my monthly EMIs and recurring liabilities crossing the safe 40% income line?',
    concreteInsight: 'Keeping non-discretionary debt under 35% preserves investment capacity.',
    formulaNote: 'DTI = (Total Monthly EMIs + Fixed Commitments) / Net Monthly Income',
    cx: 80,
    cy: 220,
  },
];

export function MoneyMap() {
  const [activeId, setActiveId] = useState<string>('investments');

  const activeNode = NODES.find((n) => n.id === activeId) || NODES[0];
  const center = { cx: 300, cy: 190 };

  return (
    <section id="money-map" className="py-12 md:py-16 bg-bg-subtle border-b border-border">
      <div className="max-w-container mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-8 md:mb-10">
          <h2 className="text-display-lg font-serif text-ink tracking-tight uppercase leading-tight">
            Connected by math, <br />
            <span className="italic font-normal lowercase tracking-normal">not divided</span> into silos.
          </h2>
          <p className="mt-3 text-base md:text-lg text-ink font-normal leading-relaxed">
            Every rupee you commit to a car loan subtracts from your compounding horizon.
            Fermor connects your financial nodes into a single living picture.
          </p>
        </div>

        {/* Content Layout: Interactive Diagram (Desktop) + Detail Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* SVG Map (Desktop & Tablet) */}
          <div className="hidden md:block lg:col-span-7 bg-bg border border-border rounded-md p-6 relative">
            <div className="text-[11px] font-mono uppercase text-ink-faint tracking-wider mb-2 flex justify-between">
              <span>Interactive Topology</span>
              <span>Tap or hover any node</span>
            </div>

            <svg
              viewBox="0 0 600 380"
              className="w-full h-auto select-none"
              role="region"
              aria-label="Interactive financial life node diagram"
            >
              <defs>
                <filter id="node-shadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#11110F" floodOpacity="0.06" />
                </filter>
              </defs>

              {/* Connecting Lines */}
              {NODES.map((node) => {
                const isActive = node.id === activeId;
                return (
                  <g key={`line-${node.id}`}>
                    <line
                      x1={center.cx}
                      y1={center.cy}
                      x2={node.cx}
                      y2={node.cy}
                      stroke={isActive ? '#1F5C45' : '#DEDBD2'}
                      strokeWidth={isActive ? 2.5 : 1.25}
                      strokeDasharray={isActive ? 'none' : '3 3'}
                      className="transition-all duration-300"
                    />
                    {isActive && (
                      <circle
                        cx={(center.cx + node.cx) / 2}
                        cy={(center.cy + node.cy) / 2}
                        r="3"
                        fill="#1F5C45"
                        className="animate-ping"
                      />
                    )}
                  </g>
                );
              })}

              {/* Center Node (Fermor Hub) */}
              <g transform={`translate(${center.cx}, ${center.cy})`}>
                <circle r="44" fill="#FFFFFF" stroke="#DEDBD2" strokeWidth="1.5" filter="url(#node-shadow)" />
                <circle r="36" fill="#1F5C45" fillOpacity="0.08" />
                <text
                  textAnchor="middle"
                  y="-4"
                  className="fill-ink font-serif text-base font-medium tracking-tight"
                >
                  Fermor
                </text>
                <text
                  textAnchor="middle"
                  y="12"
                  className="fill-ink-muted font-mono text-[9px] uppercase tracking-wider"
                >
                  Engine
                </text>
              </g>

              {/* Orbital Nodes */}
              {NODES.map((node) => {
                const isActive = node.id === activeId;
                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.cx}, ${node.cy})`}
                    onClick={() => setActiveId(node.id)}
                    onMouseEnter={() => setActiveId(node.id)}
                    onFocus={() => setActiveId(node.id)}
                    tabIndex={0}
                    role="button"
                    aria-label={`Select ${node.title} node`}
                    aria-pressed={isActive}
                    className="cursor-pointer focus:outline-none group"
                  >
                    {/* Hit area */}
                    <circle r="36" fill="transparent" />

                    {/* Node circle */}
                    <circle
                      r={isActive ? 30 : 26}
                      fill={isActive ? '#1F5C45' : '#FFFFFF'}
                      stroke={isActive ? '#1F5C45' : '#DEDBD2'}
                      strokeWidth={isActive ? 2 : 1}
                      filter="url(#node-shadow)"
                      className="transition-all duration-200"
                    />

                    {/* Inner accent ring */}
                    {isActive && (
                      <circle
                        r="34"
                        fill="none"
                        stroke="#1F5C45"
                        strokeWidth="1"
                        strokeOpacity="0.3"
                        className="animate-pulse"
                      />
                    )}

                    {/* Label */}
                    <text
                      textAnchor="middle"
                      y={isActive ? '4' : '3'}
                      className={`text-xs font-medium font-sans select-none transition-colors ${
                        isActive ? 'fill-bg font-semibold' : 'fill-ink group-hover:fill-accent'
                      }`}
                    >
                      {node.title.split(' ')[0]}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Mobile Vertical List with Connected Line */}
          <div className="block md:hidden space-y-2">
            <div className="text-xs font-mono uppercase text-ink-muted mb-3">
              Select a life node:
            </div>
            <div className="relative pl-6 border-l-2 border-border space-y-3">
              {NODES.map((node) => {
                const isActive = node.id === activeId;
                return (
                  <button
                    key={node.id}
                    onClick={() => setActiveId(node.id)}
                    className={`w-full text-left p-3.5 rounded-sm border transition-all relative ${
                      isActive
                        ? 'bg-bg-white border-accent shadow-sm'
                        : 'bg-bg border-border/70 hover:border-border'
                    }`}
                  >
                    {/* Indicator pip */}
                    <span
                      className={`absolute -left-[31px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 ${
                        isActive
                          ? 'bg-accent border-bg-white'
                          : 'bg-border border-bg'
                      }`}
                    />
                    <div className="flex justify-between items-baseline">
                      <span className="font-serif text-base text-ink font-medium">
                        {node.title}
                      </span>
                      {isActive && (
                        <span className="text-[10px] font-mono text-accent uppercase tracking-wider">
                          Active
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Node Details & Concrete Example */}
          <div className="lg:col-span-5">
            <div className="bg-bg-white border border-border p-6 sm:p-8 rounded-md shadow-sm">
              <div className="flex items-center justify-between pb-3.5 border-b border-border/80">
                <span className="text-xs font-mono uppercase tracking-wider text-accent font-semibold">
                  {activeNode.title}
                </span>
                <span className="text-xs font-mono text-ink-muted">
                  Interactive Node
                </span>
              </div>

              <h3 className="mt-3.5 text-2xl font-serif text-ink tracking-tight font-medium">
                {activeNode.title}
              </h3>
              <p className="mt-2 text-sm text-ink-muted leading-relaxed font-sans">
                {activeNode.shortDesc}
              </p>

              {/* Concrete Example Box */}
              <div className="mt-5 p-4 rounded-sm bg-bg-subtle border border-border">
                <span className="text-xs font-mono uppercase tracking-wider text-ink font-semibold block mb-1">
                  Concrete Question Answered
                </span>
                <p className="text-base font-serif font-medium text-ink italic leading-snug">
                  &ldquo;{activeNode.exampleQuestion}&rdquo;
                </p>
                <div className="mt-3 pt-3 border-t border-border/80 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
                  <span className="text-xs font-mono text-ink font-semibold">
                    {activeNode.concreteInsight}
                  </span>
                </div>
              </div>

              {/* Math / Formula disclosure */}
              <div className="mt-4 flex items-center justify-between text-xs font-mono text-ink-muted pt-1">
                <span className="font-semibold text-ink">Model rule:</span>
                <span className="truncate max-w-[260px] text-right font-medium text-ink">{activeNode.formulaNote}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
