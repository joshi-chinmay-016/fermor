'use client';

import React, { useState } from 'react';

interface NodeItem {
  id: string;
  title: string;
  tagline: string;
  microMetric: string;
  shortDesc: string;
  exampleQuestion: string;
  concreteInsight: string;
  formulaNote: string;
  cx: number;
  cy: number;
  isTop: boolean;
  iconType: 'investments' | 'goals' | 'tax' | 'loans' | 'commitments';
}

const NODES: NodeItem[] = [
  {
    id: 'investments',
    title: 'Investments',
    tagline: 'Systematic Equity & Indexing',
    microMetric: '+12% Compounding',
    shortDesc: 'Systematic capital accumulation across broad equity indices, debt, and hybrid assets.',
    exampleQuestion: 'How much corpus will ₹25,000/month create in 15 years at 12%?',
    concreteInsight: '₹1.26 Cr projected corpus with ₹81.3L in compounded earnings.',
    formulaNote: 'FV = P * [((1 + r)^n - 1) / r] * (1 + r)',
    cx: 170,
    cy: 115,
    isTop: true,
    iconType: 'investments',
  },
  {
    id: 'goals',
    title: 'Goals & Target',
    tagline: 'Inflation-Adjusted Milestones',
    microMetric: '6% Purchasing Power',
    shortDesc: 'Inflation-adjusted target planning for retirement, milestones, and emergency cushions.',
    exampleQuestion: 'What will a ₹30 Lakh college education cost in 12 years at 7% inflation?',
    concreteInsight: '₹67.57 Lakhs required nominal corpus at matriculation.',
    formulaNote: 'FV = PV * (1 + inflation)^years',
    cx: 510,
    cy: 115,
    isTop: true,
    iconType: 'goals',
  },
  {
    id: 'tax',
    title: 'Tax Strategy',
    tagline: 'Old vs New 115BAC Audit',
    microMetric: 'Deductions Break-even',
    shortDesc: 'Side-by-side Old vs New Regime audit factoring Sec 80C, 80D, 80CCD(1B), and HRA.',
    exampleQuestion: 'At ₹22 Lakhs CTC, does New Regime 115BAC save more cash than Old Regime deductions?',
    concreteInsight: 'New Regime wins by ₹34,200 unless total deductions exceed ₹4.25 Lakhs.',
    formulaNote: 'Tax(Old) vs Tax(New Section 115BAC)',
    cx: 525,
    cy: 290,
    isTop: false,
    iconType: 'tax',
  },
  {
    id: 'loans',
    title: 'Loans & Debt',
    tagline: 'True Amortization Cost',
    microMetric: 'Reducing Balance Delta',
    shortDesc: 'Reducing balance amortization, total interest visibility, and prepayment leverage.',
    exampleQuestion: 'Does paying 1 extra EMI every year cut a 20-year mortgage by over 4 years?',
    concreteInsight: 'Saves ₹14.8 Lakhs in interest and ends the loan 51 months earlier.',
    formulaNote: 'Amortization schedule delta on balance principal',
    cx: 340,
    cy: 350,
    isTop: false,
    iconType: 'loans',
  },
  {
    id: 'spending',
    title: 'Commitments',
    tagline: 'Fixed Obligations & DTI',
    microMetric: '< 40% Solvency Guideline',
    shortDesc: 'Fixed obligation debt-to-income audit to prevent insolvency and overextension.',
    exampleQuestion: 'Are my monthly EMIs and recurring liabilities crossing the safe 40% income line?',
    concreteInsight: 'Keeping non-discretionary debt under 35% preserves investment capacity.',
    formulaNote: 'DTI = (Total Monthly EMIs + Fixed Commitments) / Net Monthly Income',
    cx: 155,
    cy: 290,
    isTop: false,
    iconType: 'commitments',
  },
];

function NodeIcon({ type, isActive }: { type: NodeItem['iconType']; isActive: boolean }) {
  const strokeColor = isActive ? '#FFFFFF' : '#11110F';

  switch (type) {
    case 'investments':
      return (
        <g stroke={strokeColor} fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M-9 7 L-3 1 L3 5 L10 -5" />
          <path d="M5 -5 L10 -5 L10 0" />
        </g>
      );
    case 'goals':
      return (
        <g stroke={strokeColor} fill="none">
          <circle r="9" strokeWidth="2" />
          <circle r="4" strokeWidth="1.75" />
          <circle r="1.5" fill={strokeColor} />
        </g>
      );
    case 'tax':
      return (
        <g stroke={strokeColor} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M-8 -5 L8 -5 M0 -7 L0 8" />
          <path d="M-9 4 L-3 4 L-6 -3 Z" />
          <path d="M3 4 L9 4 L6 -3 Z" />
        </g>
      );
    case 'loans':
      return (
        <g stroke={strokeColor} fill="none" strokeWidth="2.2" strokeLinecap="round">
          <path d="M-8 -3 L8 -3 M-8 4 L8 4" />
          <path d="M4 -8 L-4 8" />
        </g>
      );
    case 'commitments':
      return (
        <g stroke={strokeColor} fill="none" strokeLinejoin="round">
          <path d="M-7 -4 C-7 4 0 8 0 8 C0 8 7 4 7 -4 L7 -8 L-7 -8 Z" strokeWidth="2" />
          <path d="M-3 -2 L-0.5 0.5 L3.5 -3.5" strokeWidth="1.75" strokeLinecap="round" />
        </g>
      );
  }
}

export function MoneyMap() {
  const [activeId, setActiveId] = useState<string>('investments');

  const activeNode = NODES.find((n) => n.id === activeId) || NODES[0];
  const center = { cx: 340, cy: 215 };

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
            Every rupee committed to an EMI subtracts from your compounding horizon.
            Fermor connects your financial nodes into a living, unified picture.
          </p>
        </div>

        {/* Content Layout: Interactive Diagram + Detail Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Enhanced SVG Map (Desktop & Tablet) */}
          <div className="hidden md:block lg:col-span-7 bg-bg border border-border rounded-md p-6 relative overflow-hidden shadow-xs">
            <div className="text-xs font-mono uppercase text-ink font-bold tracking-wider mb-2 flex justify-between">
              <span>Capital Flow Topology</span>
              <span className="text-ink-muted font-medium">Click or hover any node</span>
            </div>

            <svg
              viewBox="0 0 680 440"
              className="w-full h-auto select-none"
              role="region"
              aria-label="Interactive financial life node diagram"
            >
              <defs>
                <filter id="hub-shadow" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#11110F" floodOpacity="0.08" />
                </filter>
                <radialGradient id="hub-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#1F5C45" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#1F5C45" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Background Concentric Radar Rings */}
              <circle cx={center.cx} cy={center.cy} r="185" fill="none" stroke="#DEDBD2" strokeWidth="1" strokeDasharray="3 4" opacity="0.6" />
              <circle cx={center.cx} cy={center.cy} r="125" fill="none" stroke="#DEDBD2" strokeWidth="1" strokeDasharray="2 3" opacity="0.4" />
              <circle cx={center.cx} cy={center.cy} r="75" fill="url(#hub-glow)" />

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
                      stroke={isActive ? '#1F5C45' : '#CDC9BD'}
                      strokeWidth={isActive ? 2.5 : 1.25}
                      strokeDasharray={isActive ? 'none' : '4 4'}
                      className="transition-all duration-300"
                    />

                    {isActive && (
                      <circle
                        cx={(center.cx * 0.45 + node.cx * 0.55)}
                        cy={(center.cy * 0.45 + node.cy * 0.55)}
                        r="3.5"
                        fill="#1F5C45"
                        className="animate-ping"
                      />
                    )}
                  </g>
                );
              })}

              {/* Center Node (Fermor Hub) */}
              <g transform={`translate(${center.cx}, ${center.cy})`}>
                <circle r="48" fill="#FFFFFF" stroke="#DEDBD2" strokeWidth="1.5" filter="url(#hub-shadow)" />
                <circle r="40" fill="#1F5C45" fillOpacity="0.08" />
                <circle r="40" fill="none" stroke="#1F5C45" strokeWidth="1" strokeOpacity="0.25" />
                <text
                  textAnchor="middle"
                  y="-4"
                  fontSize="20"
                  fontFamily="var(--font-instrument-serif), Georgia, serif"
                  fontWeight="600"
                  fill="#11110F"
                >
                  Fermor
                </text>
                <text
                  textAnchor="middle"
                  y="15"
                  fontSize="10"
                  fontFamily="var(--font-geist-mono), monospace"
                  fontWeight="700"
                  letterSpacing="1"
                  fill="#1F5C45"
                >
                  ENGINE
                </text>
              </g>

              {/* Orbital Nodes with Distinct Badge + Large Readable Labels */}
              {NODES.map((node) => {
                const isActive = node.id === activeId;
                const isTop = node.isTop;

                return (
                  <g
                    key={node.id}
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
                    <circle cx={node.cx} cy={node.cy} r="46" fill="transparent" />

                    {/* Outer accent ring when active */}
                    {isActive && (
                      <circle
                        cx={node.cx}
                        cy={node.cy}
                        r="34"
                        fill="none"
                        stroke="#1F5C45"
                        strokeWidth="1.5"
                        strokeOpacity="0.35"
                        className="animate-pulse"
                      />
                    )}

                    {/* Circular Icon Badge */}
                    <circle
                      cx={node.cx}
                      cy={node.cy}
                      r={isActive ? 27 : 24}
                      fill={isActive ? '#1F5C45' : '#FFFFFF'}
                      stroke={isActive ? '#1F5C45' : '#B8B4A8'}
                      strokeWidth={isActive ? 2.5 : 1.5}
                      filter="url(#hub-shadow)"
                      className="transition-all duration-200"
                    />

                    {/* Centered Graphic Icon Inside Badge */}
                    <g transform={`translate(${node.cx}, ${node.cy})`}>
                      <NodeIcon type={node.iconType} isActive={isActive} />
                    </g>

                    {/* Node Text Group Placed Completely Outside the Circle */}
                    <g>
                      {/* Metric Tag */}
                      <text
                        x={node.cx}
                        y={isTop ? node.cy - 52 : node.cy + 62}
                        textAnchor="middle"
                        fontSize="11"
                        fontFamily="var(--font-geist-mono), monospace"
                        fontWeight="600"
                        letterSpacing="0.5"
                        fill={isActive ? '#1F5C45' : '#545149'}
                        className="uppercase select-none transition-colors"
                      >
                        {node.microMetric}
                      </text>

                      {/* Main Node Title */}
                      <text
                        x={node.cx}
                        y={isTop ? node.cy - 34 : node.cy + 45}
                        textAnchor="middle"
                        fontSize="15"
                        fontFamily="var(--font-geist-sans), system-ui, sans-serif"
                        fontWeight="700"
                        fill={isActive ? '#1F5C45' : '#11110F'}
                        className="select-none transition-colors group-hover:fill-accent"
                      >
                        {node.title}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Mobile Vertical List with Connected Line */}
          <div className="block md:hidden space-y-2">
            <div className="text-xs font-mono uppercase text-ink font-semibold mb-3">
              Select a financial life node:
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
                        ? 'bg-bg-white border-accent ring-1 ring-accent/30 shadow-sm'
                        : 'bg-bg border-border hover:border-ink'
                    }`}
                  >
                    {/* Indicator pip */}
                    <span
                      className={`absolute -left-[31px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 ${
                        isActive
                          ? 'bg-accent border-bg-white'
                          : 'bg-border-dark border-bg'
                      }`}
                    />
                    <div className="flex justify-between items-baseline">
                      <div>
                        <span className="font-sans text-base text-ink font-bold block">
                          {node.title}
                        </span>
                        <span className="text-xs font-mono text-ink-muted block mt-0.5">
                          {node.tagline}
                        </span>
                      </div>
                      <span className={`text-[11px] font-mono px-2 py-0.5 rounded font-semibold ${
                        isActive ? 'bg-accent-surface text-accent' : 'text-ink-muted'
                      }`}>
                        {node.microMetric}
                      </span>
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
                <span className="text-xs font-mono text-ink-muted font-medium">
                  {activeNode.microMetric}
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
                <span className="text-xs font-mono uppercase tracking-wider text-ink font-semibold block mb-1.5">
                  Concrete Question Answered
                </span>
                <p className="text-base font-sans font-medium text-ink leading-relaxed">
                  &ldquo;{activeNode.exampleQuestion}&rdquo;
                </p>
                <div className="mt-3 pt-3 border-t border-border/80 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
                  <span className="text-xs sm:text-sm font-mono text-ink font-semibold">
                    {activeNode.concreteInsight}
                  </span>
                </div>
              </div>

              {/* Math / Formula disclosure - Full width, not truncated */}
              <div className="mt-5 pt-3.5 border-t border-border flex flex-col gap-1.5 text-xs font-mono">
                <span className="font-semibold text-ink uppercase tracking-wider text-[11px]">
                  Model Formula:
                </span>
                <span className="text-ink font-mono bg-bg-subtle p-2.5 rounded border border-border break-words font-medium leading-relaxed">
                  {activeNode.formulaNote}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
