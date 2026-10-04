'use client';

import React from 'react';

export function CTA() {
  return (
    <section className="py-14 md:py-20 bg-bg border-b border-border text-center">
      <div className="max-w-container mx-auto px-4 sm:px-6 md:px-8">
        <div className="max-w-3xl mx-auto space-y-5">
          <h2 className="text-display-2xl font-serif text-ink tracking-tight uppercase leading-[0.98]">
            Make your money <br />
            <span className="italic font-normal lowercase tracking-normal">make more sense.</span>
          </h2>

          <p className="text-lg md:text-xl text-ink max-w-xl mx-auto font-normal leading-relaxed">
            Understand where you are. See where you could go.
            No commissions, no dark patterns, no opaque algorithms.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#simulator"
              className="w-full sm:w-auto px-8 py-4 rounded-sm bg-accent text-bg hover:bg-accent-hover text-sm font-semibold tracking-wider uppercase transition-all shadow-sm"
            >
              Explore Fermor Tools
            </a>
            <a
              href="#ask-fermor"
              className="w-full sm:w-auto px-8 py-4 rounded-sm bg-bg-white border border-border text-ink hover:border-ink text-sm font-semibold tracking-wider uppercase transition-all"
            >
              Audit A Decision
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
