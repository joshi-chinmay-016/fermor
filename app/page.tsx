import React from 'react';
import { Navbar } from '@/components/nav/Navbar';
import { Hero } from '@/components/hero/Hero';
import { Interlude } from '@/components/interlude/Interlude';
import { MoneyMap } from '@/components/money-map/MoneyMap';
import { FutureSimulator } from '@/components/simulator/FutureSimulator';
import { AskFermor } from '@/components/ask/AskFermor';
import { QuestionCards } from '@/components/questions/QuestionCards';
import { Learn } from '@/components/learn/Learn';
import { CTA } from '@/components/footer/CTA';
import { Footer } from '@/components/footer/Footer';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-bg text-ink">
      <Navbar />
      
      {/* Hero: Where is your money taking you? */}
      <Hero />

      {/* Editorial Interlude */}
      <Interlude />

      {/* Money Map: Connected financial topology */}
      <MoneyMap />

      {/* Move the Future: Multi-variable simulator */}
      <FutureSimulator />

      {/* Structured Decision Walkthrough & Four Questions */}
      <AskFermor />
      <QuestionCards />

      {/* Editorial Dispatches & Forward Action */}
      <Learn />
      <CTA />
      <Footer />
    </main>
  );
}
