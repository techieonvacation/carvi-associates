import type { Short } from "./types";

export const SHORTS: Short[] = [
  {
    id: "short-itc-2b",
    title: "Check GSTR-2B before you raise a vendor dispute",
    preview:
      "A credit missing from your books is a recording problem; a credit missing from 2B is a vendor problem. They need different conversations.",
    detail:
      "Pull the invoice reference in GSTR-2B for the return period first. If it is present, the gap is in your purchase register. If it is absent, the vendor has not filed GSTR-1 for that period — hold the tax component of the payment and raise it commercially, not as an accounting query.",
    topic: "GST",
    source: "Rule 36(4) and Section 16(2)(aa)",
  },
  {
    id: "short-din-kyc",
    title: "A lapsed DIN blocks every form the director must sign",
    preview:
      "Missing DIR-3 KYC does not just attract a fee — it deactivates the DIN and freezes the company's filings until restored.",
    detail:
      "Set a calendar reminder 30 days before the annual deadline for every DIN holder, including non-resident directors who often miss it. Restoration requires a fresh filing with fee and is not instantaneous, so a time-sensitive allotment or charge filing can be genuinely delayed.",
    topic: "MCA",
    source: "Rule 12A, Companies (Appointment and Qualification of Directors) Rules",
  },
  {
    id: "short-26as",
    title: "TDS credit missing from Form 26AS? Ask for the challan, not the certificate",
    preview:
      "A Form 16A proves deduction. Only the challan and the correct PAN in the TDS return produce credit in 26AS.",
    detail:
      "Where credit is missing, ask the deductor for the BSR code, challan serial number, and deposit date, then confirm your PAN appears in the corresponding statement on TRACES. Most cases resolve as a PAN keying error in the deductor's return, which they fix by filing a correction statement.",
    topic: "Income tax",
    source: "Section 199 and Rule 37BA",
  },
  {
    id: "short-esop-pool",
    title: "Negotiate the ESOP pool before the valuation is locked",
    preview:
      "A pool created pre-money dilutes founders alone. The same pool created post-money is shared with the incoming investor.",
    detail:
      "Model the fully diluted cap table both ways and put the resulting founder percentages side by side. The difference on a typical 10% pool at Series A is worth more than most price negotiations move the number.",
    topic: "Startup",
    source: "Term sheet practice",
  },
  {
    id: "short-msme-class",
    title: "MSME classification needs both investment and turnover to qualify",
    preview:
      "An enterprise falls to the higher category if either criterion is exceeded — the tests are cumulative, not alternative.",
    detail:
      "Check the composite criteria on the Udyam certificate rather than assuming from headcount or revenue alone. Classification drives both the delayed-payment protection under the MSMED Act and the buyer's disallowance exposure under Section 43B(h).",
    topic: "MSME",
    source: "MSMED Act, as amended",
  },
  {
    id: "short-pf-wage",
    title: "A generous CTC does not raise PF if basic pay is structured low",
    preview:
      "Statutory contributions follow basic plus dearness allowance, not cost to company.",
    detail:
      "Splitting salary into large allowance components reduces PF cost but has been challenged where allowances are universally paid and ordinarily earned. Document the rationale for each allowance head and review structures that push basic below 50% of gross.",
    topic: "Payroll",
    source: "EPF & MP Act; Supreme Court on basic wages",
  },
  {
    id: "short-43bh",
    title: "43B(h) disallows in the year of accrual, not the year of the notice",
    preview:
      "Paying a micro supplier late moves the deduction to the following year, which changes this year's tax outflow.",
    detail:
      "Run the exception report monthly. A year-end scramble to clear MSME dues before 31 March works, but only for invoices whose statutory due date has not already passed within the year.",
    topic: "Income tax",
    source: "Section 43B(h)",
  },
  {
    id: "short-eway",
    title: "An e-way bill that expires in transit cannot be extended retrospectively",
    preview:
      "Validity extension is available within a narrow window around expiry — outside it, the consignment travels unprotected.",
    detail:
      "Build the extension check into the transporter SOP for any movement over 200 km or crossing a state boundary at night. Detention proceedings on an expired bill are expensive relative to the two minutes the extension takes.",
    topic: "GST",
    source: "Rule 138(10)",
  },
  {
    id: "short-advance-tax",
    title: "Advance tax shortfall interest runs from the instalment date",
    preview:
      "Paying the full liability in March does not cure a June or September shortfall.",
    detail:
      "Interest under Sections 234B and 234C is computed instalment by instalment. Forecast the annual liability in the first quarter and revise it each quarter; the cost of over-paying is nil, the cost of under-paying is 1% per month.",
    topic: "Income tax",
    source: "Sections 234B and 234C",
  },
  {
    id: "short-related-party",
    title: "Related-party approvals must precede the transaction",
    preview:
      "A ratification after the fact is a disclosure of a breach, not a cure for one.",
    detail:
      "Maintain a standing related-party register, refresh it whenever a director or KMP changes, and route every proposed transaction through the audit committee agenda before the purchase order, not before the audit.",
    topic: "Corporate law",
    source: "Section 188, Companies Act",
  },
  {
    id: "short-fema-fcgpr",
    title: "FC-GPR is due within 30 days of allotment, not of receipt",
    preview:
      "The reporting clock starts when shares are allotted, and the money must be allotted against within 60 days of receipt.",
    detail:
      "Two clocks run in parallel on inbound investment: allot within 60 days of receiving the funds, and report the allotment in FC-GPR within 30 days. Missing either triggers late submission fees, computed on the amount and the delay.",
    topic: "FEMA",
    source: "FEMA (Non-Debt Instruments) Rules",
  },
  {
    id: "short-audit-trail",
    title: "The audit trail feature must be enabled for the entire year",
    preview:
      "Turning it on in March does not satisfy a requirement that applies throughout the financial year.",
    detail:
      "Accounting software must record an edit log that cannot be disabled, and the auditor reports on whether the feature operated all year. Retain the server logs proving the setting was never switched off, including through any migration.",
    topic: "Audit",
    source: "Rule 3(1), Companies (Accounts) Rules",
  },
];
