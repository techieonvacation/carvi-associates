import type { Update } from "./types";

export const UPDATES: Update[] = [
  {
    id: "upd-ais-window",
    date: "2026-07-22",
    dateLabel: "22 Jul 2026",
    authority: "Income Tax",
    reference: "CBDT press release",
    title: "AIS feedback window extended for the current assessment year",
    summary:
      "Taxpayers get additional time to respond to Annual Information Statement mismatches before assessment proceedings are initiated.",
    impact: "Action required",
    detail: [
      "The Annual Information Statement aggregates reported transactions from banks, registrars, depositories, and deductors. Where the statement disagrees with the return, the department raises the discrepancy before assessment.",
      "The extension applies to the feedback facility on the compliance portal. Feedback submitted within the window is considered before any notice is issued, which materially reduces the volume of subsequent correspondence.",
    ],
    actions: [
      "Download the AIS and TIS for every entity and compare against the books.",
      "Submit feedback for each disputed line with the supporting document reference.",
      "Where the mismatch is genuine, revise the return rather than only submitting feedback.",
    ],
    source: "https://www.incometax.gov.in",
  },
  {
    id: "upd-einvoice-threshold",
    date: "2026-07-18",
    dateLabel: "18 Jul 2026",
    authority: "GST",
    reference: "CBIC clarification",
    title: "E-invoice aggregate turnover clarified for multi-GSTIN entities",
    summary:
      "Aggregate turnover for the e-invoicing threshold is computed on PAN, not GSTIN — branches cannot be assessed separately.",
    impact: "Action required",
    detail: [
      "Entities registered in several states frequently compute turnover state-wise and conclude they are below the threshold. Aggregate turnover under Section 2(6) is computed on an all-India PAN basis and includes exempt supplies and exports.",
      "Where the PAN-level figure crosses the notified threshold in any preceding financial year, e-invoicing applies to every registration under that PAN.",
    ],
    actions: [
      "Recompute aggregate turnover on a PAN basis including exempt and zero-rated supplies.",
      "Enable IRN generation across all GSTINs where the threshold is crossed.",
      "Reconcile IRN-wise outward supply to GSTR-1 monthly.",
    ],
    source: "https://www.cbic.gov.in",
  },
  {
    id: "upd-sbo-register",
    date: "2026-07-14",
    dateLabel: "14 Jul 2026",
    authority: "MCA",
    reference: "General circular",
    title: "Significant beneficial ownership registers to be refreshed with verification trails",
    summary:
      "Companies must evidence the enquiry made into indirect holdings, not merely record the declarations received.",
    impact: "Plan ahead",
    detail: [
      "The register of significant beneficial owners must reflect the company's own enquiry under the beneficial interest rules. A register populated only from declarations received is treated as incomplete where the shareholding structure includes bodies corporate or trusts.",
      "The verification trail should show how the ultimate natural person was identified through each layer of the ownership chain.",
    ],
    actions: [
      "Map the ownership chain for every corporate shareholder to the ultimate individual.",
      "Issue notices in the prescribed form where the chain is unclear and retain the responses.",
      "Update the register and file the return where a change is identified.",
    ],
  },
  {
    id: "upd-sebi-rpt",
    date: "2026-07-09",
    dateLabel: "09 Jul 2026",
    authority: "SEBI",
    reference: "Circular",
    title: "Revised annexure format for quarterly related-party transaction reporting",
    summary:
      "Listed entities receive an expanded disclosure template covering purpose, terms, and the audit committee approval reference.",
    impact: "Plan ahead",
    detail: [
      "The revised format requires each transaction to carry the approval reference, the value approved against the value transacted, and a statement of the commercial rationale.",
      "Group companies transacting through a common treasury will need to disclose the underlying flows rather than net positions.",
    ],
    actions: [
      "Update the RPT tracker to capture approval references at transaction level.",
      "Align the audit committee agenda template with the new annexure fields.",
    ],
  },
  {
    id: "upd-dpiit-workflow",
    date: "2026-07-05",
    dateLabel: "05 Jul 2026",
    authority: "Startup India",
    reference: "Portal notice",
    title: "DPIIT recognition workflow refreshed with a revised document checklist",
    summary:
      "The recognition application now expects an explicit innovation note and evidence of scalability alongside the incorporation documents.",
    impact: "For information",
    detail: [
      "Applications are being returned where the innovation description restates the business activity without identifying the problem addressed or the improvement over existing solutions.",
      "Turnaround guidance has been published, with clarification requests issued rather than outright rejections in most cases.",
    ],
    actions: [
      "Rewrite the innovation note to state the problem, the approach, and the differentiator in under 300 words.",
      "Attach traction evidence — pilots, letters of intent, or product artefacts.",
    ],
    source: "https://www.startupindia.gov.in",
  },
  {
    id: "upd-fdi-reporting",
    date: "2026-07-01",
    dateLabel: "01 Jul 2026",
    authority: "RBI / FEMA",
    reference: "Reminder",
    title: "Quarterly reminder on FC-GPR and FLA reporting for entities with foreign investment",
    summary:
      "Late submission fees continue to apply on delayed FC-GPR, FC-TRS, and annual FLA filings.",
    impact: "Action required",
    detail: [
      "Inbound investment must be allotted against within 60 days of receipt and reported in FC-GPR within 30 days of allotment. Transfers between residents and non-residents are reported in FC-TRS.",
      "The annual return on foreign liabilities and assets is due from every entity that received foreign investment in any prior year, whether or not there was activity in the current year.",
    ],
    actions: [
      "Reconcile inward remittance advices to allotments and filings for the last eight quarters.",
      "Compute and pay late submission fees where filings were delayed, before an enquiry is raised.",
    ],
  },
  {
    id: "upd-ai-governance",
    date: "2026-06-28",
    dateLabel: "28 Jun 2026",
    authority: "MeitY",
    reference: "Consultation paper",
    title: "Draft documentation expectations for AI-assisted financial tools",
    summary:
      "A consultative paper proposes model documentation, human oversight records, and disclosure where automated outputs inform financial advice.",
    impact: "For information",
    detail: [
      "The paper is consultative and imposes no immediate obligation. It signals the direction: documented model purpose, data lineage, evaluation, and a named accountable owner.",
      "Firms using automated extraction or classification in the close process should begin retaining the evaluation evidence they will later be asked for.",
    ],
    actions: [
      "Inventory automated tools used in financial reporting and note the human review step for each.",
      "Retain accuracy testing results rather than discarding them after go-live.",
    ],
  },
  {
    id: "upd-audit-trail-report",
    date: "2026-06-20",
    dateLabel: "20 Jun 2026",
    authority: "MCA",
    reference: "Reporting requirement",
    title: "Auditors to report on audit trail operation for the full financial year",
    summary:
      "The reporting requirement covers whether the feature operated throughout the year, including across any software migration.",
    impact: "Action required",
    detail: [
      "Enabling the edit log part-way through the year is a reportable exception. Where accounting software was changed mid-year, evidence is required for both systems and for the migration itself.",
      "Retention of the log for the prescribed period is a separate requirement from enabling it.",
    ],
    actions: [
      "Obtain a written confirmation from the software vendor that the feature cannot be disabled.",
      "Archive logs from any legacy system before decommissioning it.",
    ],
  },
  {
    id: "upd-tds-rates",
    date: "2026-06-12",
    dateLabel: "12 Jun 2026",
    authority: "Income Tax",
    reference: "Notification",
    title: "Consolidated TDS rate chart reissued with revised thresholds",
    summary:
      "Threshold limits for several sections have been revised; deductors should refresh their master data before the next quarterly return.",
    impact: "Action required",
    detail: [
      "Rate masters embedded in ERP systems are a frequent source of short deduction, which attracts interest and disallowance under Section 40(a)(ia).",
      "Where thresholds have moved, review whether earlier deductions in the year need adjustment in the next challan.",
    ],
    actions: [
      "Update TDS rate and threshold masters in the ERP.",
      "Re-run the quarter to date and identify short or excess deduction before filing.",
    ],
  },
  {
    id: "upd-gst-amnesty",
    date: "2026-06-04",
    dateLabel: "04 Jun 2026",
    authority: "GST",
    reference: "Notification",
    title: "Conditional waiver of interest and penalty for specified earlier periods",
    summary:
      "A conditional waiver scheme is open for specified demand orders where the tax is paid within the notified window.",
    impact: "Plan ahead",
    detail: [
      "The waiver applies to interest and penalty where the tax component is discharged in full within the notified date, and is conditional on withdrawal of any appeal on the same issue.",
      "Cases involving fraud, wilful misstatement, or suppression are outside the scheme.",
    ],
    actions: [
      "List open demand orders and classify them as eligible or excluded.",
      "Model the cost of paying the tax against the cost of continuing the appeal.",
    ],
  },
];

export const UPDATE_AUTHORITIES = Array.from(
  new Set(UPDATES.map((update) => update.authority)),
).sort();
