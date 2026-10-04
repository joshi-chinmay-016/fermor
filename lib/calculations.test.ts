import { describe, it, expect } from 'vitest';
import {
  calculateSIP,
  calculateEMI,
  calculateDelayCost,
  calculateInflationAdjusted,
  calculateLoanRateSavings,
} from './calculations';
import { formatINR, formatIndianNumber, formatPercent } from './format';

describe('SIP calculations and sanity check', () => {
  it('correctly matches sanity check: ₹10,000/month at 12% over 10 years ≈ ₹23.23 L', () => {
    const result = calculateSIP(10000, 0.12, 10);
    // Exact annuity due formula: 10000 * ((1.01^120 - 1)/0.01) * 1.01 = 23,23,391
    expect(result.futureValue).toBeGreaterThan(2323000);
    expect(result.futureValue).toBeLessThan(2324000);
    expect(result.investedAmount).toBe(1200000); // 10000 * 120
    expect(result.totalGains).toBe(result.futureValue - result.investedAmount);

    const formattedCompact = formatINR(result.futureValue, { compact: true });
    expect(formattedCompact).toBe('₹23.23 L');
  });

  it('handles 0% return edge case cleanly', () => {
    const result = calculateSIP(5000, 0, 5);
    expect(result.investedAmount).toBe(300000);
    expect(result.futureValue).toBe(300000);
    expect(result.totalGains).toBe(0);
  });

  it('computes trajectory points for every year plus final month', () => {
    const result = calculateSIP(15000, 0.12, 10);
    expect(result.trajectory.length).toBe(11); // Year 0 through 10
    expect(result.trajectory[0].value).toBe(0);
    expect(result.trajectory[10].year).toBe(10);
    expect(result.trajectory[10].value).toBe(result.futureValue);
  });
});

describe('EMI calculations', () => {
  it('computes car loan EMI accurately', () => {
    // Principal: 10,00,000 (12L car - 2L down), Rate: 9.5%, Tenure: 5 years (60 months)
    const result = calculateEMI(1000000, 0.095, 5);
    // Standard bank formula: P * r * (1+r)^n / ((1+r)^n - 1)
    // 1000000 * (0.095/12) * (1 + 0.095/12)^60 / ((1 + 0.095/12)^60 - 1) = 21,002
    expect(result.monthlyEMI).toBe(21002);
    expect(result.totalRepayment).toBe(21002 * 60);
    expect(result.totalInterest).toBe(result.totalRepayment - 1000000);
  });

  it('handles 0 principal or 0 rate gracefully', () => {
    const zeroP = calculateEMI(0, 0.1, 5);
    expect(zeroP.monthlyEMI).toBe(0);

    const zeroR = calculateEMI(120000, 0, 1);
    expect(zeroR.monthlyEMI).toBe(10000);
    expect(zeroR.totalInterest).toBe(0);
  });
});

describe('Delay cost calculation', () => {
  it('correctly calculates the cost of waiting 3 years on a 15-year SIP', () => {
    const result = calculateDelayCost(25000, 0.12, 15, 3);
    expect(result.startNowFV).toBeGreaterThan(result.startLaterFV);
    expect(result.costOfDelay).toBe(result.startNowFV - result.startLaterFV);
    // 3 years of missed contributions = 25000 * 36 = 9,00,000
    expect(result.missedContributions).toBe(900000);
    expect(result.lostCompounding).toBe(result.costOfDelay - result.missedContributions);
    expect(result.lostCompounding).toBeGreaterThan(0);
  });
});

describe('Inflation adjustment', () => {
  it('computes purchasing power after inflation', () => {
    const nominal = 10000000; // 1 Cr
    const real = calculateInflationAdjusted(nominal, 0.06, 10);
    // 10,000,000 / (1.06^10) = 10,000,000 / 1.7908477 = 5,583,948
    expect(real).toBeGreaterThan(5580000);
    expect(real).toBeLessThan(5590000);
  });
});

describe('Loan rate sensitivity', () => {
  it('quantifies the exact rupee savings of a 1% lower rate', () => {
    const sensitivity = calculateLoanRateSavings(1000000, 0.095, 5, 0.01);
    expect(sensitivity.totalSavings).toBeGreaterThan(0);
    expect(sensitivity.monthlySavings).toBeGreaterThan(0);
  });
});

describe('Formatting helpers', () => {
  it('formats Indian numbers correctly with comma grouping', () => {
    expect(formatIndianNumber(1000)).toBe('1,000');
    expect(formatIndianNumber(15000)).toBe('15,000');
    expect(formatIndianNumber(100000)).toBe('1,00,000');
    expect(formatIndianNumber(1234567)).toBe('12,34,567');
    expect(formatIndianNumber(10000000)).toBe('1,00,00,000');
  });

  it('formats compact Lakhs and Crores', () => {
    expect(formatINR(15000, { compact: true })).toBe('₹15,000');
    expect(formatINR(2323391, { compact: true })).toBe('₹23.23 L');
    expect(formatINR(14750000, { compact: true })).toBe('₹1.48 Cr');
  });

  it('formats percentages cleanly', () => {
    expect(formatPercent(0.12)).toBe('12%');
    expect(formatPercent(0.095)).toBe('9.5%');
    expect(formatPercent(0.071)).toBe('7.1%');
  });
});
