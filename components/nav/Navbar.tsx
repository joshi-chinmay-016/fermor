'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Philosophy', href: '#money-map' },
    { label: 'Move the Future', href: '#simulator' },
    { label: 'Decisions', href: '#questions' },
    { label: 'Ask Fermor', href: '#ask-fermor' },
    { label: 'Toolkit', href: '#toolkit' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-bg/90 backdrop-blur-md border-b border-border/70 transition-colors">
      <div className="max-w-container mx-auto px-4 sm:px-6 md:px-8 h-16 flex items-center justify-between">
        {/* Typographic Wordmark */}
        <Link
          href="/"
          className="group flex items-baseline gap-1.5 focus-visible:outline-accent"
        >
          <span className="font-serif text-2xl tracking-tight text-ink group-hover:text-accent transition-colors font-medium">
            Fermor
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-ink-muted hover:text-ink transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="#simulator"
            className="text-xs uppercase tracking-wider font-semibold px-4 py-2 rounded-sm bg-accent text-bg hover:bg-accent-hover transition-colors shadow-sm"
          >
            Move the Future
          </a>
        </div>

        {/* Mobile Minimal Bar */}
        <div className="flex md:hidden items-center gap-3">
          <a
            href="#simulator"
            className="text-xs font-semibold px-3 py-1.5 rounded-sm bg-accent text-bg hover:bg-accent-hover transition-colors"
          >
            Simulate
          </a>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
            className="p-2 text-ink hover:text-accent focus-visible:outline-accent"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M4 7h16M4 12h16M4 17h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Sheet */}
      {mobileMenuOpen && (
        <div
          className="md:hidden border-b border-border bg-bg-subtle px-6 py-5 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-150"
          role="dialog"
          aria-modal="true"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-base font-medium text-ink hover:text-accent py-1"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 border-t border-border flex justify-between items-center text-xs text-ink-muted">
            <span>Show the math. No black boxes.</span>
            <span className="font-mono text-accent">fermor.in</span>
          </div>
        </div>
      )}
    </header>
  );
}
