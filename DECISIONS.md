# Design & Architectural Decisions: Fermor Homepage

This document details key product design, typographic, mathematical, and interaction decisions made while creating the Fermor homepage concept.

---

## 1. Eliminated Structural Meta-Numbering ("Act 01", "Node #")
- **The Challenge:** Adding overt screenplay or structural labels ("Act 01 — The Baseline", "Node #1", "Act 05.2") draws unnecessary attention to the scaffolding rather than the financial insight.
- **The Decision:** Removed all "Act" and artificial numbering. Subtitles now either state their purpose directly ("Trajectory Simulator", "Capital Flow Topology", "Decision Ledger") or are omitted where the typography and data speak for themselves. The page reads like an authentic, calm financial instrument.

## 2. Tightened Vertical Rhythm and Spacing
- **The Challenge:** Expansive white space (often a default in generic fintech SaaS templates) made the original layout feel sparse, forcing excessive scrolling and disconnecting cause-and-effect between inputs and outputs.
- **The Decision:** Reduced oversized vertical padding (`py-24`/`py-36`) across sections to a disciplined, editorial rhythm (`py-12` to `py-16`). Brought input controls and live reactive charts closer together so adjustments remain within the user's immediate visual field.

## 3. High-Contrast Editorial Color Palette
- **The Challenge:** Muted stone and faint gray tones (e.g., `#8E8B82` on `#F7F6F2`) created low contrast, failing WCAG standards and making vital financial metadata hard to read on dimmer screens.
- **The Decision:** 
  - Darkened `ink.muted` to `#36342E` and `ink.faint` to `#545149`, achieving contrast ratios exceeding 7:1 across all body copy, axis ticks, formulas, and labels.
  - Upgraded chart axis labels to `#2B2924` with font-medium tabular figures.
  - Retained the signature desaturated forest green (`#1F5C45`) strictly for compounding trajectories, positive variance callouts, and the primary simulation action.

## 4. Single Dial in Hero vs. Multi-Variable Simulator
- **The Challenge:** Putting full multi-slider simulators in both the Hero and the body leads to interaction fatigue and redundancy.
- **The Decision:**
  - **Hero:** Exactly one dial (monthly SIP allocation). Instantly demonstrates that money is a trajectory, not a static balance, generating a 10-year projection at a fixed 12% benchmark.
  - **Move the Future:** Adds the second-order insights: return variance (6%–16%), horizon (3–30 years), the quantifiable cost of waiting (0–5 years delay), and inflation discounting (6% real purchasing power).

## 5. Structured Decision Ledger Over Chatbot
- **The Challenge:** Conversational AI / chatbots in financial products frequently hallucinate, stream unpredictable token delays, and obscure underlying loan amortisation schedules.
- **The Decision:** Built Ask Fermor as a clean, deterministic ledger formatted like a high-end bank statement. It computes exact reducing-balance interest and highlights the honest total debt-to-income (DTI) ratio, demonstrating that an apparently affordable 24.7% EMI can push total debt obligations past the 45% strain line.

## 6. Hand-Built SVG Trajectory Primitive
- **The Challenge:** External charting libraries (Chart.js, Recharts) bring heavy bundle overhead, non-deterministic canvas rendering, and generic visual presets.
- **The Decision:** Hand-coded smooth cubic Bezier paths (`Trajectory.tsx`) with zero charting dependencies. Includes native path morphing, dashed invested baselines, ghost-line delta polygons, and full `prefers-reduced-motion` compliance.

## 7. Native Accessible Form Controls
- **The Challenge:** Custom div-based slider sliders break native keyboard navigation, mobile touch targets, and assistive technology announcements.
- **The Decision:** Styled native `<input type="range">` elements with CSS, providing keyboard accessibility, ARIA value text attributes, and polite debounced `aria-live` announcements for real-time calculation figures.
