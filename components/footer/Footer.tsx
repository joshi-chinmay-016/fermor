'use client';

import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-bg py-10 text-ink border-t border-border">
      <div className="max-w-container mx-auto px-4 sm:px-6 md:px-8 space-y-8">
        
        {/* Upper Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-2.5">
            <Link href="/" className="inline-flex items-baseline gap-1.5">
              <span className="font-serif text-2xl tracking-tight text-ink font-medium">
                Fermor
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
            </Link>
            <p className="text-xs text-ink-muted leading-relaxed max-w-sm">
              A financial clarity instrument. Built around the foundational principle that money
              isn’t a static number &mdash; it’s a living trajectory shaped by every decision.
            </p>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs font-mono">
            <div className="space-y-2.5">
              <span className="text-ink font-bold uppercase tracking-wider block">
                Calculators
              </span>
              <ul className="space-y-1.5 text-ink-muted">
                <li><a href="#simulator" className="hover:text-ink font-medium">SIP Trajectory</a></li>
                <li><a href="#ask-fermor" className="hover:text-ink font-medium">EMI &amp; Solvency</a></li>
                <li><a href="#questions" className="hover:text-ink font-medium">Asset Comparison</a></li>
                <li><a href="#questions" className="hover:text-ink font-medium">Cost of Delay</a></li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <span className="text-ink font-bold uppercase tracking-wider block">
                Methodology
              </span>
              <ul className="space-y-1.5 text-ink-muted">
                <li><a href="#simulator" className="hover:text-ink font-medium">Annuity Due SIP Math</a></li>
                <li><a href="#ask-fermor" className="hover:text-ink font-medium">Reducing Balance EMI</a></li>
                <li><a href="#simulator" className="hover:text-ink font-medium">Inflation Deflator</a></li>
                <li><a href="#learn" className="hover:text-ink font-medium">Editorial Dispatches</a></li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <span className="text-ink font-bold uppercase tracking-wider block">
                Product
              </span>
              <ul className="space-y-1.5 text-ink-muted">
                <li><span className="text-accent font-semibold">fermor.in</span></li>
                <li><span className="text-ink font-medium">Open Models</span></li>
                <li><span className="text-ink font-medium">No Dark Patterns</span></li>
                <li><span className="text-ink font-medium">Zero Sponsored Funds</span></li>
              </ul>
            </div>
          </div>

        </div>

        {/* Legal Disclaimer & Regulatory Note */}
        <div className="pt-6 border-t border-border/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-xs text-ink-muted">
          <p className="max-w-2xl leading-relaxed">
            <strong className="text-ink font-semibold">Illustrative Disclaimer:</strong> Projections and simulations generated on Fermor are
            purely educational and illustrative based on mathematical formulas and user-supplied parameters.
            They do not constitute registered investment advice, financial solicitation, or a guarantee of future returns.
            Securities investments are subject to market risks.
          </p>
          <div className="shrink-0 text-right font-mono font-medium text-ink">
            <span>&copy; {new Date().getFullYear()} Fermor. Pure math.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
