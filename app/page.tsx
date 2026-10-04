import React from 'react';
import { Navbar } from '@/components/nav/Navbar';
import { Hero } from '@/components/hero/Hero';
import { MoneyMap } from '@/components/money-map/MoneyMap';
import { FutureSimulator } from '@/components/simulator/FutureSimulator';
import { DecisionQuestions } from '@/components/questions/DecisionQuestions';
import { AskFermor } from '@/components/ask/AskFermor';
import { ToolkitDeeper } from '@/components/toolkit/ToolkitDeeper';
import { CTA } from '@/components/footer/CTA';
import { Footer } from '@/components/footer/Footer';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-bg text-ink">
      <Navbar />
      
      {/* 1. Hero: Where is your money taking you? */}
      <Hero />

      {/* 2. Financial Life / Fermor Philosophy: Connected capital topology & manifesto */}
      <MoneyMap />

      {/* 3. Signature Interaction: Move the Future (The Difference Moment) */}
      <FutureSimulator />

      {/* 4. Real Financial Questions: The Questions That Cost Us Money */}
      <DecisionQuestions />

      {/* 5. Ask Fermor: Real questions answered with clear reasoning */}
      <AskFermor />

      {/* 6. Lightweight Product Ecosystem: When You Need to Go Deeper */}
      <ToolkitDeeper />

      {/* 7. Final Action & Illustrative Footnote */}
      <CTA />
      <Footer />
    </main>
  );
}
