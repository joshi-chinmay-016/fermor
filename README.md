# Fermor — Where is your money taking you?

Fermor is a financial clarity homepage concept designed around the foundational principle that personal finance is not a static number, but a trajectory shaped by daily and monthly decisions. Instead of static marketing copy or black-box algorithms, the interface functions as a live working model of personal finance: visitors change one parameter and immediately see how their future bends across compounding, borrowing, and inflation horizons.

---

## Architecture & Technology Stack

- **Framework**: Next.js 14 (App Router), React 18, TypeScript (strict mode).
- **Styling**: Tailwind CSS with custom design tokens mapped to CSS variables. High-contrast editorial palette (`#F7F6F2` warm background, `#11110F` deep ink, `#36342E` muted ink, `#1F5C45` restrained forest accent).
- **Typography**: Display typography in Instrument Serif; UI, body copy, and tabular numbers in Inter/Geist. Loaded via `next/font` for zero layout shift.
- **Charts**: 100% hand-built SVG path mathematics (`components/hero/Trajectory.tsx`). Zero third-party charting libraries, ensuring deterministic rendering, minuscule JavaScript bundle size (~28 kB route JS), and instant load times.
- **Testing**: Vitest for deterministic calculation verification and edge cases.

---

## Financial Formulas & Sanity Assertion

All mathematical models reside in [`lib/calculations.ts`](file:///c:/fermor/lib/calculations.ts) as pure, side-effect-free TypeScript functions:

1. **Systematic Investment Plan (SIP) Future Value (Annuity Due)**:
   $$\text{FV} = P \times \left[ \frac{(1 + r)^n - 1}{r} \right] \times (1 + r)$$
   Where:
   - $P$ = monthly deposit
   - $r = \frac{\text{annual return}}{12}$
   - $n = \text{years} \times 12$
   
   *Sanity Benchmark*: ₹10,000/month at 12% annual return over 10 years yields **₹23,23,391** (asserted in automated Vitest suite).

2. **Equated Monthly Installment (EMI)**:
   $$\text{EMI} = \frac{P \times r \times (1 + r)^n}{(1 + r)^n - 1}$$
   Where $P$ is borrowed loan principal and $r$ is monthly interest rate.

3. **Cost of Delay**:
   $$\text{Cost} = \text{FV}(\text{Horizon}) - \text{FV}(\text{Horizon} - \text{Delay})$$
   Isolates forgone compounding from missed nominal deposits.

4. **Inflation Deflator**:
   $$\text{Real Value} = \frac{\text{Nominal FV}}{(1 + i)^{\text{years}}}$$
   Discounted using standard 6% long-term inflation target.

5. **Indian Number Formatting**:
   Full support for Indian numeric grouping (Lakhs and Crores via [`lib/format.ts`](file:///c:/fermor/lib/format.ts)).

---

## Core Product Decisions

1. **One Dial in the Hero vs. Multi-Variable Simulator**:
   The hero focuses exclusively on monthly investment allocation. A single dial and responsive trajectory teach the core philosophy in five seconds. The full multi-variable simulator ("Move the Future") appears later on the page, introducing rate sensitivity, horizon duration, cost of delay, and inflation adjustment.
2. **Ghost Line Baseline in the Simulator**:
   When adjusting parameters in the Move the Future simulator, a muted dashed ghost line preserves the initial starting scenario. The shaded delta polygon between both curves quantifies the exact financial divergence created by that choice.
3. **Structured Ledger Walkthrough Over Chatbots**:
   Rather than speculative generative text or chat bubbles, "Ask Fermor" presents a deterministic statement of cash flow and loan affordability. It surfaces the honest total debt-to-income (DTI) ratio, warning when an individually affordable EMI pushes aggregate household debt beyond the standard 40–50% guideline.
4. **Native Accessible Range Inputs**:
   All sliders use semantic HTML `<input type="range">` elements styled with CSS, ensuring full keyboard operation, touch hit-targets ($\ge 44\text{px}$), and polite debounced `aria-live` screen-reader announcements.

---

## Accessibility & Performance

- **Lighthouse Performance**: Pure static generation, no heavy charting dependencies, 116 kB total first-load JS.
- **Tabular Figures**: `font-variant-numeric: tabular-nums` applied across all dynamic numbers to eliminate horizontal jitter during live animation.
- **Reduced Motion**: Full support for `prefers-reduced-motion` across SVG line animations, count springs, and scroll transitions.
- **High Contrast**: All body copy and metadata tags satisfy WCAG AA/AAA standards against the off-white background.

---

## Getting Started Locally

```bash
# Clone the repository
git clone <repo-url>
cd fermor

# Install dependencies
npm install

# Run unit tests
npm test

# Build production bundle
npm run build

# Start local server
npm run start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.
