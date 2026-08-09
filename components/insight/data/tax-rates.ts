export const TAX_YEAR = {
  financialYear: "FY 2025-26",
  assessmentYear: "AY 2026-27",
  label: "FY 2025-26 (AY 2026-27)",
};

export type Slab = { upTo: number; rate: number };

export const NEW_REGIME_SLABS: Slab[] = [
  { upTo: 400_000, rate: 0 },
  { upTo: 800_000, rate: 0.05 },
  { upTo: 1_200_000, rate: 0.1 },
  { upTo: 1_600_000, rate: 0.15 },
  { upTo: 2_000_000, rate: 0.2 },
  { upTo: 2_400_000, rate: 0.25 },
  { upTo: Number.POSITIVE_INFINITY, rate: 0.3 },
];

export const OLD_REGIME_SLABS: Slab[] = [
  { upTo: 250_000, rate: 0 },
  { upTo: 500_000, rate: 0.05 },
  { upTo: 1_000_000, rate: 0.2 },
  { upTo: Number.POSITIVE_INFINITY, rate: 0.3 },
];

export const OLD_REGIME_SLABS_SENIOR: Slab[] = [
  { upTo: 300_000, rate: 0 },
  { upTo: 500_000, rate: 0.05 },
  { upTo: 1_000_000, rate: 0.2 },
  { upTo: Number.POSITIVE_INFINITY, rate: 0.3 },
];

export const REGIME_CONSTANTS = {
  new: {
    standardDeduction: 75_000,
    rebateIncomeLimit: 1_200_000,
    rebateCap: 60_000,
    surchargeCap: 0.25,
  },
  old: {
    standardDeduction: 50_000,
    rebateIncomeLimit: 500_000,
    rebateCap: 12_500,
    surchargeCap: 0.37,
  },
};

export const SURCHARGE_BANDS = [
  { threshold: 50_00_000, rate: 0.1 },
  { threshold: 1_00_00_000, rate: 0.15 },
  { threshold: 2_00_00_000, rate: 0.25 },
  { threshold: 5_00_00_000, rate: 0.37 },
];

export const CESS_RATE = 0.04;

export const PAYROLL_CONSTANTS = {
  pfRate: 0.12,
  pfWageCeiling: 15_000,
  epsRate: 0.0833,
  edliRate: 0.005,
  pfAdminRate: 0.005,
  esiEmployerRate: 0.0325,
  esiEmployeeRate: 0.0075,
  esiWageCeiling: 21_000,
  gratuityAccrualRate: 0.0481,
  gratuityExemptionCap: 20_00_000,
  professionalTaxMonthly: 200,
};

export const MCA_FEE_SLABS = [
  { upTo: 1_00_000, fee: 200 },
  { upTo: 5_00_000, fee: 300 },
  { upTo: 25_00_000, fee: 400 },
  { upTo: 1_00_00_000, fee: 500 },
  { upTo: Number.POSITIVE_INFINITY, fee: 600 },
];

export const MCA_DELAY_MULTIPLIERS = [
  { upToDays: 0, multiplier: 1, label: "Filed on time" },
  { upToDays: 15, multiplier: 2, label: "Up to 15 days late" },
  { upToDays: 30, multiplier: 4, label: "15 to 30 days late" },
  { upToDays: 60, multiplier: 6, label: "30 to 60 days late" },
  { upToDays: 90, multiplier: 10, label: "60 to 90 days late" },
  { upToDays: 180, multiplier: 12, label: "90 to 180 days late" },
  { upToDays: Number.POSITIVE_INFINITY, multiplier: 18, label: "Beyond 180 days" },
];

export function slabTax(income: number, slabs: Slab[]) {
  let remaining = Math.max(0, income);
  let previous = 0;
  let tax = 0;
  const breakdown: { band: string; rate: number; tax: number }[] = [];

  for (const slab of slabs) {
    if (remaining <= 0) break;
    const width = slab.upTo - previous;
    const taxable = Math.min(remaining, width);
    const amount = taxable * slab.rate;
    if (taxable > 0 && slab.rate > 0) {
      breakdown.push({
        band: `${previous.toLocaleString("en-IN")} – ${
          Number.isFinite(slab.upTo) ? slab.upTo.toLocaleString("en-IN") : "above"
        }`,
        rate: slab.rate,
        tax: amount,
      });
    }
    tax += amount;
    remaining -= taxable;
    previous = slab.upTo;
  }

  return { tax, breakdown };
}

export function surchargeFor(totalIncome: number, tax: number, cap: number) {
  let rate = 0;
  for (const band of SURCHARGE_BANDS) {
    if (totalIncome > band.threshold) rate = band.rate;
  }
  rate = Math.min(rate, cap);
  if (rate === 0) return { rate: 0, surcharge: 0, marginalRelief: 0 };

  const surcharge = tax * rate;

  const applicable = SURCHARGE_BANDS.filter(
    (band) => totalIncome > band.threshold && band.rate <= cap,
  );
  const threshold = applicable.length
    ? applicable[applicable.length - 1].threshold
    : 0;

  return { rate, surcharge, marginalRelief: 0, threshold };
}
