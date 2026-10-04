'use client';

import React, { useState } from 'react';
import { calculateEMI } from '@/lib/calculations';
import { formatINR } from '@/lib/format';
import { Slider } from '@/components/ui/Slider';

export function AffordabilityTool() {
  const [purchaseAmount, setPurchaseAmount] = useState(75000);
  const [downPayment, setDownPayment] = useState(15000);
  const [tenureMonths, setTenureMonths] = useState(12);
  const [interestRate, setInterestRate] = useState(0.14); // 14% consumer loan / credit card EMI

  const financed = Math.max(0, purchaseAmount - downPayment);
  const emiRes = calculateEMI(financed, interestRate, tenureMonths / 12);

  return (
    <div className="pt-4 space-y-4 border-t border-border/80">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Slider
          id="afford-price"
          label="Purchase Price (e.g. Gadget/Appliance)"
          min={10000}
          max={300000}
          step={5000}
          value={purchaseAmount}
          onChange={(v) => {
            setPurchaseAmount(v);
            if (downPayment >= v) setDownPayment(Math.round(v * 0.2));
          }}
          formatValue={(v) => formatINR(v)}
        />
        <Slider
          id="afford-down"
          label="Upfront Down Payment"
          min={0}
          max={purchaseAmount}
          step={2000}
          value={downPayment}
          onChange={setDownPayment}
          formatValue={(v) => formatINR(v)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Slider
          id="afford-tenure"
          label="Tenure (Months)"
          min={3}
          max={36}
          step={3}
          value={tenureMonths}
          onChange={setTenureMonths}
          formatValue={(v) => `${v} mos`}
        />
        <Slider
          id="afford-rate"
          label="Financing Rate (Annual)"
          min={0.08}
          max={0.24}
          step={0.01}
          value={interestRate}
          onChange={setInterestRate}
          formatValue={(v) => `${(v * 100).toFixed(0)}%`}
        />
      </div>

      <div className="p-3.5 bg-bg-subtle rounded border border-border/80 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div>
          <span className="text-ink-muted block text-[11px] uppercase tracking-wider">
            Monthly EMI Outflow
          </span>
          <span className="text-base font-serif font-semibold text-ink">
            {formatINR(emiRes.monthlyEMI)} / mo
          </span>
        </div>
        <div>
          <span className="text-ink-muted block text-[11px] uppercase tracking-wider">
            Total Interest Paid
          </span>
          <span className="font-mono text-red-700 font-medium">
            +{formatINR(emiRes.totalInterest)}
          </span>
        </div>
        <div>
          <span className="text-ink-muted block text-[11px] uppercase tracking-wider">
            True Acquisition Cost
          </span>
          <span className="font-mono text-ink font-semibold">
            {formatINR(downPayment + emiRes.totalRepayment)}
          </span>
        </div>
      </div>
    </div>
  );
}
