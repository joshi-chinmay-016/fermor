'use client';

import React from 'react';

interface ArticleEntry {
  title: string;
  dek: string;
  topic: string;
  readTime: string;
  slug: string;
}

export function Learn() {
  const articles: ArticleEntry[] = [
    {
      title: 'Why your EMI is the wrong number to look at',
      dek: 'How a loan that consumes 25% of your paycheck quietly pushes total obligations past the danger mark.',
      topic: 'Debt & Solvency',
      readTime: '4 min read',
      slug: '#',
    },
    {
      title: 'What 18 months of waiting actually costs',
      dek: 'The hidden price of delay isn’t the money you didn’t deposit. It’s the final 5 years of compounding you clipped off.',
      topic: 'Compounding Horizon',
      readTime: '6 min read',
      slug: '#',
    },
    {
      title: 'FD, PPF or SIP: the question behind the question',
      dek: 'Choosing an instrument before clarifying whether you are protecting liquidity or purchasing power guarantees frustration.',
      topic: 'Asset Allocation',
      readTime: '5 min read',
      slug: '#',
    },
    {
      title: 'The 40% debt rule: why lenders care and when to ignore them',
      dek: 'Understanding bank risk models, debt-to-income limits, and why high-income borrowers can sometimes bend the rules.',
      topic: 'Credit Modeling',
      readTime: '5 min read',
      slug: '#',
    },
  ];

  return (
    <section id="learn" className="py-12 md:py-16 bg-bg-subtle border-b border-border">
      <div className="max-w-container mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Section Header */}
        <div className="max-w-2xl mb-8 md:mb-10">
          <h2 className="text-display-lg font-serif text-ink tracking-tight uppercase leading-tight">
            Money explained <br />
            <span className="italic font-normal lowercase tracking-normal">without</span> the jargon.
          </h2>
          <p className="mt-3 text-base md:text-lg text-ink font-normal leading-relaxed">
            Written like a thoughtful dispatch for people who value first principles over sales pitches.
          </p>
        </div>

        {/* Magazine Contents Page Style List */}
        <div className="divide-y divide-border/80 border-t border-b border-border/80">
          {articles.map((art, idx) => (
            <article
              key={idx}
              className="py-6 md:py-7 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-8 items-baseline group hover:bg-bg/60 transition-colors px-2 sm:px-4 -mx-2 sm:-mx-4 rounded-sm"
            >
              {/* Meta column */}
              <div className="md:col-span-3 flex md:flex-col justify-between md:justify-start gap-1.5">
                <span className="text-xs font-mono uppercase tracking-wider text-accent font-semibold">
                  {art.topic}
                </span>
                <span className="text-xs font-mono text-ink-muted font-medium">
                  {art.readTime}
                </span>
              </div>

              {/* Title & Dek column */}
              <div className="md:col-span-8 space-y-1.5">
                <h3 className="text-2xl sm:text-3xl font-serif text-ink tracking-tight group-hover:text-accent transition-colors leading-snug font-medium">
                  <a href={art.slug} className="focus:outline-none">
                    {art.title}
                  </a>
                </h3>
                <p className="text-sm md:text-base text-ink-muted leading-relaxed font-sans max-w-2xl">
                  {art.dek}
                </p>
              </div>

              {/* Arrow glyph */}
              <div className="hidden md:flex md:col-span-1 justify-end">
                <span className="font-serif text-2xl text-ink-muted group-hover:text-accent group-hover:translate-x-1 transition-all">
                  &rarr;
                </span>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
