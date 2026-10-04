/**
 * Product-wide assumptions and reference benchmarks.
 * Every figure here is explicit, defensible, and user-inspectable.
 */

export const ASSUMPTIONS = {
  // Hero benchmark: 10-year horizon, 12% broad equity market return (compounded monthly)
  HERO_HORIZON_YEARS: 10,
  HERO_ANNUAL_RETURN: 0.12,
  HERO_DEFAULT_MONTHLY: 15000,
  HERO_MIN_MONTHLY: 1000,
  HERO_MAX_MONTHLY: 100000,

  // Simulator benchmarks
  SIMULATOR_DEFAULT_MONTHLY: 25000,
  SIMULATOR_DEFAULT_RETURN: 0.12,
  SIMULATOR_DEFAULT_YEARS: 15,
  SIMULATOR_DEFAULT_DELAY: 3,
  DEFAULT_INFLATION_RATE: 0.06, // 6% long-term RBI target corridor upper bound

  // Debt affordability guidelines
  DTI_HEALTHY_THRESHOLD: 0.35, // Below 35% of monthly income
  DTI_STRETCH_THRESHOLD: 0.45, // 40-50% rule of thumb where banks scrutinize solvency

  // Ask Fermor default scenario
  DEFAULT_SCENARIO: {
    monthlyIncome: 85000,
    existingCommitments: 18000,
    assetPrice: 1200000,
    downPayment: 200000,
    tenureYears: 5,
    annualInterestRate: 0.095,
  },
} as const;

export const SCENARIO_PRESETS = [
  {
    id: 'car',
    label: 'Car purchase',
    description: 'Mid-size hatchback or compact SUV with 5-year auto loan',
    income: 85000,
    commitments: 18000,
    price: 1200000,
    downPayment: 200000,
    tenureYears: 5,
    rate: 0.095,
  },
  {
    id: 'home',
    label: 'First home',
    description: 'Tier-1 suburban apartment with 20-year floating mortgage',
    income: 180000,
    commitments: 25000,
    price: 7500000,
    downPayment: 1500000,
    tenureYears: 20,
    rate: 0.086,
  },
  {
    id: 'education',
    label: 'Post-graduate degree',
    description: 'Global master’s degree with 7-year student loan',
    income: 70000,
    commitments: 5000,
    price: 3500000,
    downPayment: 500000,
    tenureYears: 7,
    rate: 0.1025,
  },
] as const;
