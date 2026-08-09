import type { Article } from "./types";

export const ARTICLES: Article[] = [
  {
    slug: "series-a-readiness-checklist-for-indian-startups",
    title: "Series A readiness: the fourteen things diligence will ask for",
    summary:
      "Cap table hygiene, ESOP accounting, statutory arrears, and revenue recognition — the file every investor requests, and how to have it ready before the term sheet.",
    topic: "Startup advisory",
    author: "CA Ravi Varshney",
    authorRole: "Partner — Transaction Advisory",
    publishedOn: "2026-07-28",
    publishedLabel: "28 July 2026",
    readingMinutes: 11,
    views: "6.8k",
    tags: ["Diligence", "Cap table", "ESOP", "Funding"],
    featured: true,
    keyTakeaways: [
      "Diligence failures are almost never valuation disputes — they are missing minutes, unstamped share transfers, and unreconciled TDS.",
      "Refresh the ESOP pool before the valuation is agreed, not after: a post-money pool dilutes founders alone.",
      "A 24-month statutory arrears register, closed and signed, shortens diligence by weeks.",
    ],
    body: [
      {
        type: "paragraph",
        text: "Most Series A rounds do not collapse over price. They stall in the fourth week of diligence, when the investor's counsel asks for a share transfer instrument that was never stamped, or a board resolution approving an allotment that happened eleven months earlier. The commercial conversation is finished by then; what remains is paperwork nobody prepared.",
      },
      {
        type: "paragraph",
        text: "The list below is the request register we see most often across growth rounds. Treat it as a pre-diligence audit you run on yourself, ideally two quarters before you start raising.",
      },
      { type: "heading", id: "cap-table", text: "1. The cap table has to reconcile three ways" },
      {
        type: "paragraph",
        text: "Your internal cap table, the MCA filings, and the register of members maintained under Section 88 of the Companies Act must agree to the last share. In practice they rarely do, because founders track the spreadsheet and forget PAS-3, or a secondary sale is recorded in the spreadsheet but never entered in the register.",
      },
      {
        type: "list",
        items: [
          "Pull the master data from MCA21 and tie every allotment to a PAS-3 with its challan.",
          "Match each transfer to a stamped SH-4 — unstamped transfers are inadmissible in evidence and will be flagged.",
          "Confirm the register of members and register of transfers are signed and current.",
          "Reconcile convertible instruments (CCPS, CCDs, SAFEs) separately: conversion ratios drive the post-money table.",
        ],
      },
      { type: "heading", id: "esop", text: "2. The ESOP pool, and where it sits in the waterfall" },
      {
        type: "paragraph",
        text: "Whether the option pool is created pre-money or post-money is a founder-dilution question worth several percentage points. If the pool is expanded pre-money, existing shareholders — that is, the founders — absorb the dilution alone. Negotiate the pool size at the same time as the price, and model the fully diluted table both ways before you sign the term sheet.",
      },
      {
        type: "callout",
        title: "The accounting nobody budgets for",
        text: "Options granted are an expense under Ind AS 102 / the Guidance Note on Share-based Payments, spread over the vesting period. Companies that grant generously in year one are frequently surprised by the charge that lands in the year they first present audited financials to an investor.",
      },
      { type: "heading", id: "statutory", text: "3. Statutory arrears, closed and evidenced" },
      {
        type: "paragraph",
        text: "Build a 24-month arrears register covering GST, TDS, PF, ESI, and professional tax. For every month, record the return, the filing date, the challan, and any interest or late fee paid. Where a mismatch exists between GSTR-3B and GSTR-2B, or between Form 26AS and the books, attach the reconciliation rather than the explanation.",
      },
      {
        type: "table",
        head: ["Area", "Evidence investors ask for", "Common gap"],
        rows: [
          ["GST", "3B vs 1 vs 2B reconciliation, 24 months", "ITC claimed on invoices never uploaded by the vendor"],
          ["TDS", "26AS vs books, challan-wise", "Payments deducted but deposited late, interest unprovided"],
          ["Payroll", "PF/ESI ECR and challans", "Contractor payments that should have been salaried"],
          ["Corporate", "Minutes, registers, MGT-7 / AOC-4", "Board approvals recorded after the fact"],
        ],
      },
      { type: "heading", id: "revenue", text: "4. Revenue recognition that survives a quality-of-earnings review" },
      {
        type: "paragraph",
        text: "Investors will rebuild your revenue from invoices and bank credits. Where you recognise on invoice but collect on milestones, or where a reseller relationship is recorded gross rather than net, the QoE adjustment reduces the base on which your multiple is applied. Document the policy, apply it consistently, and disclose the deferred revenue balance explicitly.",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "Write down the revenue recognition policy in one page, referencing Ind AS 115 performance obligations.",
          "Reconcile recognised revenue to GST outward supplies for each quarter — investors do this anyway.",
          "Separate one-time implementation fees from recurring subscription revenue in the MIS.",
          "Show churn and expansion cohorts on the same basis as the revenue you report.",
        ],
      },
      { type: "heading", id: "founder", text: "5. Founder agreements, IP, and the things that block signing" },
      {
        type: "paragraph",
        text: "Vesting schedules for founders, assignment of intellectual property created before incorporation, and non-compete clauses for departed co-founders are the three items that most often require a side letter at the eleventh hour. Each is straightforward to fix early and awkward to fix while the round is in escrow.",
      },
      {
        type: "quote",
        text: "The strongest diligence file we ever received was 40 pages long and answered every question before it was asked. The round closed in nineteen days.",
        attribution: "Investment principal, growth-stage fund",
      },
      {
        type: "paragraph",
        text: "If you are eighteen months from a raise, start with the arrears register and the cap table reconciliation. Everything else follows from having those two right.",
      },
    ],
  },
  {
    slug: "gst-input-tax-credit-reconciliation-that-holds-up",
    title: "Input tax credit: building a reconciliation that holds up in assessment",
    summary:
      "Why 2B-first reconciliation beats books-first, how to handle vendor non-filers without losing credit, and the working papers an officer actually accepts.",
    topic: "GST",
    author: "CA Nidhi Kapoor",
    authorRole: "Partner — Indirect Tax",
    publishedOn: "2026-07-21",
    publishedLabel: "21 July 2026",
    readingMinutes: 9,
    views: "5.4k",
    tags: ["GST", "ITC", "GSTR-2B", "Assessment"],
    featured: true,
    keyTakeaways: [
      "Reconcile from GSTR-2B outward, not from the purchase register inward — the statement is the constraint, not your books.",
      "Maintain a vendor-wise ageing of unmatched credit; it converts an assessment argument into a schedule.",
      "Credit reversed under Rule 37 for non-payment within 180 days can be reclaimed — track the reclaim date.",
    ],
    body: [
      {
        type: "paragraph",
        text: "The single most common notice we see is a mismatch between input tax credit claimed in GSTR-3B and credit available in GSTR-2B. The mismatch is usually genuine and usually explainable. What decides the outcome is whether the explanation is a narrative or a schedule.",
      },
      { type: "heading", id: "direction", text: "Reconcile in the right direction" },
      {
        type: "paragraph",
        text: "Teams instinctively start from the purchase register and look for each invoice in 2B. That produces a list of invoices you believe you are entitled to and cannot find — which is an argument. Starting from 2B and matching outward into the books produces a list of credits the statute makes available and you have or have not taken — which is a reconciliation.",
      },
      {
        type: "table",
        head: ["Bucket", "Meaning", "Treatment"],
        rows: [
          ["In 2B, in books", "Matched", "Claim in the return period"],
          ["In 2B, not in books", "Invoice not recorded", "Record or query with vendor; do not claim blind"],
          ["In books, not in 2B", "Vendor has not filed or filed late", "Do not claim; carry in the pending register"],
          ["In 2B, blocked", "Section 17(5) items", "Reverse and disclose separately"],
        ],
      },
      { type: "heading", id: "vendors", text: "Handling vendors who file late" },
      {
        type: "paragraph",
        text: "A vendor who files GSTR-1 a quarter late does not destroy your credit; it defers it. The practical control is commercial, not accounting: hold a portion of the payment until the invoice appears in your 2B, and say so in the purchase order. Where that is not possible, keep a vendor-wise ageing of unmatched credit so the exposure is visible monthly rather than annually.",
      },
      {
        type: "callout",
        title: "Rule 37 and the 180-day clock",
        text: "Credit availed on an invoice that remains unpaid 180 days after its date must be reversed with interest. The reversal is not permanent — when payment is eventually made, the credit is reclaimed. Firms lose money by reversing and never reclaiming, because nobody owns the reclaim date.",
      },
      { type: "heading", id: "papers", text: "What the working paper should contain" },
      {
        type: "list",
        ordered: true,
        items: [
          "A monthly summary tying 3B credit to 2B credit with each reconciling item quantified.",
          "A vendor-wise pending register with invoice date, value, tax, and the age of the mismatch.",
          "A blocked-credit schedule under Section 17(5) with the reason code for each line.",
          "A reversal and reclaim register under Rule 37 and Rule 42/43, month by month.",
          "The e-invoice IRN, where applicable, against each high-value purchase.",
        ],
      },
      {
        type: "paragraph",
        text: "Assemble those five schedules monthly and an annual assessment becomes a review rather than a reconstruction. The cost is roughly two hours a month; the alternative is a fortnight under notice.",
      },
    ],
  },
  {
    slug: "old-vs-new-tax-regime-decision-framework",
    title: "Old regime or new: a decision framework, not a rule of thumb",
    summary:
      "The break-even deduction level, where house property interest changes the answer, and why the choice is annual for salaried taxpayers but sticky for business income.",
    topic: "Direct tax",
    author: "CA Ravi Varshney",
    authorRole: "Partner — Direct Tax",
    publishedOn: "2026-07-14",
    publishedLabel: "14 July 2026",
    readingMinutes: 8,
    views: "9.1k",
    tags: ["Income tax", "Regime", "Salary", "Deductions"],
    keyTakeaways: [
      "Compute both regimes; the break-even deduction level moves with income, so heuristics fail at the edges.",
      "Salaried taxpayers may switch each year. Taxpayers with business income get one switch back, then it is locked.",
      "Let-out property interest remains deductible in the new regime; self-occupied interest does not.",
    ],
    body: [
      {
        type: "paragraph",
        text: "Every year the same question arrives in July: which regime should I choose? Every year the honest answer is the same: compute both. The heuristics circulating on social media — \"choose new if your deductions are below two lakh\" — are true across part of the income range and wrong across the rest.",
      },
      { type: "heading", id: "difference", text: "What actually differs" },
      {
        type: "paragraph",
        text: "The new regime offers wider slabs and a lower effective rate, in exchange for surrendering most Chapter VI-A deductions and several exemptions. The old regime keeps them. So the decision reduces to a single comparison: is the tax saved by the wider slabs larger than the tax saved by the deductions you would forfeit?",
      },
      {
        type: "list",
        items: [
          "Retained in the new regime: standard deduction on salary, employer NPS contribution under 80CCD(2), interest on let-out property, and family pension deduction.",
          "Forfeited: 80C, 80D, 80E, 80G, HRA, LTA, and interest on a self-occupied house under Section 24(b).",
          "Rebate under Section 87A is more generous in the new regime, which is what makes it decisive at lower income levels.",
        ],
      },
      { type: "heading", id: "breakeven", text: "The break-even moves with income" },
      {
        type: "paragraph",
        text: "At lower incomes the enhanced rebate makes the new regime almost unbeatable regardless of deductions. In the middle band, the answer turns on whether you carry a home loan on a self-occupied property — the interest deduction is the single largest swing item for most salaried taxpayers. Above the surcharge thresholds, the reduced surcharge cap in the new regime becomes material again.",
      },
      {
        type: "callout",
        title: "Run the numbers",
        text: "Our income tax calculator computes both regimes side by side from the same inputs, including surcharge, marginal relief, and cess. Use it before you file your declaration to the employer in April, not in January when the deduction is already committed.",
      },
      { type: "heading", id: "switching", text: "Switching rules differ by income type" },
      {
        type: "paragraph",
        text: "A salaried taxpayer without business income elects the regime each year while filing, and may alternate freely. A taxpayer with income from business or profession who opts out of the new regime may return to it once — and after that the choice is locked for subsequent years. Treat that as a planning constraint, not an administrative footnote.",
      },
      {
        type: "paragraph",
        text: "One practical note: the declaration you give your employer in April drives TDS, not your final liability. Choosing a regime for TDS purposes does not prevent you from filing under the other, but it does change your cash flow through the year.",
      },
    ],
  },
  {
    slug: "internal-financial-controls-for-mid-market-companies",
    title: "Internal financial controls that auditors can test and staff can follow",
    summary:
      "Designing an IFC framework proportionate to a ₹100–500 crore business: risk-control matrices that fit on a page, and the four controls that fail most often.",
    topic: "Audit & assurance",
    author: "CA Meera Iyer",
    authorRole: "Partner — Assurance",
    publishedOn: "2026-07-07",
    publishedLabel: "7 July 2026",
    readingMinutes: 10,
    views: "3.6k",
    tags: ["IFC", "Audit", "Controls", "Companies Act"],
    keyTakeaways: [
      "A control that cannot be evidenced cannot be tested; design the evidence at the same time as the control.",
      "Four controls fail most often: vendor master changes, journal approvals, credit notes, and bank mandate updates.",
      "Proportionality is permitted — a 40-control matrix operated properly beats a 400-control matrix on paper.",
    ],
    body: [
      {
        type: "paragraph",
        text: "Section 143(3)(i) of the Companies Act requires the auditor to report on the adequacy and operating effectiveness of internal financial controls over financial reporting. In practice, that turns into a risk-control matrix, and the matrix turns into a document nobody in operations has read.",
      },
      { type: "heading", id: "proportion", text: "Start from proportionality" },
      {
        type: "paragraph",
        text: "A company with ₹200 crore of revenue, four locations and a 12-person finance team does not need the control framework of a listed multinational. It needs a framework whose every control is performed, evidenced, and testable. Forty well-operated controls will produce a cleaner report than four hundred aspirational ones.",
      },
      { type: "heading", id: "evidence", text: "Design the evidence with the control" },
      {
        type: "paragraph",
        text: "The most common finding is not an absent control — it is a control performed without a trace. A manager who genuinely reviews the ageing every month but leaves no record has, for audit purposes, not performed the control. Build the artefact into the process: a signed checklist, a workflow approval, a dated system log.",
      },
      {
        type: "table",
        head: ["Control", "Typical failure", "Evidence that works"],
        rows: [
          ["Vendor master changes", "Bank details changed by the person who processes payments", "Maker-checker log with the change record attached"],
          ["Manual journals", "Posted and approved by the same user", "System-enforced approval queue, exported monthly"],
          ["Credit notes", "Issued without reference to the original invoice", "Sequential register with reason codes and approvals"],
          ["Bank mandates", "Signatory list not refreshed after exits", "Annual confirmation from the bank, filed"],
        ],
      },
      { type: "heading", id: "segregation", text: "Segregation of duties in a small team" },
      {
        type: "paragraph",
        text: "Where headcount makes true segregation impossible, compensating controls are acceptable if they are documented as such. A single accountant who both records and reconciles can be compensated by an independent monthly review of the reconciliation by the CFO, evidenced by sign-off. What is not acceptable is silence about the limitation.",
      },
      {
        type: "callout",
        title: "The walkthrough test",
        text: "Before the audit begins, pick three transactions — a purchase, a sale, and a payroll run — and walk each one end to end, collecting every artefact. If you cannot assemble the file in an afternoon, neither can the auditor, and the finding writes itself.",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "Map processes to financial statement line items and identify what could go wrong at each step.",
          "Write controls that address the specific failure, not the process in general.",
          "Name an owner and a frequency for every control.",
          "Define the artefact each control produces and where it is stored.",
          "Test a sample yourself, quarterly, before the auditor does it annually.",
        ],
      },
    ],
  },
  {
    slug: "transfer-pricing-documentation-for-first-time-filers",
    title: "Transfer pricing documentation for first-time filers",
    summary:
      "Thresholds, the Master File and Local File split, benchmarking that survives scrutiny, and what to do when comparables are thin.",
    topic: "International tax",
    author: "CA Arjun Deshmukh",
    authorRole: "Director — International Tax",
    publishedOn: "2026-06-30",
    publishedLabel: "30 June 2026",
    readingMinutes: 12,
    views: "2.8k",
    tags: ["Transfer pricing", "FEMA", "Form 3CEB", "Benchmarking"],
    keyTakeaways: [
      "Form 3CEB is required for any international transaction with an associated enterprise — there is no de minimis.",
      "Benchmarking is defensible when the search strategy is documented, not when the margin happens to fall in range.",
      "Contemporaneous documentation means before the due date, not before the assessment.",
    ],
    body: [
      {
        type: "paragraph",
        text: "The first year a subsidiary transacts with its overseas parent is the year transfer pricing becomes real. Many groups discover the obligation late, after the intercompany service agreement has been signed and the invoices raised, at which point the documentation has to justify a position rather than describe one.",
      },
      { type: "heading", id: "who", text: "Who has to file, and what" },
      {
        type: "paragraph",
        text: "An accountant's report in Form 3CEB is required from every person entering into an international transaction with an associated enterprise, irrespective of value. Separately, entities above the prescribed turnover thresholds maintain the Master File (Form 3CEAA) and, for large multinational groups, Country-by-Country reporting applies at the parent level.",
      },
      {
        type: "list",
        items: [
          "Form 3CEB — accountant's report on international and specified domestic transactions.",
          "Local File — the functional analysis, benchmarking, and economic justification for each transaction.",
          "Master File — group structure, intangibles, financing, and the global business description.",
          "Form 3CEAB / 3CEAC / 3CEAD — intimation and CbCR filings where the group is in scope.",
        ],
      },
      { type: "heading", id: "functional", text: "The functional analysis carries the argument" },
      {
        type: "paragraph",
        text: "Benchmarking without a functional analysis is arithmetic. The functional, asset, and risk profile determines which party is the tested party and which method applies. A captive service provider bearing no market risk is benchmarked differently from a full-fledged distributor, and the difference is worth several percentage points of margin.",
      },
      {
        type: "callout",
        title: "Document the search, not just the result",
        text: "An officer challenging a benchmarking study attacks the search strategy first: the database, the filters, the rejection reasons for each excluded comparable. Keep the screenshots and the rejection matrix. A study that reports only the final set is far weaker than one that shows how it was reached.",
      },
      { type: "heading", id: "thin", text: "When comparables are thin" },
      {
        type: "paragraph",
        text: "For niche services, the accepted set may fall to three or four companies. Widen carefully — a multiple-year data approach, a relaxed turnover filter, or a functionally adjacent industry are all defensible if reasoned. What is not defensible is silently including a comparable whose business is materially different because its margin helps.",
      },
      {
        type: "paragraph",
        text: "Finally, treat documentation as contemporaneous. Prepare it before the filing due date, sign it, and date it. Documentation assembled after a notice is admissible but discounted, and the difference shows in the assessment.",
      },
    ],
  },
  {
    slug: "virtual-cfo-operating-cadence",
    title: "The operating cadence of a virtual CFO engagement",
    summary:
      "What a founder should expect weekly, monthly, and quarterly — the reporting pack, the decisions it should trigger, and how to tell when the engagement is working.",
    topic: "Advisory",
    author: "CA Meera Iyer",
    authorRole: "Partner — Business Advisory",
    publishedOn: "2026-06-23",
    publishedLabel: "23 June 2026",
    readingMinutes: 7,
    views: "4.0k",
    tags: ["Virtual CFO", "MIS", "Cash flow", "Reporting"],
    keyTakeaways: [
      "A monthly pack that arrives on the 25th is history; one that arrives on the 7th is a decision tool.",
      "Thirteen-week rolling cash flow is the single highest-value artefact for a company under ₹100 crore.",
      "Measure the engagement by decisions changed, not by reports delivered.",
    ],
    body: [
      {
        type: "paragraph",
        text: "Virtual CFO is a category that means very different things depending on who is selling it. At the weaker end it is bookkeeping with a better title. At the stronger end it is a finance function operating at a cadence the business can actually use.",
      },
      { type: "heading", id: "weekly", text: "Weekly: cash and collections" },
      {
        type: "list",
        items: [
          "Rolling thirteen-week cash forecast, updated with actuals, variances explained in one line each.",
          "Receivables over 45 days with an owner against each account.",
          "Payment run approved against available balance, not against the payables list.",
        ],
      },
      { type: "heading", id: "monthly", text: "Monthly: close by the seventh working day" },
      {
        type: "paragraph",
        text: "A close that lands on the 25th describes a month you can no longer influence. The target is the seventh working day, which requires cut-off discipline — accruals booked from a standing schedule, revenue recognised from a signed policy, and bank and GST reconciliations completed as part of close rather than after it.",
      },
      {
        type: "table",
        head: ["Pack section", "Question it answers", "Owner"],
        rows: [
          ["P&L with budget variance", "Where did we deviate and why", "Controller"],
          ["Unit economics by segment", "Which revenue is actually profitable", "Virtual CFO"],
          ["Cash bridge", "Where did the cash go this month", "Controller"],
          ["Compliance tracker", "What is due, what is filed, what is at risk", "Compliance lead"],
        ],
      },
      { type: "heading", id: "quarterly", text: "Quarterly: the decisions" },
      {
        type: "paragraph",
        text: "Quarterly work is where the engagement earns its fee: pricing reviews, hiring plan against runway, vendor renegotiation, capital structure, and the tax position for the year. If four quarters pass without a single decision changing as a result of the pack, the cadence is producing reports rather than judgement.",
      },
      {
        type: "quote",
        text: "We stopped asking whether the numbers were right and started asking what we would do differently if they were.",
        attribution: "Founder, D2C brand, ₹80 crore revenue",
      },
    ],
  },
  {
    slug: "msme-delayed-payment-45-day-rule",
    title: "The 45-day MSME payment rule and what it does to your tax deduction",
    summary:
      "Section 43B(h) in practice: identifying registered suppliers, the difference between 15 and 45 days, and the year-end disallowance that surprises buyers.",
    topic: "Direct tax",
    author: "CA Nidhi Kapoor",
    authorRole: "Partner — Direct Tax",
    publishedOn: "2026-06-16",
    publishedLabel: "16 June 2026",
    readingMinutes: 6,
    views: "7.2k",
    tags: ["MSME", "43B(h)", "Working capital", "Udyam"],
    keyTakeaways: [
      "The deduction is disallowed in the year of accrual and allowed only in the year of actual payment.",
      "The clock is 15 days without a written agreement and up to 45 days with one — never longer.",
      "Traders registered on Udyam are outside the payment protection; verify the classification, not just the certificate.",
    ],
    body: [
      {
        type: "paragraph",
        text: "Section 43B(h) links an income tax deduction to the timeliness of payment to micro and small enterprises. It is a short provision with a long tail: a buyer who pays a registered micro supplier on day 60 loses the deduction for that expense in the year it was incurred, and gets it only in the year the payment is finally made.",
      },
      { type: "heading", id: "clock", text: "Fifteen days, or forty-five" },
      {
        type: "paragraph",
        text: "Under the MSMED Act, where there is no written agreement, payment is due within 15 days of acceptance of goods or services. Where a written agreement exists, the parties may extend the period, but not beyond 45 days. An agreement purporting to allow 90 days is void to the extent of the excess — it does not buy time, it merely fails.",
      },
      {
        type: "callout",
        title: "Traders are treated differently",
        text: "Udyam registration is available to traders, but the delayed-payment protection under the MSMED Act extends to manufacturers and service providers. Read the classification on the certificate rather than the fact of registration.",
      },
      { type: "heading", id: "process", text: "The process that prevents the surprise" },
      {
        type: "list",
        ordered: true,
        items: [
          "Collect Udyam numbers as part of vendor onboarding and store the classification in the vendor master.",
          "Flag micro and small suppliers in the ERP so ageing can be reported separately.",
          "Run a 43B(h) exception report at each month end, not at year end.",
          "Reconcile the year-end unpaid balance to the tax computation and disclose it in the notes.",
        ],
      },
      {
        type: "paragraph",
        text: "The disclosure requirement under the Companies Act already asks for amounts payable to micro and small enterprises. If that note is currently populated as nil because nobody collected the registrations, that is the first thing to fix.",
      },
    ],
  },
  {
    slug: "automation-in-finance-teams-what-works",
    title: "Automation in finance teams: where it pays, and where it quietly costs",
    summary:
      "Bank reconciliation, invoice capture, and GST return preparation are worth automating. Approvals, judgement, and close narratives are not — here is why.",
    topic: "Technology",
    author: "CA Arjun Deshmukh",
    authorRole: "Director — Digital Finance",
    publishedOn: "2026-06-09",
    publishedLabel: "9 June 2026",
    readingMinutes: 8,
    views: "3.3k",
    tags: ["Automation", "AI", "Close", "Process"],
    keyTakeaways: [
      "Automate high-volume, low-judgement, high-repeatability work first — reconciliation and document capture.",
      "Automated extraction still needs a confidence threshold and a human queue below it.",
      "The saving is real only if the headcount is redeployed; otherwise it is a licence cost.",
    ],
    body: [
      {
        type: "paragraph",
        text: "Finance automation projects fail for a predictable reason: they target the visible work rather than the voluminous work. The month-end narrative is visible and takes two hours. Bank reconciliation is invisible and takes forty.",
      },
      { type: "heading", id: "candidates", text: "Good candidates" },
      {
        type: "table",
        head: ["Process", "Why it suits automation", "Realistic saving"],
        rows: [
          ["Bank reconciliation", "High volume, rule-based matching, stable formats", "60–80% of effort"],
          ["Purchase invoice capture", "Structured documents, verifiable totals", "50–70% with a review queue"],
          ["GST return preparation", "Deterministic mapping from the ledger", "40–60%"],
          ["Payroll input collation", "Repetitive, template-driven", "50%"],
        ],
      },
      { type: "heading", id: "poor", text: "Poor candidates" },
      {
        type: "paragraph",
        text: "Anything where the cost of a wrong answer is high and the frequency is low: provisioning judgements, related-party identification, going-concern assessment, and approval decisions. Automating an approval does not remove the judgement, it removes the accountability for it.",
      },
      {
        type: "callout",
        title: "Set a confidence threshold",
        text: "Document extraction should route anything below a defined confidence score to a human queue, and the queue should be measured. Teams that skip this step discover the error rate months later, in an audit sample.",
      },
      {
        type: "paragraph",
        text: "Finally, be honest about the benefit. If forty hours a month are saved and nobody's role changes, the organisation has bought a licence, not a saving. Plan the redeployment before the implementation, and measure it afterwards.",
      },
    ],
  },
  {
    slug: "director-kyc-and-mca-compliance-calendar",
    title: "Director KYC, DIN status, and the MCA filings that freeze a company",
    summary:
      "What actually happens when DIR-3 KYC is missed, how deactivation cascades into blocked filings, and the annual calendar that prevents it.",
    topic: "Corporate law",
    author: "CS Priya Menon",
    authorRole: "Company Secretary",
    publishedOn: "2026-06-02",
    publishedLabel: "2 June 2026",
    readingMinutes: 6,
    views: "5.9k",
    tags: ["MCA", "DIN", "KYC", "Annual filing"],
    keyTakeaways: [
      "A deactivated DIN blocks every filing the director must sign — including the one that reactivates the company's compliance.",
      "Reactivation carries a fee and takes days, not hours; plan around the September window.",
      "One calendar, one owner, and a 30-day advance reminder prevents nearly every MCA penalty we see.",
    ],
    body: [
      {
        type: "paragraph",
        text: "The Director Identification Number KYC filing is administratively trivial and operationally dangerous. It takes minutes to file and, when missed, deactivates the DIN — which means the director cannot sign any e-form until it is restored, and a company with two directors and two lapsed DINs cannot file anything at all.",
      },
      { type: "heading", id: "cascade", text: "How it cascades" },
      {
        type: "list",
        items: [
          "DIN deactivated for non-filing of DIR-3 KYC.",
          "Director cannot digitally sign AOC-4 or MGT-7, so annual filings lapse.",
          "Late annual filings attract per-day additional fees with no cap.",
          "Bank and investor diligence flags the company as non-compliant on the MCA master data.",
        ],
      },
      {
        type: "callout",
        title: "Reactivation is not instant",
        text: "Restoring a deactivated DIN requires filing with the prescribed fee, and the status change is not immediate. If an allotment or a charge filing is time-sensitive, the delay matters.",
      },
      { type: "heading", id: "calendar", text: "The annual calendar" },
      {
        type: "table",
        head: ["Filing", "Applies to", "Broad timing"],
        rows: [
          ["DIR-3 KYC / web KYC", "Every DIN holder", "Annually, by 30 September"],
          ["AOC-4", "Companies", "Within 30 days of AGM"],
          ["MGT-7 / MGT-7A", "Companies / small companies", "Within 60 days of AGM"],
          ["DPT-3", "Companies with loans or deposits", "By 30 June"],
          ["MSME-1", "Companies with MSME dues over 45 days", "Half-yearly"],
        ],
      },
      {
        type: "paragraph",
        text: "Put every one of those on a single calendar with a named owner and a reminder set thirty days ahead. Nearly every MCA penalty we have seen in the last three years traces back to the absence of exactly that.",
      },
    ],
  },
  {
    slug: "pricing-a-professional-services-engagement",
    title: "Pricing an engagement when the client asks for a fixed fee",
    summary:
      "Scoping the boundary, pricing the uncertainty, and writing a change-order clause the client will accept before the work starts.",
    topic: "Practice management",
    author: "CA Meera Iyer",
    authorRole: "Partner — Practice",
    publishedOn: "2026-05-26",
    publishedLabel: "26 May 2026",
    readingMinutes: 7,
    views: "2.1k",
    tags: ["Pricing", "Scope", "Engagement letter"],
    keyTakeaways: [
      "Price the scope boundary, not the hours — then define the boundary precisely enough to be enforced.",
      "Name the assumptions in the engagement letter; every assumption is a change-order trigger.",
      "A fixed fee without a documented scope is a fixed loss with extra steps.",
    ],
    body: [
      {
        type: "paragraph",
        text: "Fixed fees are not the problem. Undefined scope is the problem. A fixed fee attached to a precisely bounded scope transfers a manageable amount of risk in exchange for pricing certainty the client genuinely values.",
      },
      { type: "heading", id: "boundary", text: "Define the boundary in artefacts" },
      {
        type: "paragraph",
        text: "Describe the deliverable as a list of documents produced, not activities performed. \"Statutory audit for FY 2026-27 including the audit report, IFC report, and the tax audit annexures\" is a boundary. \"Audit support\" is not.",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "List the deliverables as named artefacts with a delivery date.",
          "State the client inputs the price assumes: trial balance by a date, schedules in an agreed format, one point of contact.",
          "Cap the iterations — two rounds of comments included, further rounds billed.",
          "Name what is excluded explicitly, especially representation before authorities.",
        ],
      },
      {
        type: "callout",
        title: "The assumption list is the change-order clause",
        text: "Every assumption you write down becomes a documented trigger for a scope conversation. Firms that skip the assumptions section end up negotiating scope after the overrun, from a weaker position.",
      },
      {
        type: "paragraph",
        text: "Price the uncertainty separately: a contingency for the known unknowns, a rate card for the unknown unknowns. Clients accept both readily when they are stated before the work begins and almost never when they appear in the final invoice.",
      },
    ],
  },
];

export const ARTICLE_TOPICS = Array.from(
  new Set(ARTICLES.map((article) => article.topic)),
).sort();

export function findArticle(slug: string) {
  return ARTICLES.find((article) => article.slug === slug);
}

export function relatedArticles(slug: string, limit = 3) {
  const current = findArticle(slug);
  if (!current) return ARTICLES.slice(0, limit);

  return ARTICLES.filter((article) => article.slug !== slug)
    .map((article) => ({
      article,
      score:
        (article.topic === current.topic ? 3 : 0) +
        article.tags.filter((tag) => current.tags.includes(tag)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.article);
}
