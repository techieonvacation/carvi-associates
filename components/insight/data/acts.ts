import type { Act } from "./types";

export const ACTS: Act[] = [
  {
    slug: "companies-act-2013",
    title: "Companies Act, 2013",
    shortName: "Companies Act",
    summary:
      "The core statute governing incorporation, governance, accounts, audit, and filings for companies in India.",
    status: "Amended",
    authority: "Ministry of Corporate Affairs",
    lastUpdated: "12 June 2026",
    appliesTo: "Every company incorporated in India, with relaxations for small and one person companies",
    keySections: [
      {
        heading: "Section 134 — Financial statement and board report",
        text: "Requires the board report to contain the directors' responsibility statement, including a declaration on internal financial controls for listed companies.",
      },
      {
        heading: "Section 143(3)(i) — Reporting on internal financial controls",
        text: "Obliges the auditor to report on the adequacy and operating effectiveness of internal financial controls over financial reporting.",
      },
      {
        heading: "Section 185 and 186 — Loans and investments",
        text: "Restricts loans to directors and connected persons, and caps inter-corporate loans, guarantees, and investments without prior approval.",
      },
      {
        heading: "Section 188 — Related party transactions",
        text: "Requires prior audit committee and board approval, and shareholder approval above prescribed thresholds, for specified related-party contracts.",
      },
      {
        heading: "Section 92 and 137 — Annual return and financial statements",
        text: "Prescribe filing of MGT-7 and AOC-4 within the stated period after the annual general meeting.",
      },
    ],
    penalties:
      "Monetary penalties on the company and every officer in default, with per-day additional fees for late filings that carry no upper cap.",
    source: "https://www.mca.gov.in",
  },
  {
    slug: "income-tax-act-1961",
    title: "Income-tax Act, 1961",
    shortName: "Income Tax Act",
    summary:
      "The direct tax framework covering computation, assessment, deduction at source, appeals, and penalties.",
    status: "Amended",
    authority: "Central Board of Direct Taxes",
    lastUpdated: "1 April 2026",
    appliesTo: "All persons chargeable to income tax in India, resident and non-resident",
    keySections: [
      {
        heading: "Section 43B(h) — Payments to micro and small enterprises",
        text: "Allows the deduction only in the year of actual payment where payment is delayed beyond the MSMED Act timeline.",
      },
      {
        heading: "Section 44AB — Tax audit",
        text: "Requires audit of accounts where turnover or gross receipts exceed the prescribed threshold, with relaxations for digital transactions.",
      },
      {
        heading: "Section 115BAC — Alternative tax regime",
        text: "Provides concessional slab rates conditional on forgoing specified deductions and exemptions.",
      },
      {
        heading: "Sections 234A to 234C — Interest",
        text: "Charge interest for late filing, default in payment of advance tax, and deferment of advance tax instalments.",
      },
      {
        heading: "Section 271 series — Penalties",
        text: "Prescribe penalties for under-reporting, misreporting, failure to audit, and failure to furnish statements.",
      },
    ],
    penalties:
      "Interest at 1% to 1.5% per month depending on the default, penalties ranging from fixed sums to a multiple of tax sought to be evaded.",
    source: "https://www.incometaxindia.gov.in",
  },
  {
    slug: "cgst-act-2017",
    title: "Central Goods and Services Tax Act, 2017",
    shortName: "GST Act",
    summary:
      "Indirect tax law for the supply of goods and services, operating alongside the state and integrated GST statutes.",
    status: "Amended",
    authority: "Central Board of Indirect Taxes and Customs",
    lastUpdated: "18 July 2026",
    appliesTo: "Every person registered or liable to be registered under GST",
    keySections: [
      {
        heading: "Section 16 — Eligibility for input tax credit",
        text: "Conditions credit on possession of the invoice, receipt of the supply, payment of tax by the supplier, and filing of the return.",
      },
      {
        heading: "Section 17(5) — Blocked credits",
        text: "Denies credit on specified items including motor vehicles, works contract for immovable property, and goods lost or written off.",
      },
      {
        heading: "Rule 37 — Reversal for non-payment",
        text: "Requires reversal of credit where the supplier is not paid within 180 days, with reclaim permitted on subsequent payment.",
      },
      {
        heading: "Section 73 and 74 — Demands",
        text: "Distinguish demands raised without fraud from those involving fraud or wilful misstatement, with different limitation periods and penalties.",
      },
      {
        heading: "Section 122 — Penalties",
        text: "Prescribes penalties for a list of specified offences, including issuing invoices without supply.",
      },
    ],
    penalties:
      "Interest at 18% per annum on delayed payment, penalties of 10% of tax or ₹10,000 whichever is higher in ordinary cases.",
    source: "https://www.cbic.gov.in",
  },
  {
    slug: "msmed-act-2006",
    title: "Micro, Small and Medium Enterprises Development Act, 2006",
    shortName: "MSMED Act",
    summary:
      "Provides classification, delayed payment protection, and facilitation mechanisms for micro, small, and medium enterprises.",
    status: "In force",
    authority: "Ministry of MSME",
    lastUpdated: "9 February 2026",
    appliesTo: "Enterprises registered on Udyam and the buyers who transact with them",
    keySections: [
      {
        heading: "Section 7 — Classification",
        text: "Classifies enterprises using composite criteria of investment in plant and machinery and annual turnover.",
      },
      {
        heading: "Section 15 — Liability of the buyer",
        text: "Requires payment within the agreed period, not exceeding 45 days, or within 15 days where there is no written agreement.",
      },
      {
        heading: "Section 16 — Interest on delayed payment",
        text: "Charges compound interest at three times the bank rate notified by the Reserve Bank on delayed amounts.",
      },
      {
        heading: "Section 22 — Disclosure requirement",
        text: "Requires buyers to disclose unpaid amounts and interest due in their annual financial statements.",
      },
    ],
    penalties:
      "Compound interest payable to the supplier, disallowance of the interest as a deduction, and reference to the facilitation council.",
    source: "https://msme.gov.in",
  },
  {
    slug: "fema-1999",
    title: "Foreign Exchange Management Act, 1999",
    shortName: "FEMA",
    summary:
      "Regulates cross-border transactions, foreign investment into India, and overseas investment by residents.",
    status: "Amended",
    authority: "Reserve Bank of India",
    lastUpdated: "1 July 2026",
    appliesTo: "Residents transacting with non-residents, and Indian entities receiving foreign investment",
    keySections: [
      {
        heading: "Non-Debt Instruments Rules",
        text: "Set out sectoral caps, entry routes, and pricing guidelines for foreign investment in Indian companies and LLPs.",
      },
      {
        heading: "Single Master Form reporting",
        text: "Consolidates FC-GPR, FC-TRS, LLP-I, and other filings into one reporting interface on the FIRMS portal.",
      },
      {
        heading: "Annual return on foreign liabilities and assets",
        text: "Required from every entity that has received foreign investment in any prior year, irrespective of current-year activity.",
      },
      {
        heading: "Late Submission Fee",
        text: "Provides a compounding-free mechanism to regularise delayed filings, computed on the amount involved and the delay.",
      },
    ],
    penalties:
      "Late submission fees for reporting delays; compounding or adjudication for contraventions, with penalties linked to the amount involved.",
    source: "https://www.rbi.org.in",
  },
  {
    slug: "epf-mp-act-1952",
    title: "Employees' Provident Funds and Miscellaneous Provisions Act, 1952",
    shortName: "EPF Act",
    summary:
      "Governs provident fund, pension, and insurance contributions for covered establishments and their employees.",
    status: "In force",
    authority: "EPFO",
    lastUpdated: "20 May 2026",
    appliesTo: "Establishments employing twenty or more persons, and voluntary coverage below that",
    keySections: [
      {
        heading: "Definition of basic wages",
        text: "Contributions are computed on basic wages and dearness allowance; allowances universally paid have been held includible.",
      },
      {
        heading: "Section 7Q and 14B — Interest and damages",
        text: "Charge interest and damages on delayed remittance of contributions.",
      },
      {
        heading: "Employee contribution and tax deduction",
        text: "Employee contribution deposited after the statutory due date is not deductible to the employer under the Income-tax Act.",
      },
    ],
    penalties:
      "Interest at 12% per annum plus damages up to 100% of arrears depending on the period of delay, and prosecution in serious cases.",
    source: "https://www.epfindia.gov.in",
  },
  {
    slug: "dpdp-act-2023",
    title: "Digital Personal Data Protection Act, 2023",
    shortName: "DPDP Act",
    summary:
      "Establishes obligations for organisations processing digital personal data, including consent, purpose limitation, and breach reporting.",
    status: "In force",
    authority: "MeitY",
    lastUpdated: "11 March 2026",
    appliesTo: "Data fiduciaries processing digital personal data of individuals in India",
    keySections: [
      {
        heading: "Consent and notice",
        text: "Requires clear notice of the purpose and an itemised consent that can be withdrawn as easily as it was given.",
      },
      {
        heading: "Obligations of data fiduciaries",
        text: "Include accuracy, security safeguards, breach notification, and erasure once the purpose is served.",
      },
      {
        heading: "Significant data fiduciaries",
        text: "Face additional obligations including a data protection officer, independent audit, and impact assessment.",
      },
    ],
    penalties:
      "Financial penalties determined by the Board, with the highest slabs applying to failure to prevent a personal data breach.",
    source: "https://www.meity.gov.in",
  },
  {
    slug: "ibc-2016",
    title: "Insolvency and Bankruptcy Code, 2016",
    shortName: "IBC",
    summary:
      "Consolidates insolvency resolution for companies, partnerships, and individuals under a time-bound process.",
    status: "Amended",
    authority: "IBBI",
    lastUpdated: "30 January 2026",
    appliesTo: "Corporate debtors, financial and operational creditors, and resolution professionals",
    keySections: [
      {
        heading: "Section 7 and 9 — Initiation",
        text: "Allow financial and operational creditors respectively to initiate corporate insolvency resolution on default above the threshold.",
      },
      {
        heading: "Section 14 — Moratorium",
        text: "Suspends suits, enforcement, and recovery against the corporate debtor during the resolution process.",
      },
      {
        heading: "Section 29A — Ineligibility",
        text: "Disqualifies specified persons, including defaulting promoters, from submitting a resolution plan.",
      },
      {
        heading: "Section 53 — Waterfall",
        text: "Sets the order of priority for distribution of liquidation proceeds.",
      },
    ],
    penalties:
      "Consequences are procedural rather than penal — loss of control of the enterprise, and personal liability in cases of fraudulent trading.",
    source: "https://www.ibbi.gov.in",
  },
  {
    slug: "labour-codes",
    title: "The four Labour Codes",
    shortName: "Labour Codes",
    summary:
      "Consolidated reform of wages, industrial relations, social security, and occupational safety legislation.",
    status: "Draft",
    authority: "Ministry of Labour and Employment",
    lastUpdated: "20 May 2026",
    appliesTo: "Establishments across sectors, with thresholds varying by code and state rules",
    keySections: [
      {
        heading: "Code on Wages",
        text: "Introduces a uniform definition of wages that caps excluded allowances at 50% of total remuneration.",
      },
      {
        heading: "Industrial Relations Code",
        text: "Consolidates provisions on standing orders, trade unions, and conditions for retrenchment and closure.",
      },
      {
        heading: "Social Security Code",
        text: "Extends coverage to gig and platform workers and consolidates provident fund, ESI, and gratuity provisions.",
      },
      {
        heading: "Occupational Safety Code",
        text: "Consolidates registration, licensing, and welfare obligations across establishment types.",
      },
    ],
    penalties:
      "Graded penalties with compounding permitted for first offences; state rules determine commencement in practice.",
    source: "https://labour.gov.in",
  },
  {
    slug: "it-act-2000",
    title: "Information Technology Act, 2000",
    shortName: "IT Act",
    summary:
      "Legal framework for electronic records, digital signatures, cyber offences, and intermediary obligations.",
    status: "Amended",
    authority: "MeitY",
    lastUpdated: "30 January 2026",
    appliesTo: "Anyone dealing in electronic records, and intermediaries operating in India",
    keySections: [
      {
        heading: "Section 65B evidence",
        text: "Read with the Evidence Act, governs admissibility of electronic records and the certificate that must accompany them.",
      },
      {
        heading: "Section 79 — Intermediary safe harbour",
        text: "Conditions protection from liability on due diligence and compliance with the intermediary guidelines.",
      },
      {
        heading: "Section 43A — Reasonable security practices",
        text: "Creates liability for negligence in maintaining reasonable security practices for sensitive personal data.",
      },
    ],
    penalties:
      "Compensation to affected persons, monetary penalties, and criminal liability for specified offences.",
    source: "https://www.meity.gov.in",
  },
  {
    slug: "llp-act-2008",
    title: "Limited Liability Partnership Act, 2008",
    shortName: "LLP Act",
    summary:
      "Provides for the incorporation and regulation of limited liability partnerships as a distinct legal form.",
    status: "Amended",
    authority: "Ministry of Corporate Affairs",
    lastUpdated: "5 April 2026",
    appliesTo: "Limited liability partnerships and their designated partners",
    keySections: [
      {
        heading: "Designated partners",
        text: "Requires at least two designated partners, one of whom must be resident in India, each holding a DPIN.",
      },
      {
        heading: "Annual filings",
        text: "Form 11 for the annual return and Form 8 for the statement of account and solvency, on separate due dates.",
      },
      {
        heading: "Audit threshold",
        text: "Audit is required where turnover or contribution exceeds the prescribed limits.",
      },
    ],
    penalties:
      "Additional fee per day of delay on annual filings, and penalties on the LLP and designated partners for continuing default.",
    source: "https://www.mca.gov.in",
  },
  {
    slug: "benami-act",
    title: "Prohibition of Benami Property Transactions Act, 1988",
    shortName: "Benami Act",
    summary:
      "Prohibits benami transactions and provides for confiscation of property held benami.",
    status: "Amended",
    authority: "Central Board of Direct Taxes",
    lastUpdated: "28 February 2026",
    appliesTo: "Any person entering into or holding property under a benami arrangement",
    keySections: [
      {
        heading: "Definition of benami transaction",
        text: "Covers property held by one person while the consideration is provided by another, with limited stated exceptions.",
      },
      {
        heading: "Attachment and confiscation",
        text: "Empowers provisional attachment followed by adjudication and confiscation without compensation.",
      },
      {
        heading: "Exceptions",
        text: "Includes property held by a karta or in a fiduciary capacity, and in the name of a spouse or child from known sources.",
      },
    ],
    penalties:
      "Rigorous imprisonment and fine linked to the fair market value of the property, in addition to confiscation.",
    source: "https://www.incometaxindia.gov.in",
  },
];

export function findAct(slug: string) {
  return ACTS.find((act) => act.slug === slug);
}
