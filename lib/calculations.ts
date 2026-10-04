/**
 * Core financial calculations for Fermor.
 * Pure, deterministic functions with explicit assumptions.
 */

export interface SIPResult {
  investedAmount: number;
  futureValue: number;
  totalGains: number;
  trajectory: { month: number; year: number; invested: number; value: number }[];
}

/**
 * Calculates Future Value of an SIP (Annuity Due: payment at beginning of month).
 * Formula: FV = P * [((1 + r)^n - 1) / r] * (1 + r)
 * where r = annualReturnRate / 12, n = years * 12
 */
export function calculateSIP(
  monthlyInvestment: number,
  annualReturnRate: number, // e.g. 0.12 for 12%
  years: number
): SIPResult {
  const n = Math.round(years * 12);
  const r = annualReturnRate / 12;

  const trajectory: SIPResult['trajectory'] = [];
  let currentInvested = 0;
  let currentValue = 0;

  trajectory.push({ month: 0, year: 0, invested: 0, value: 0 });

  if (r === 0) {
    for (let m = 1; m <= n; m++) {
      currentInvested += monthlyInvestment;
      currentValue += monthlyInvestment;
      if (m % 12 === 0 || m === n) {
        trajectory.push({
          month: m,
          year: m / 12,
          invested: currentInvested,
          value: currentValue,
        });
      }
    }
    return {
      investedAmount: currentInvested,
      futureValue: currentValue,
      totalGains: 0,
      trajectory,
    };
  }

  // Generate milestone trajectory points (every year)
  for (let m = 1; m <= n; m++) {
    // Value at month m with monthly start payment:
    // FV_m = P * [((1 + r)^m - 1) / r] * (1 + r)
    const factor = (Math.pow(1 + r, m) - 1) / r;
    const fvMonth = monthlyInvestment * factor * (1 + r);
    const investedMonth = monthlyInvestment * m;

    if (m % 12 === 0 || m === n) {
      trajectory.push({
        month: m,
        year: +(m / 12).toFixed(1),
        invested: Math.round(investedMonth),
        value: Math.round(fvMonth),
      });
    }
  }

  const factor = (Math.pow(1 + r, n) - 1) / r;
  const futureValue = monthlyInvestment * factor * (1 + r);
  const investedAmount = monthlyInvestment * n;
  const totalGains = futureValue - investedAmount;

  return {
    investedAmount: Math.round(investedAmount),
    futureValue: Math.round(futureValue),
    totalGains: Math.round(totalGains),
    trajectory,
  };
}

/**
 * Calculates the cost of delaying an investment by `delayYears`.
 * Compares starting now for `totalYears` vs waiting `delayYears` and investing for `totalYears - delayYears`.
 */
export function calculateDelayCost(
  monthlyInvestment: number,
  annualReturnRate: number,
  totalYears: number,
  delayYears: number
): {
  startNowFV: number;
  startLaterFV: number;
  costOfDelay: number;
  missedContributions: number;
  lostCompounding: number;
} {
  const startNow = calculateSIP(monthlyInvestment, annualReturnRate, totalYears);
  const remainingYears = Math.max(0, totalYears - delayYears);
  const startLater = calculateSIP(monthlyInvestment, annualReturnRate, remainingYears);

  const costOfDelay = Math.max(0, startNow.futureValue - startLater.futureValue);
  const missedContributions = monthlyInvestment * delayYears * 12;
  const lostCompounding = Math.max(0, costOfDelay - missedContributions);

  return {
    startNowFV: startNow.futureValue,
    startLaterFV: startLater.futureValue,
    costOfDelay,
    missedContributions,
    lostCompounding,
  };
}

/**
 * Adjusts future value for inflation.
 * Real Value = FV / (1 + inflationRate)^years
 */
export function calculateInflationAdjusted(
  futureValue: number,
  inflationRate: number, // e.g. 0.06 for 6%
  years: number
): number {
  if (years <= 0 || inflationRate === 0) return Math.round(futureValue);
  const realValue = futureValue / Math.pow(1 + inflationRate, years);
  return Math.round(realValue);
}

export interface EMIResult {
  monthlyEMI: number;
  principal: number;
  totalInterest: number;
  totalRepayment: number;
  interestToPrincipalRatio: number;
}

/**
 * Standard Reducing Balance EMI calculation.
 * Formula: EMI = [P * r * (1 + r)^n] / [(1 + r)^n - 1]
 * where r = annualInterestRate / 12, n = tenureYears * 12
 */
export function calculateEMI(
  principal: number,
  annualInterestRate: number, // e.g. 0.095 for 9.5%
  tenureYears: number
): EMIResult {
  if (principal <= 0) {
    return {
      monthlyEMI: 0,
      principal: 0,
      totalInterest: 0,
      totalRepayment: 0,
      interestToPrincipalRatio: 0,
    };
  }

  const n = Math.round(tenureYears * 12);
  const r = annualInterestRate / 12;

  if (r === 0) {
    const emi = principal / n;
    return {
      monthlyEMI: Math.round(emi),
      principal,
      totalInterest: 0,
      totalRepayment: principal,
      interestToPrincipalRatio: 0,
    };
  }

  const pow = Math.pow(1 + r, n);
  const rawEmi = (principal * r * pow) / (pow - 1);
  const monthlyEMI = Math.round(rawEmi);
  const totalRepayment = monthlyEMI * n;
  const totalInterest = Math.max(0, totalRepayment - principal);

  return {
    monthlyEMI,
    principal: Math.round(principal),
    totalInterest,
    totalRepayment,
    interestToPrincipalRatio: +(totalInterest / principal).toFixed(2),
  };
}

/**
 * Calculates loan cost sensitivity: what happens if rate is reduced by delta (e.g. 1% / 0.01).
 */
export function calculateLoanRateSavings(
  principal: number,
  currentRate: number,
  tenureYears: number,
  reductionDelta: number = 0.01
): {
  currentEMI: number;
  currentTotalInterest: number;
  newEMI: number;
  newTotalInterest: number;
  totalSavings: number;
  monthlySavings: number;
} {
  const current = calculateEMI(principal, currentRate, tenureYears);
  const newRate = Math.max(0.001, currentRate - reductionDelta);
  const reduced = calculateEMI(principal, newRate, tenureYears);

  return {
    currentEMI: current.monthlyEMI,
    currentTotalInterest: current.totalInterest,
    newEMI: reduced.monthlyEMI,
    newTotalInterest: reduced.totalInterest,
    totalSavings: Math.max(0, current.totalInterest - reduced.totalInterest),
    monthlySavings: Math.max(0, current.monthlyEMI - reduced.monthlyEMI),
  };
}

/**
 * Compares standard asset classes for identical monthly investment and horizon.
 */
export interface AssetComparison {
  id: string;
  name: string;
  category: string;
  assumedRate: number; // e.g. 0.12
  isTaxFree: boolean;
  volatilityNote: string;
  futureValue: number;
  totalInvested: number;
  totalGains: number;
}

export function compareInstruments(
  monthlyInvestment: number,
  years: number
): AssetComparison[] {
  const instruments = [
    {
      id: 'fd',
      name: 'Fixed Deposit (FD)',
      category: 'Fixed Income',
      assumedRate: 0.068, // 6.8%
      isTaxFree: false,
      volatilityNote: 'Guaranteed capital up to DICGC limit; interest taxable as per slab.',
    },
    {
      id: 'ppf',
      name: 'Public Provident Fund (PPF)',
      category: 'Govt Savings',
      assumedRate: 0.071, // 7.1%
      isTaxFree: true,
      volatilityNote: 'Sovereign guarantee, EEE tax status, 15-year statutory lock-in.',
    },
    {
      id: 'nps',
      name: 'National Pension System (NPS)',
      category: 'Retirement Hybrid',
      assumedRate: 0.105, // 10.5% (approx 50:50 equity-debt)
      isTaxFree: false,
      volatilityNote: 'Market-linked pension fund; 60% tax-free at 60, 40% annuitised.',
    },
    {
      id: 'gold',
      name: 'Gold (Sovereign Gold / ETF)',
      category: 'Commodity',
      assumedRate: 0.095, // 9.5% long-term nominal
      isTaxFree: false,
      volatilityNote: 'Hedge against currency depreciation; cyclical multi-year drawdowns.',
    },
    {
      id: 'sip',
      name: 'Broad Index Equity Fund',
      category: 'Equity SIP',
      assumedRate: 0.12, // 12% historical broad market
      isTaxFree: false,
      volatilityNote: 'Higher interim volatility; historically outpaces inflation over 7+ years.',
    },
  ];

  return instruments.map((inst) => {
    const res = calculateSIP(monthlyInvestment, inst.assumedRate, years);
    return {
      id: inst.id,
      name: inst.name,
      category: inst.category,
      assumedRate: inst.assumedRate,
      isTaxFree: inst.isTaxFree,
      volatilityNote: inst.volatilityNote,
      futureValue: res.futureValue,
      totalInvested: res.investedAmount,
      totalGains: res.totalGains,
    };
  });
}
