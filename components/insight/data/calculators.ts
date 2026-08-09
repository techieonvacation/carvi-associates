import type { Calculator, CalculatorOutput } from "./types";
import { currency, number, percent, toNumber } from "./format";
import {
  CESS_RATE,
  MCA_DELAY_MULTIPLIERS,
  MCA_FEE_SLABS,
  NEW_REGIME_SLABS,
  OLD_REGIME_SLABS,
  OLD_REGIME_SLABS_SENIOR,
  PAYROLL_CONSTANTS,
  REGIME_CONSTANTS,
  SURCHARGE_BANDS,
  TAX_YEAR,
  slabTax,
  type Slab,
} from "./tax-rates";

type RegimeResult = {
  grossIncome: number;
  deductions: number;
  taxableIncome: number;
  slabTax: number;
  rebate: number;
  surcharge: number;
  marginalRelief: number;
  cess: number;
  total: number;
  effectiveRate: number;
};

function computeRegime({
  grossIncome,
  deductions,
  slabs,
  standardDeduction,
  rebateIncomeLimit,
  rebateCap,
  surchargeCap,
}: {
  grossIncome: number;
  deductions: number;
  slabs: Slab[];
  standardDeduction: number;
  rebateIncomeLimit: number;
  rebateCap: number;
  surchargeCap: number;
}): RegimeResult {
  const totalDeductions = deductions + standardDeduction;
  const taxableIncome = Math.max(0, grossIncome - totalDeductions);
  const base = slabTax(taxableIncome, slabs).tax;

  const rebate =
    taxableIncome <= rebateIncomeLimit ? Math.min(base, rebateCap) : 0;
  const afterRebate = Math.max(0, base - rebate);

  let surchargeRate = 0;
  let threshold = 0;
  for (const band of SURCHARGE_BANDS) {
    if (taxableIncome > band.threshold && band.rate <= surchargeCap) {
      surchargeRate = band.rate;
      threshold = band.threshold;
    }
  }

  let surcharge = afterRebate * surchargeRate;
  let marginalRelief = 0;

  if (surchargeRate > 0) {
    const taxAtThreshold = slabTax(threshold, slabs).tax;
    let surchargeAtThreshold = 0;
    for (const band of SURCHARGE_BANDS) {
      if (threshold > band.threshold && band.rate <= surchargeCap) {
        surchargeAtThreshold = taxAtThreshold * band.rate;
      }
    }
    const ceiling = taxAtThreshold + surchargeAtThreshold + (taxableIncome - threshold);
    const excess = afterRebate + surcharge - ceiling;
    if (excess > 0) {
      marginalRelief = Math.min(excess, surcharge);
      surcharge -= marginalRelief;
    }
  }

  const cess = (afterRebate + surcharge) * CESS_RATE;
  const total = afterRebate + surcharge + cess;

  return {
    grossIncome,
    deductions: totalDeductions,
    taxableIncome,
    slabTax: base,
    rebate,
    surcharge,
    marginalRelief,
    cess,
    total,
    effectiveRate: grossIncome > 0 ? (total / grossIncome) * 100 : 0,
  };
}

function emiFor(principal: number, annualRate: number, months: number) {
  if (principal <= 0 || months <= 0) return 0;
  const monthly = annualRate / 12 / 100;
  if (monthly === 0) return principal / months;
  const factor = Math.pow(1 + monthly, months);
  return (principal * monthly * factor) / (factor - 1);
}

export const CALCULATORS: Calculator[] = [
  {
    slug: "gst-payment",
    title: "GST payment calculator",
    description:
      "Compute output tax, apply input credit in the statutory set-off order, and see the cash actually payable.",
    icon: "receipt",
    group: "Indirect tax",
    basis: "Set-off order under Sections 49, 49A and Rule 88A",
    fields: [
      { name: "taxableValue", label: "Taxable value of supply", kind: "currency", defaultValue: 1_000_000, min: 0, step: 1000 },
      {
        name: "rate",
        label: "GST rate",
        kind: "select",
        defaultValue: "18",
        options: [
          { label: "0%", value: "0" },
          { label: "0.25%", value: "0.25" },
          { label: "3%", value: "3" },
          { label: "5%", value: "5" },
          { label: "12%", value: "12" },
          { label: "18%", value: "18" },
          { label: "28%", value: "28" },
        ],
      },
      {
        name: "supplyType",
        label: "Nature of supply",
        kind: "select",
        defaultValue: "intra",
        options: [
          { label: "Intra-state (CGST + SGST)", value: "intra" },
          { label: "Inter-state (IGST)", value: "inter" },
        ],
      },
      { name: "itcIgst", label: "IGST credit available", kind: "currency", defaultValue: 40_000, min: 0, step: 1000 },
      { name: "itcCgst", label: "CGST credit available", kind: "currency", defaultValue: 25_000, min: 0, step: 1000 },
      { name: "itcSgst", label: "SGST credit available", kind: "currency", defaultValue: 25_000, min: 0, step: 1000 },
    ],
    compute: (values): CalculatorOutput => {
      const taxableValue = toNumber(values.taxableValue);
      const rate = toNumber(values.rate);
      const interState = values.supplyType === "inter";
      const totalTax = (taxableValue * rate) / 100;

      let outIgst = interState ? totalTax : 0;
      let outCgst = interState ? 0 : totalTax / 2;
      let outSgst = interState ? 0 : totalTax / 2;

      let creditIgst = toNumber(values.itcIgst);
      let creditCgst = toNumber(values.itcCgst);
      let creditSgst = toNumber(values.itcSgst);

      const use = (available: number, liability: number) => {
        const used = Math.min(available, liability);
        return { used, available: available - used, liability: liability - used };
      };

      let step = use(creditIgst, outIgst);
      creditIgst = step.available;
      outIgst = step.liability;
      const igstToIgst = step.used;

      step = use(creditIgst, outCgst);
      creditIgst = step.available;
      outCgst = step.liability;
      const igstToCgst = step.used;

      step = use(creditIgst, outSgst);
      creditIgst = step.available;
      outSgst = step.liability;
      const igstToSgst = step.used;

      step = use(creditCgst, outCgst);
      creditCgst = step.available;
      outCgst = step.liability;
      const cgstToCgst = step.used;

      step = use(creditCgst, outIgst);
      creditCgst = step.available;
      outIgst = step.liability;
      const cgstToIgst = step.used;

      step = use(creditSgst, outSgst);
      creditSgst = step.available;
      outSgst = step.liability;
      const sgstToSgst = step.used;

      step = use(creditSgst, outIgst);
      creditSgst = step.available;
      outIgst = step.liability;
      const sgstToIgst = step.used;

      const cashPayable = outIgst + outCgst + outSgst;
      const creditCarried = creditIgst + creditCgst + creditSgst;

      return {
        headline: {
          label: "Cash payable this period",
          value: currency(cashPayable),
          caption: `Output tax ${currency(totalTax)} · credit used ${currency(totalTax - cashPayable)}`,
        },
        lines: [
          { label: "Invoice value including tax", value: currency(taxableValue + totalTax) },
          {
            label: interState ? "Output IGST" : "Output CGST + SGST",
            value: interState
              ? currency(totalTax)
              : `${currency(totalTax / 2)} + ${currency(totalTax / 2)}`,
          },
          {
            label: "IGST credit applied",
            value: currency(igstToIgst + igstToCgst + igstToSgst),
            hint: "IGST credit is set off against IGST first, then CGST, then SGST",
          },
          { label: "CGST credit applied", value: currency(cgstToCgst + cgstToIgst) },
          { label: "SGST credit applied", value: currency(sgstToSgst + sgstToIgst) },
          { label: "IGST payable in cash", value: currency(outIgst) },
          { label: "CGST payable in cash", value: currency(outCgst) },
          { label: "SGST payable in cash", value: currency(outSgst) },
          { label: "Credit carried forward", value: currency(creditCarried) },
          { label: "Net cash outflow", value: currency(cashPayable), emphasis: true },
        ],
        breakdown: [
          { label: "Paid from credit", value: Math.max(0, totalTax - cashPayable) },
          { label: "Paid in cash", value: cashPayable },
        ],
        note: "CGST credit cannot be used against SGST liability, and vice versa. Balances remain in the electronic credit ledger.",
      };
    },
  },
  {
    slug: "income-tax",
    title: "Income tax calculator",
    description:
      "Compare the old and new regimes side by side, including surcharge, marginal relief, rebate, and cess.",
    icon: "landmark",
    group: "Direct tax",
    basis: `Slab rates for ${TAX_YEAR.label}`,
    fields: [
      { name: "grossIncome", label: "Gross total income", kind: "currency", defaultValue: 1_800_000, min: 0, step: 10_000 },
      {
        name: "ageGroup",
        label: "Age group",
        kind: "select",
        defaultValue: "below60",
        options: [
          { label: "Below 60", value: "below60" },
          { label: "60 and above", value: "senior" },
        ],
      },
      { name: "section80c", label: "Section 80C investments", kind: "currency", defaultValue: 150_000, min: 0, max: 150_000, step: 5_000 },
      { name: "section80d", label: "Health insurance — 80D", kind: "currency", defaultValue: 25_000, min: 0, step: 1_000 },
      { name: "nps", label: "NPS — 80CCD(1B)", kind: "currency", defaultValue: 50_000, min: 0, max: 50_000, step: 5_000 },
      { name: "homeLoanInterest", label: "Home loan interest — Section 24(b)", kind: "currency", defaultValue: 0, min: 0, max: 200_000, step: 10_000 },
      { name: "hraExempt", label: "HRA exemption claimed", kind: "currency", defaultValue: 0, min: 0, step: 10_000 },
      { name: "otherDeductions", label: "Other Chapter VI-A deductions", kind: "currency", defaultValue: 0, min: 0, step: 5_000 },
    ],
    compute: (values): CalculatorOutput => {
      const grossIncome = toNumber(values.grossIncome);
      const senior = values.ageGroup === "senior";

      const oldDeductions =
        Math.min(toNumber(values.section80c), 150_000) +
        toNumber(values.section80d) +
        Math.min(toNumber(values.nps), 50_000) +
        Math.min(toNumber(values.homeLoanInterest), 200_000) +
        toNumber(values.hraExempt) +
        toNumber(values.otherDeductions);

      const oldRegime = computeRegime({
        grossIncome,
        deductions: oldDeductions,
        slabs: senior ? OLD_REGIME_SLABS_SENIOR : OLD_REGIME_SLABS,
        ...REGIME_CONSTANTS.old,
      });

      const newRegime = computeRegime({
        grossIncome,
        deductions: 0,
        slabs: NEW_REGIME_SLABS,
        ...REGIME_CONSTANTS.new,
      });

      const better = newRegime.total <= oldRegime.total ? "new" : "old";
      const saving = Math.abs(newRegime.total - oldRegime.total);

      return {
        headline: {
          label: `${better === "new" ? "New" : "Old"} regime is cheaper`,
          value: currency(better === "new" ? newRegime.total : oldRegime.total),
          caption: `You save ${currency(saving)} against the other regime`,
        },
        lines: [
          { label: "New regime — taxable income", value: currency(newRegime.taxableIncome) },
          { label: "New regime — tax before rebate", value: currency(newRegime.slabTax) },
          { label: "New regime — rebate u/s 87A", value: currency(newRegime.rebate) },
          { label: "New regime — surcharge", value: currency(newRegime.surcharge) },
          { label: "New regime — cess", value: currency(newRegime.cess) },
          { label: "New regime — total tax", value: currency(newRegime.total), emphasis: true },
          { label: "Old regime — deductions claimed", value: currency(oldRegime.deductions) },
          { label: "Old regime — taxable income", value: currency(oldRegime.taxableIncome) },
          { label: "Old regime — tax before rebate", value: currency(oldRegime.slabTax) },
          { label: "Old regime — rebate u/s 87A", value: currency(oldRegime.rebate) },
          { label: "Old regime — surcharge", value: currency(oldRegime.surcharge) },
          { label: "Old regime — cess", value: currency(oldRegime.cess) },
          { label: "Old regime — total tax", value: currency(oldRegime.total), emphasis: true },
          {
            label: "Effective rate",
            value: `${percent(newRegime.effectiveRate)} new · ${percent(oldRegime.effectiveRate)} old`,
          },
        ],
        breakdown: [
          { label: "New regime", value: newRegime.total },
          { label: "Old regime", value: oldRegime.total },
        ],
        note: `Standard deduction of ${currency(REGIME_CONSTANTS.new.standardDeduction)} (new) and ${currency(REGIME_CONSTANTS.old.standardDeduction)} (old) is applied automatically for salaried taxpayers. Rates are for ${TAX_YEAR.label}.`,
      };
    },
  },
  {
    slug: "advance-tax",
    title: "Advance tax schedule",
    description:
      "Split the estimated annual liability into the four statutory instalments and see the interest exposure on a shortfall.",
    icon: "calendar",
    group: "Direct tax",
    basis: "Sections 208, 211 and 234C",
    fields: [
      { name: "estimatedTax", label: "Estimated tax for the year", kind: "currency", defaultValue: 400_000, min: 0, step: 10_000 },
      { name: "tds", label: "TDS and TCS already credited", kind: "currency", defaultValue: 100_000, min: 0, step: 5_000 },
      { name: "paidTillDate", label: "Advance tax already paid", kind: "currency", defaultValue: 0, min: 0, step: 5_000 },
    ],
    compute: (values): CalculatorOutput => {
      const estimatedTax = toNumber(values.estimatedTax);
      const tds = toNumber(values.tds);
      const paid = toNumber(values.paidTillDate);
      const liability = Math.max(0, estimatedTax - tds);

      const schedule = [
        { label: "On or before 15 June", share: 0.15 },
        { label: "On or before 15 September", share: 0.45 },
        { label: "On or before 15 December", share: 0.75 },
        { label: "On or before 15 March", share: 1 },
      ];

      const lines = schedule.map((instalment, index) => {
        const cumulative = liability * instalment.share;
        const previous = index === 0 ? 0 : liability * schedule[index - 1].share;
        return {
          label: instalment.label,
          value: `${currency(cumulative - previous)} · cumulative ${currency(cumulative)}`,
          hint: `${Math.round(instalment.share * 100)}% of the liability`,
        };
      });

      const outstanding = Math.max(0, liability - paid);

      return {
        headline: {
          label: "Advance tax payable for the year",
          value: currency(liability),
          caption:
            liability === 0
              ? "No advance tax is due once credits exceed the estimated liability"
              : `Still to pay ${currency(outstanding)}`,
        },
        lines: [
          ...lines,
          { label: "Already paid", value: currency(paid) },
          { label: "Balance outstanding", value: currency(outstanding), emphasis: true },
          {
            label: "Indicative 234C interest on a full quarter deferral",
            value: currency(outstanding * 0.01 * 3),
            hint: "1% per month for three months on the deferred instalment",
          },
        ],
        note: "Advance tax applies where the liability after credits exceeds ₹10,000 for the year. Resident senior citizens without business income are exempt.",
      };
    },
  },
  {
    slug: "hra-exemption",
    title: "HRA exemption calculator",
    description:
      "Compute the house rent allowance exemption as the least of the three statutory tests.",
    icon: "building",
    group: "Salary",
    basis: "Section 10(13A) read with Rule 2A",
    fields: [
      { name: "basic", label: "Basic salary + DA (annual)", kind: "currency", defaultValue: 600_000, min: 0, step: 10_000 },
      { name: "hraReceived", label: "HRA received (annual)", kind: "currency", defaultValue: 300_000, min: 0, step: 10_000 },
      { name: "rentPaid", label: "Rent paid (annual)", kind: "currency", defaultValue: 360_000, min: 0, step: 10_000 },
      {
        name: "cityType",
        label: "City",
        kind: "select",
        defaultValue: "metro",
        options: [
          { label: "Metro — Delhi, Mumbai, Kolkata, Chennai", value: "metro" },
          { label: "Non-metro", value: "nonmetro" },
        ],
      },
    ],
    compute: (values): CalculatorOutput => {
      const basic = toNumber(values.basic);
      const hraReceived = toNumber(values.hraReceived);
      const rentPaid = toNumber(values.rentPaid);
      const metro = values.cityType === "metro";

      const testA = hraReceived;
      const testB = Math.max(0, rentPaid - basic * 0.1);
      const testC = basic * (metro ? 0.5 : 0.4);
      const exemption = Math.max(0, Math.min(testA, testB, testC));
      const taxable = Math.max(0, hraReceived - exemption);

      return {
        headline: {
          label: "HRA exemption available",
          value: currency(exemption),
          caption: `${currency(taxable)} of the allowance remains taxable`,
        },
        lines: [
          { label: "Test 1 — actual HRA received", value: currency(testA) },
          { label: "Test 2 — rent paid less 10% of salary", value: currency(testB) },
          {
            label: `Test 3 — ${metro ? "50%" : "40%"} of salary`,
            value: currency(testC),
          },
          { label: "Exemption (least of the three)", value: currency(exemption), emphasis: true },
          { label: "Taxable HRA", value: currency(taxable) },
        ],
        breakdown: [
          { label: "Exempt", value: exemption },
          { label: "Taxable", value: taxable },
        ],
        note: "Salary here means basic pay plus dearness allowance forming part of retirement benefits, plus commission on turnover. The landlord's PAN is required where annual rent exceeds ₹1,00,000. The exemption is not available under the new regime.",
      };
    },
  },
  {
    slug: "gratuity",
    title: "Gratuity calculator",
    description:
      "Compute gratuity payable on separation and the portion exempt from income tax.",
    icon: "wallet",
    group: "Salary",
    basis: "Payment of Gratuity Act, 1972 and Section 10(10)",
    fields: [
      { name: "lastDrawn", label: "Last drawn basic + DA (monthly)", kind: "currency", defaultValue: 60_000, min: 0, step: 1_000 },
      { name: "years", label: "Completed years of service", kind: "number", defaultValue: 8, min: 0, max: 50, step: 1 },
      { name: "months", label: "Additional months in the final year", kind: "number", defaultValue: 7, min: 0, max: 11, step: 1 },
      {
        name: "covered",
        label: "Employer covered by the Gratuity Act",
        kind: "select",
        defaultValue: "yes",
        options: [
          { label: "Yes — 15/26 formula", value: "yes" },
          { label: "No — 15/30 formula", value: "no" },
        ],
      },
    ],
    compute: (values): CalculatorOutput => {
      const lastDrawn = toNumber(values.lastDrawn);
      const years = toNumber(values.years);
      const months = toNumber(values.months);
      const covered = values.covered === "yes";

      const roundedYears = covered && months >= 6 ? years + 1 : years;
      const divisor = covered ? 26 : 30;
      const gratuity = (lastDrawn * 15 * roundedYears) / divisor;
      const exempt = Math.min(gratuity, PAYROLL_CONSTANTS.gratuityExemptionCap);
      const taxable = Math.max(0, gratuity - exempt);
      const eligible = years >= 5;

      return {
        headline: {
          label: eligible ? "Gratuity payable" : "Not yet eligible",
          value: eligible ? currency(gratuity) : "—",
          caption: eligible
            ? `${roundedYears} years counted at ${divisor === 26 ? "15/26" : "15/30"}`
            : "Five years of continuous service are required, except on death or disablement",
        },
        lines: [
          { label: "Years counted", value: `${roundedYears}` },
          { label: "Gratuity computed", value: currency(gratuity) },
          { label: "Exempt under Section 10(10)", value: currency(exempt) },
          { label: "Taxable portion", value: currency(taxable), emphasis: taxable > 0 },
        ],
        breakdown: [
          { label: "Exempt", value: exempt },
          { label: "Taxable", value: taxable },
        ],
        note: `The lifetime exemption cap of ${currency(PAYROLL_CONSTANTS.gratuityExemptionCap)} applies across all employers. Service beyond six months in the final year is rounded up only for employers covered by the Act.`,
      };
    },
  },
  {
    slug: "salary-in-hand",
    title: "CTC to in-hand salary",
    description:
      "Convert cost to company into monthly take-home after provident fund, professional tax, and income tax.",
    icon: "banknote",
    group: "Salary",
    basis: `New regime slabs for ${TAX_YEAR.label}`,
    fields: [
      { name: "ctc", label: "Annual cost to company", kind: "currency", defaultValue: 1_500_000, min: 0, step: 50_000 },
      { name: "basicPercent", label: "Basic pay as % of CTC", kind: "percent", defaultValue: 40, min: 20, max: 60, step: 1 },
      {
        name: "pfBasis",
        label: "Provident fund basis",
        kind: "select",
        defaultValue: "ceiling",
        options: [
          { label: "Statutory ceiling of ₹15,000 per month", value: "ceiling" },
          { label: "Full basic pay", value: "full" },
        ],
      },
      { name: "otherDeductions", label: "Other monthly deductions", kind: "currency", defaultValue: 0, min: 0, step: 500 },
    ],
    compute: (values): CalculatorOutput => {
      const ctc = toNumber(values.ctc);
      const basicPercent = toNumber(values.basicPercent, 40);
      const basicAnnual = (ctc * basicPercent) / 100;
      const basicMonthly = basicAnnual / 12;

      const pfWage =
        values.pfBasis === "ceiling"
          ? Math.min(basicMonthly, PAYROLL_CONSTANTS.pfWageCeiling)
          : basicMonthly;

      const employerPfAnnual = pfWage * PAYROLL_CONSTANTS.pfRate * 12;
      const employeePfAnnual = employerPfAnnual;
      const gratuityAnnual = basicAnnual * PAYROLL_CONSTANTS.gratuityAccrualRate;

      const grossAnnual = Math.max(0, ctc - employerPfAnnual - gratuityAnnual);
      const professionalTaxAnnual = PAYROLL_CONSTANTS.professionalTaxMonthly * 12;

      const taxResult = computeRegime({
        grossIncome: grossAnnual,
        deductions: 0,
        slabs: NEW_REGIME_SLABS,
        ...REGIME_CONSTANTS.new,
      });

      const otherAnnual = toNumber(values.otherDeductions) * 12;
      const netAnnual = Math.max(
        0,
        grossAnnual - employeePfAnnual - professionalTaxAnnual - taxResult.total - otherAnnual,
      );

      return {
        headline: {
          label: "Monthly in-hand salary",
          value: currency(netAnnual / 12),
          caption: `${currency(netAnnual)} a year against a CTC of ${currency(ctc)}`,
        },
        lines: [
          { label: "Basic pay (annual)", value: currency(basicAnnual) },
          { label: "Employer PF contribution", value: currency(employerPfAnnual) },
          { label: "Gratuity accrual in CTC", value: currency(gratuityAnnual) },
          { label: "Gross salary", value: currency(grossAnnual) },
          { label: "Employee PF deduction", value: currency(employeePfAnnual) },
          { label: "Professional tax", value: currency(professionalTaxAnnual) },
          { label: "Income tax (new regime)", value: currency(taxResult.total) },
          { label: "Other deductions", value: currency(otherAnnual) },
          { label: "Net annual take-home", value: currency(netAnnual), emphasis: true },
        ],
        breakdown: [
          { label: "Take-home", value: netAnnual },
          { label: "Statutory deductions", value: employeePfAnnual + professionalTaxAnnual },
          { label: "Income tax", value: taxResult.total },
          { label: "Retirals in CTC", value: employerPfAnnual + gratuityAnnual },
        ],
        note: "Professional tax is assumed at ₹200 per month and varies by state. Income tax is computed under the new regime with the standard deduction applied.",
      };
    },
  },
  {
    slug: "payroll-cost",
    title: "Employer payroll cost",
    description:
      "Work out the true monthly cost of an employee including provident fund, ESI, gratuity accrual, and administration charges.",
    icon: "users",
    group: "Payroll",
    basis: "EPF, ESI, and gratuity accrual rates",
    fields: [
      { name: "grossMonthly", label: "Gross monthly salary", kind: "currency", defaultValue: 45_000, min: 0, step: 1_000 },
      { name: "basicPercent", label: "Basic pay as % of gross", kind: "percent", defaultValue: 50, min: 20, max: 100, step: 1 },
      { name: "headcount", label: "Number of employees at this level", kind: "number", defaultValue: 1, min: 1, max: 5000, step: 1 },
      {
        name: "pfBasis",
        label: "Provident fund basis",
        kind: "select",
        defaultValue: "ceiling",
        options: [
          { label: "Statutory ceiling of ₹15,000", value: "ceiling" },
          { label: "Full basic pay", value: "full" },
        ],
      },
    ],
    compute: (values): CalculatorOutput => {
      const gross = toNumber(values.grossMonthly);
      const basic = (gross * toNumber(values.basicPercent, 50)) / 100;
      const headcount = Math.max(1, toNumber(values.headcount, 1));

      const pfWage =
        values.pfBasis === "ceiling"
          ? Math.min(basic, PAYROLL_CONSTANTS.pfWageCeiling)
          : basic;

      const employerPf = pfWage * PAYROLL_CONSTANTS.pfRate;
      const edli = pfWage * PAYROLL_CONSTANTS.edliRate;
      const admin = pfWage * PAYROLL_CONSTANTS.pfAdminRate;
      const esiApplicable = gross <= PAYROLL_CONSTANTS.esiWageCeiling;
      const employerEsi = esiApplicable ? gross * PAYROLL_CONSTANTS.esiEmployerRate : 0;
      const gratuity = basic * PAYROLL_CONSTANTS.gratuityAccrualRate;

      const perEmployee = gross + employerPf + edli + admin + employerEsi + gratuity;

      return {
        headline: {
          label: headcount > 1 ? "Total monthly payroll cost" : "Monthly cost per employee",
          value: currency(perEmployee * headcount),
          caption: `${currency(perEmployee)} per employee · ${currency(perEmployee * headcount * 12)} a year`,
        },
        lines: [
          { label: "Gross salary", value: currency(gross) },
          { label: "Employer provident fund", value: currency(employerPf) },
          { label: "EDLI contribution", value: currency(edli) },
          { label: "PF administration charges", value: currency(admin) },
          {
            label: "Employer ESI",
            value: esiApplicable ? currency(employerEsi) : "Not applicable",
            hint: `ESI applies where gross wages are up to ${currency(PAYROLL_CONSTANTS.esiWageCeiling)}`,
          },
          { label: "Gratuity accrual", value: currency(gratuity) },
          { label: "Cost per employee", value: currency(perEmployee), emphasis: true },
          { label: "Annual cost for the group", value: currency(perEmployee * headcount * 12) },
        ],
        breakdown: [
          { label: "Salary", value: gross * headcount },
          { label: "Provident fund", value: (employerPf + edli + admin) * headcount },
          { label: "ESI", value: employerEsi * headcount },
          { label: "Gratuity", value: gratuity * headcount },
        ],
        note: "Contribution rates are notified and revised periodically. Professional tax and labour welfare fund, where applicable, are additional.",
      };
    },
  },
  {
    slug: "emi",
    title: "EMI calculator",
    description:
      "Compute the equated monthly instalment, total interest, and the split between principal and interest.",
    icon: "percent",
    group: "Lending",
    basis: "Reducing balance method",
    fields: [
      { name: "principal", label: "Loan amount", kind: "currency", defaultValue: 2_500_000, min: 0, step: 50_000 },
      { name: "rate", label: "Annual interest rate", kind: "percent", defaultValue: 9, min: 0, max: 36, step: 0.05 },
      { name: "years", label: "Tenure in years", kind: "number", defaultValue: 15, min: 1, max: 40, step: 1 },
    ],
    compute: (values): CalculatorOutput => {
      const principal = toNumber(values.principal);
      const rate = toNumber(values.rate);
      const years = toNumber(values.years, 1);
      const months = Math.max(1, Math.round(years * 12));
      const emi = emiFor(principal, rate, months);
      const totalPayment = emi * months;
      const totalInterest = Math.max(0, totalPayment - principal);

      const firstInterest = (principal * rate) / 12 / 100;

      return {
        headline: {
          label: "Monthly instalment",
          value: currency(emi),
          caption: `${months} instalments · total outflow ${currency(totalPayment)}`,
        },
        lines: [
          { label: "Principal", value: currency(principal) },
          { label: "Total interest", value: currency(totalInterest), emphasis: true },
          { label: "Total repayment", value: currency(totalPayment) },
          { label: "Interest as a share of principal", value: percent(principal ? (totalInterest / principal) * 100 : 0) },
          { label: "Interest in the first instalment", value: currency(firstInterest) },
          { label: "Principal in the first instalment", value: currency(Math.max(0, emi - firstInterest)) },
        ],
        breakdown: [
          { label: "Principal", value: principal },
          { label: "Interest", value: totalInterest },
        ],
        note: "Assumes a fixed rate for the full tenure. Processing fees, insurance, and rate resets are not included.",
      };
    },
  },
  {
    slug: "loan-eligibility",
    title: "Loan eligibility calculator",
    description:
      "Estimate the loan a lender would sanction from income, existing obligations, and the fixed obligation to income ratio.",
    icon: "wallet",
    group: "Lending",
    basis: "FOIR-based underwriting",
    fields: [
      { name: "monthlyIncome", label: "Net monthly income", kind: "currency", defaultValue: 150_000, min: 0, step: 5_000 },
      { name: "existingEmi", label: "Existing monthly EMIs", kind: "currency", defaultValue: 15_000, min: 0, step: 1_000 },
      { name: "foir", label: "Permitted FOIR", kind: "percent", defaultValue: 50, min: 20, max: 75, step: 1 },
      { name: "rate", label: "Annual interest rate", kind: "percent", defaultValue: 9.25, min: 1, max: 30, step: 0.05 },
      { name: "years", label: "Tenure in years", kind: "number", defaultValue: 20, min: 1, max: 30, step: 1 },
    ],
    compute: (values): CalculatorOutput => {
      const income = toNumber(values.monthlyIncome);
      const existing = toNumber(values.existingEmi);
      const foir = toNumber(values.foir, 50) / 100;
      const rate = toNumber(values.rate);
      const months = Math.max(1, Math.round(toNumber(values.years, 1) * 12));

      const availableEmi = Math.max(0, income * foir - existing);
      const monthly = rate / 12 / 100;
      const eligibleLoan =
        monthly === 0
          ? availableEmi * months
          : (availableEmi * (Math.pow(1 + monthly, months) - 1)) /
            (monthly * Math.pow(1 + monthly, months));

      const totalRepayment = availableEmi * months;

      return {
        headline: {
          label: "Indicative eligible loan",
          value: currency(eligibleLoan),
          caption: `Serviceable EMI of ${currency(availableEmi)} over ${months} months`,
        },
        lines: [
          { label: "Income considered", value: currency(income) },
          { label: "Existing obligations", value: currency(existing) },
          { label: "EMI capacity at the stated FOIR", value: currency(availableEmi), emphasis: true },
          { label: "Eligible loan amount", value: currency(eligibleLoan) },
          { label: "Total repayment over the tenure", value: currency(totalRepayment) },
          { label: "Total interest", value: currency(Math.max(0, totalRepayment - eligibleLoan)) },
        ],
        note: "Lenders also apply loan-to-value caps, credit score cut-offs, and age limits. Treat this as a planning figure, not a sanction.",
      };
    },
  },
  {
    slug: "sip-returns",
    title: "SIP and lumpsum returns",
    description:
      "Project the corpus from a monthly investment plan, a one-time investment, or both together.",
    icon: "trending",
    group: "Planning",
    basis: "Compounding at the assumed annual return",
    fields: [
      { name: "monthly", label: "Monthly investment", kind: "currency", defaultValue: 25_000, min: 0, step: 1_000 },
      { name: "lumpsum", label: "One-time investment", kind: "currency", defaultValue: 500_000, min: 0, step: 10_000 },
      { name: "rate", label: "Expected annual return", kind: "percent", defaultValue: 12, min: 0, max: 30, step: 0.5 },
      { name: "years", label: "Investment period in years", kind: "number", defaultValue: 10, min: 1, max: 40, step: 1 },
      { name: "stepUp", label: "Annual step-up in the SIP", kind: "percent", defaultValue: 0, min: 0, max: 25, step: 1 },
    ],
    compute: (values): CalculatorOutput => {
      const monthly = toNumber(values.monthly);
      const lumpsum = toNumber(values.lumpsum);
      const rate = toNumber(values.rate);
      const years = Math.max(1, Math.round(toNumber(values.years, 1)));
      const stepUp = toNumber(values.stepUp) / 100;

      const monthlyRate = rate / 12 / 100;
      let sipValue = 0;
      let invested = 0;
      let contribution = monthly;

      for (let year = 0; year < years; year += 1) {
        for (let month = 0; month < 12; month += 1) {
          sipValue = (sipValue + contribution) * (1 + monthlyRate);
          invested += contribution;
        }
        contribution *= 1 + stepUp;
      }

      const lumpsumValue = lumpsum * Math.pow(1 + rate / 100, years);
      const total = sipValue + lumpsumValue;
      const totalInvested = invested + lumpsum;
      const gain = total - totalInvested;

      return {
        headline: {
          label: `Corpus after ${years} years`,
          value: currency(total),
          caption: `Invested ${currency(totalInvested)} · gain ${currency(gain)}`,
        },
        lines: [
          { label: "SIP corpus", value: currency(sipValue) },
          { label: "Lumpsum corpus", value: currency(lumpsumValue) },
          { label: "Total invested", value: currency(totalInvested) },
          { label: "Wealth gained", value: currency(gain), emphasis: true },
          {
            label: "Multiple on investment",
            value: totalInvested > 0 ? `${number(total / totalInvested)}x` : "—",
          },
        ],
        breakdown: [
          { label: "Invested", value: totalInvested },
          { label: "Returns", value: Math.max(0, gain) },
        ],
        note: "Returns are assumed constant, which real markets are not. Capital gains tax on redemption is not deducted.",
      };
    },
  },
  {
    slug: "roi",
    title: "ROI and CAGR calculator",
    description:
      "Measure absolute return, annualised return, and the multiple on an investment over a holding period.",
    icon: "chart",
    group: "Planning",
    basis: "Absolute and compounded annual growth",
    fields: [
      { name: "invested", label: "Amount invested", kind: "currency", defaultValue: 1_000_000, min: 0, step: 10_000 },
      { name: "current", label: "Current or exit value", kind: "currency", defaultValue: 1_800_000, min: 0, step: 10_000 },
      { name: "years", label: "Holding period in years", kind: "number", defaultValue: 4, min: 0.25, max: 40, step: 0.25 },
    ],
    compute: (values): CalculatorOutput => {
      const invested = toNumber(values.invested);
      const current = toNumber(values.current);
      const years = Math.max(0.25, toNumber(values.years, 1));

      const gain = current - invested;
      const roi = invested > 0 ? (gain / invested) * 100 : 0;
      const cagr =
        invested > 0 && current > 0
          ? (Math.pow(current / invested, 1 / years) - 1) * 100
          : 0;

      return {
        headline: {
          label: "Compounded annual growth rate",
          value: percent(cagr),
          caption: `Absolute return ${percent(roi)} over ${number(years)} years`,
        },
        lines: [
          { label: "Amount invested", value: currency(invested) },
          { label: "Current value", value: currency(current) },
          { label: "Absolute gain", value: currency(gain), emphasis: true },
          { label: "Absolute return", value: percent(roi) },
          { label: "Annualised return", value: percent(cagr) },
          {
            label: "Multiple",
            value: invested > 0 ? `${number(current / invested)}x` : "—",
          },
        ],
        breakdown: [
          { label: "Capital", value: invested },
          { label: "Gain", value: Math.max(0, gain) },
        ],
        note: "CAGR smooths the path and ignores interim cash flows. For irregular cash flows, use XIRR instead.",
      };
    },
  },
  {
    slug: "break-even",
    title: "Break-even analysis",
    description:
      "Find the volume at which contribution covers fixed cost, and the margin of safety on the expected plan.",
    icon: "chart",
    group: "Business",
    basis: "Contribution margin method",
    fields: [
      { name: "fixedCost", label: "Fixed cost per month", kind: "currency", defaultValue: 800_000, min: 0, step: 10_000 },
      { name: "price", label: "Selling price per unit", kind: "currency", defaultValue: 2_500, min: 0, step: 50 },
      { name: "variableCost", label: "Variable cost per unit", kind: "currency", defaultValue: 1_400, min: 0, step: 50 },
      { name: "expectedUnits", label: "Expected monthly volume", kind: "number", defaultValue: 1_200, min: 0, step: 10 },
    ],
    compute: (values): CalculatorOutput => {
      const fixedCost = toNumber(values.fixedCost);
      const price = toNumber(values.price);
      const variableCost = toNumber(values.variableCost);
      const expectedUnits = toNumber(values.expectedUnits);

      const contribution = price - variableCost;
      const contributionRatio = price > 0 ? (contribution / price) * 100 : 0;
      const breakEvenUnits = contribution > 0 ? fixedCost / contribution : Number.POSITIVE_INFINITY;
      const breakEvenRevenue = breakEvenUnits * price;
      const profit = expectedUnits * contribution - fixedCost;
      const marginOfSafety =
        expectedUnits > 0 && Number.isFinite(breakEvenUnits)
          ? ((expectedUnits - breakEvenUnits) / expectedUnits) * 100
          : 0;

      return {
        headline: {
          label: "Break-even volume",
          value: Number.isFinite(breakEvenUnits)
            ? `${number(Math.ceil(breakEvenUnits), 0)} units`
            : "Not achievable",
          caption: Number.isFinite(breakEvenUnits)
            ? `Revenue of ${currency(breakEvenRevenue)} a month`
            : "Contribution per unit must be positive",
        },
        lines: [
          { label: "Contribution per unit", value: currency(contribution) },
          { label: "Contribution margin", value: percent(contributionRatio) },
          {
            label: "Break-even revenue",
            value: Number.isFinite(breakEvenRevenue) ? currency(breakEvenRevenue) : "—",
          },
          { label: "Profit at expected volume", value: currency(profit), emphasis: true },
          { label: "Margin of safety", value: percent(marginOfSafety) },
        ],
        breakdown: [
          { label: "Fixed cost", value: fixedCost },
          { label: "Variable cost at plan", value: variableCost * expectedUnits },
          { label: "Profit", value: Math.max(0, profit) },
        ],
        note: "Assumes a single product and a linear cost structure. Step-fixed costs move the break-even point sharply once crossed.",
      };
    },
  },
  {
    slug: "working-capital",
    title: "Working capital cycle",
    description:
      "Compute inventory, receivable, and payable days, the cash conversion cycle, and the funding it requires.",
    icon: "merge",
    group: "Business",
    basis: "Days-based operating cycle",
    fields: [
      { name: "revenue", label: "Annual revenue", kind: "currency", defaultValue: 120_000_000, min: 0, step: 1_000_000 },
      { name: "cogs", label: "Annual cost of goods sold", kind: "currency", defaultValue: 78_000_000, min: 0, step: 1_000_000 },
      { name: "inventory", label: "Average inventory", kind: "currency", defaultValue: 12_000_000, min: 0, step: 500_000 },
      { name: "receivables", label: "Average receivables", kind: "currency", defaultValue: 18_000_000, min: 0, step: 500_000 },
      { name: "payables", label: "Average payables", kind: "currency", defaultValue: 9_000_000, min: 0, step: 500_000 },
    ],
    compute: (values): CalculatorOutput => {
      const revenue = toNumber(values.revenue);
      const cogs = toNumber(values.cogs);
      const inventory = toNumber(values.inventory);
      const receivables = toNumber(values.receivables);
      const payables = toNumber(values.payables);

      const dio = cogs > 0 ? (inventory / cogs) * 365 : 0;
      const dso = revenue > 0 ? (receivables / revenue) * 365 : 0;
      const dpo = cogs > 0 ? (payables / cogs) * 365 : 0;
      const cycle = dio + dso - dpo;
      const dailyCost = cogs / 365;
      const funding = Math.max(0, cycle * dailyCost);

      return {
        headline: {
          label: "Cash conversion cycle",
          value: `${number(cycle, 0)} days`,
          caption: `Approximately ${currency(funding)} of working capital tied up`,
        },
        lines: [
          { label: "Days inventory outstanding", value: `${number(dio, 0)} days` },
          { label: "Days sales outstanding", value: `${number(dso, 0)} days` },
          { label: "Days payables outstanding", value: `${number(dpo, 0)} days` },
          { label: "Cash conversion cycle", value: `${number(cycle, 0)} days`, emphasis: true },
          { label: "Working capital requirement", value: currency(funding) },
          {
            label: "Effect of collecting 10 days faster",
            value: currency(Math.max(0, 10 * (revenue / 365))),
            hint: "Cash released from receivables",
          },
        ],
        breakdown: [
          { label: "Inventory days", value: Math.max(0, dio) },
          { label: "Receivable days", value: Math.max(0, dso) },
          { label: "Payable days", value: Math.max(0, dpo) },
        ],
        note: "A negative cycle means suppliers fund the operation. Seasonal businesses should run this on peak-period balances, not annual averages.",
      };
    },
  },
  {
    slug: "business-valuation",
    title: "Business valuation calculator",
    description:
      "Indicative enterprise and equity value using revenue and EBITDA multiples, adjusted for net debt.",
    icon: "chart",
    group: "Business",
    basis: "Market multiple approach",
    fields: [
      { name: "revenue", label: "Annual revenue", kind: "currency", defaultValue: 150_000_000, min: 0, step: 1_000_000 },
      { name: "ebitda", label: "EBITDA", kind: "currency", defaultValue: 27_000_000, min: 0, step: 500_000 },
      { name: "revenueMultiple", label: "Revenue multiple", kind: "number", defaultValue: 2.5, min: 0, max: 30, step: 0.1 },
      { name: "ebitdaMultiple", label: "EBITDA multiple", kind: "number", defaultValue: 12, min: 0, max: 40, step: 0.5 },
      { name: "debt", label: "Total debt", kind: "currency", defaultValue: 20_000_000, min: 0, step: 1_000_000 },
      { name: "cash", label: "Cash and equivalents", kind: "currency", defaultValue: 8_000_000, min: 0, step: 1_000_000 },
    ],
    compute: (values): CalculatorOutput => {
      const revenue = toNumber(values.revenue);
      const ebitda = toNumber(values.ebitda);
      const revenueMultiple = toNumber(values.revenueMultiple);
      const ebitdaMultiple = toNumber(values.ebitdaMultiple);
      const debt = toNumber(values.debt);
      const cash = toNumber(values.cash);

      const evRevenue = revenue * revenueMultiple;
      const evEbitda = ebitda * ebitdaMultiple;
      const netDebt = debt - cash;
      const equityRevenue = evRevenue - netDebt;
      const equityEbitda = evEbitda - netDebt;
      const midpoint = (equityRevenue + equityEbitda) / 2;
      const margin = revenue > 0 ? (ebitda / revenue) * 100 : 0;

      return {
        headline: {
          label: "Indicative equity value",
          value: currency(midpoint),
          caption: `Range ${currency(Math.min(equityRevenue, equityEbitda))} to ${currency(Math.max(equityRevenue, equityEbitda))}`,
        },
        lines: [
          { label: "EBITDA margin", value: percent(margin) },
          { label: "Enterprise value on revenue", value: currency(evRevenue) },
          { label: "Enterprise value on EBITDA", value: currency(evEbitda) },
          { label: "Net debt", value: currency(netDebt) },
          { label: "Equity value on revenue multiple", value: currency(equityRevenue) },
          { label: "Equity value on EBITDA multiple", value: currency(equityEbitda) },
          { label: "Midpoint", value: currency(midpoint), emphasis: true },
        ],
        breakdown: [
          { label: "Revenue basis", value: Math.max(0, equityRevenue) },
          { label: "EBITDA basis", value: Math.max(0, equityEbitda) },
        ],
        note: "Multiples must be drawn from genuinely comparable transactions. A registered valuer's report is required for regulatory purposes under the Companies Act and FEMA.",
      };
    },
  },
  {
    slug: "mca-fee",
    title: "MCA filing fee calculator",
    description:
      "Normal filing fee by nominal share capital, and the additional fee that applies to a delayed filing.",
    icon: "building",
    group: "Corporate",
    basis: "Companies (Registration Offices and Fees) Rules",
    fields: [
      { name: "capital", label: "Nominal share capital", kind: "currency", defaultValue: 1_000_000, min: 0, step: 100_000 },
      { name: "delayDays", label: "Days beyond the due date", kind: "number", defaultValue: 0, min: 0, max: 720, step: 1 },
      { name: "formCount", label: "Number of forms to file", kind: "number", defaultValue: 1, min: 1, max: 50, step: 1 },
    ],
    compute: (values): CalculatorOutput => {
      const capital = toNumber(values.capital);
      const delayDays = toNumber(values.delayDays);
      const formCount = Math.max(1, toNumber(values.formCount, 1));

      const slab = MCA_FEE_SLABS.find((entry) => capital < entry.upTo) ?? MCA_FEE_SLABS[MCA_FEE_SLABS.length - 1];
      const band =
        MCA_DELAY_MULTIPLIERS.find((entry) => delayDays <= entry.upToDays) ??
        MCA_DELAY_MULTIPLIERS[MCA_DELAY_MULTIPLIERS.length - 1];

      const normalFee = slab.fee * formCount;
      const totalFee = normalFee * band.multiplier;
      const additional = totalFee - normalFee;

      return {
        headline: {
          label: "Total fee payable",
          value: currency(totalFee),
          caption: `${band.label} · multiplier ${band.multiplier}x`,
        },
        lines: [
          { label: "Normal fee per form", value: currency(slab.fee) },
          { label: "Forms", value: `${formCount}` },
          { label: "Normal fee", value: currency(normalFee) },
          { label: "Additional fee for delay", value: currency(additional), emphasis: additional > 0 },
          { label: "Total", value: currency(totalFee), emphasis: true },
        ],
        breakdown: [
          { label: "Normal fee", value: normalFee },
          { label: "Additional fee", value: Math.max(0, additional) },
        ],
        note: "Annual filings such as AOC-4 and MGT-7 attract a flat additional fee of ₹100 per day with no cap, which is charged instead of the multiplier. Stamp duty on incorporation is separate and varies by state.",
      };
    },
  },
  {
    slug: "startup-cost",
    title: "Startup setup and runway",
    description:
      "Model incorporation and registration costs alongside monthly burn to see the capital required for a target runway.",
    icon: "rocket",
    group: "Business",
    basis: "Indicative professional and government costs",
    fields: [
      { name: "incorporation", label: "Incorporation and registrations", kind: "currency", defaultValue: 25_000, min: 0, step: 1_000 },
      { name: "compliance", label: "Annual compliance retainer", kind: "currency", defaultValue: 60_000, min: 0, step: 5_000 },
      { name: "salaries", label: "Monthly salary cost", kind: "currency", defaultValue: 450_000, min: 0, step: 10_000 },
      { name: "opex", label: "Other monthly operating cost", kind: "currency", defaultValue: 120_000, min: 0, step: 10_000 },
      { name: "revenue", label: "Expected monthly revenue", kind: "currency", defaultValue: 150_000, min: 0, step: 10_000 },
      { name: "runway", label: "Target runway in months", kind: "number", defaultValue: 18, min: 3, max: 48, step: 1 },
    ],
    compute: (values): CalculatorOutput => {
      const incorporation = toNumber(values.incorporation);
      const compliance = toNumber(values.compliance);
      const salaries = toNumber(values.salaries);
      const opex = toNumber(values.opex);
      const revenue = toNumber(values.revenue);
      const runway = Math.max(1, toNumber(values.runway, 12));

      const monthlyCost = salaries + opex + compliance / 12;
      const burn = Math.max(0, monthlyCost - revenue);
      const capitalRequired = incorporation + burn * runway;

      return {
        headline: {
          label: `Capital required for ${runway} months`,
          value: currency(capitalRequired),
          caption: burn === 0 ? "Operations are cash positive at plan" : `Net burn ${currency(burn)} a month`,
        },
        lines: [
          { label: "One-time setup cost", value: currency(incorporation) },
          { label: "Monthly operating cost", value: currency(monthlyCost) },
          { label: "Monthly revenue", value: currency(revenue) },
          { label: "Net monthly burn", value: currency(burn), emphasis: true },
          { label: "Cash needed for the runway", value: currency(burn * runway) },
          { label: "Total capital required", value: currency(capitalRequired) },
          {
            label: "Revenue needed to break even",
            value: currency(monthlyCost),
            hint: "Monthly revenue at which burn reaches zero",
          },
        ],
        breakdown: [
          { label: "Setup", value: incorporation },
          { label: "Salaries", value: salaries * runway },
          { label: "Other operating cost", value: (opex + compliance / 12) * runway },
        ],
        note: "Add a contingency of at least 15% and plan the raise so it closes with six months of runway remaining.",
      };
    },
  },
];

export const CALCULATOR_GROUPS = Array.from(
  new Set(CALCULATORS.map((calculator) => calculator.group)),
);

export function findCalculator(slug: string) {
  return CALCULATORS.find((calculator) => calculator.slug === slug);
}
