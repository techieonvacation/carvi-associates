import type {
  BlogContentType,
  BlogFaq,
  BlogSectionContent,
  BlogSource,
} from "@/lib/cms/blog-types";

export const defaultBlogSection: BlogSectionContent = {
  tagline: "Our Latest Blog",
  title: ["Today's Blog Industry Finance", "Business Consulting."],
  taglineBg: "#ecf5f4",
  homeLimit: 3,
  homeCtaText: "View All Blogs",
  homeCtaHref: "/blog",
  showHomeCta: true,
  isVisible: true,
  archiveTagline: "Knowledge Desk",
  archiveTitle: ["Insights On Tax, GST &", "Business Compliance."],
  archiveIntro:
    "Practical, plain-English notes on income tax, GST, company law and audit — written by the Carvi Associates team for founders, finance heads and growing businesses.",
  archiveHeroImage: "/images/blog/blog-1-1.jpg",
  archiveHeroOverlay: 82,
  archiveHeroHeight: "standard",
  archiveHeroAlign: "center",
  archiveShowCrumbs: true,
  postsPerPage: 9,
  showSidebar: true,
  showSearch: true,
  showCategories: true,
  showTags: true,
  allowComments: true,
  moderateComments: true,
  disclaimer:
    "This article is for general information only and is not professional advice. Tax and regulatory positions change frequently — please consult Carvi Associates before acting on anything you read here.",
  seoTitle: "Blog & Insights | Carvi Associates — Chartered Accountants",
  seoDescription:
    "Income tax, GST, company law, audit and compliance insights from the Carvi Associates team. Practical guidance for Indian businesses, founders and finance teams.",
  seoKeywords:
    "chartered accountant blog, income tax India, GST updates, ROC compliance, tax audit, TDS, startup compliance",
  canonicalUrl: null,
  ogImageUrl: null,
  twitterImageUrl: null,
  noIndex: false,
};


export type SeedCategory = {
  name: string;
  slug: string;
  description: string;
  icon: string;
  accentColor: string;
  displayOrder: number;
  isFeatured: boolean;
  seoDescription: string;
};

export const defaultBlogCategories: SeedCategory[] = [
  {
    name: "Income Tax",
    slug: "income-tax",
    description:
      "Return filing, assessments, deductions, capital gains and the old-vs-new regime maths for individuals and businesses.",
    icon: "icon-salary",
    accentColor: "#006654",
    displayOrder: 0,
    isFeatured: true,
    seoDescription:
      "Income tax articles from Carvi Associates — ITR filing, deductions, capital gains, assessments and regime planning for Indian taxpayers.",
  },
  {
    name: "GST",
    slug: "gst",
    description:
      "Registration, returns, input tax credit, e-invoicing and departmental notices under the Goods and Services Tax.",
    icon: "icon-bank",
    accentColor: "#636363",
    displayOrder: 1,
    isFeatured: true,
    seoDescription:
      "GST guidance from Carvi Associates — registration thresholds, GSTR filing, input tax credit rules, e-invoicing and notice handling.",
  },
  {
    name: "Company Law & ROC",
    slug: "company-law-roc",
    description:
      "Incorporation, board processes, annual filings and director compliances under the Companies Act, 2013.",
    icon: "icon-agreement",
    accentColor: "#8a6f3f",
    displayOrder: 2,
    isFeatured: true,
    seoDescription:
      "Companies Act and ROC compliance explained — incorporation, AOC-4, MGT-7, DIR-3 KYC and director duties.",
  },
  {
    name: "Audit & Assurance",
    slug: "audit-assurance",
    description:
      "Statutory audit, tax audit, internal controls and what auditors actually look for in your books.",
    icon: "icon-analysis",
    accentColor: "#4f6350",
    displayOrder: 3,
    isFeatured: false,
    seoDescription:
      "Audit and assurance insights — statutory audit readiness, tax audit under section 44AB, internal financial controls and documentation.",
  },
  {
    name: "TDS & TCS",
    slug: "tds-tcs",
    description:
      "Withholding rates, quarterly returns, Form 16/16A, lower deduction certificates and common default notices.",
    icon: "icon-financial-presentation",
    accentColor: "#7a5c46",
    displayOrder: 4,
    isFeatured: false,
    seoDescription:
      "TDS and TCS compliance — rates, due dates, quarterly returns, Form 16 issuance and how to clear default notices.",
  },
  {
    name: "Startup & Business Setup",
    slug: "startup-business-setup",
    description:
      "Choosing a structure, registrations, funding readiness and the compliance calendar for a young company.",
    icon: "icon-planning",
    accentColor: "#5f6f7a",
    displayOrder: 5,
    isFeatured: true,
    seoDescription:
      "Startup compliance guidance — entity structure, registrations, Startup India recognition, ESOPs and funding-round readiness.",
  },
  {
    name: "Compliance Calendar",
    slug: "compliance-calendar",
    description:
      "Month-by-month statutory due dates across income tax, GST, TDS, PF/ESI and ROC filings.",
    icon: "icon-calendar",
    accentColor: "#8a5f5f",
    displayOrder: 6,
    isFeatured: false,
    seoDescription:
      "Statutory due date calendar for Indian businesses — income tax, GST, TDS, PF, ESI and ROC deadlines in one place.",
  },
  {
    name: "Personal Finance",
    slug: "personal-finance",
    description:
      "Salary structuring, investments, house property, retirement corpus planning and family tax efficiency.",
    icon: "icon-financial-consultant",
    accentColor: "#6d5a7a",
    displayOrder: 7,
    isFeatured: false,
    seoDescription:
      "Personal finance and tax planning — salary structuring, investment choices, capital gains and retirement planning for Indian families.",
  },
];

export const defaultBlogTags: Array<{ name: string; slug: string; description: string }> = [
  { name: "ITR Filing", slug: "itr-filing", description: "Income tax return preparation and filing." },
  { name: "New Tax Regime", slug: "new-tax-regime", description: "Section 115BAC and regime comparison." },
  { name: "Capital Gains", slug: "capital-gains", description: "Sale of shares, property and mutual funds." },
  { name: "Section 80C", slug: "section-80c", description: "Deductions under Chapter VI-A." },
  { name: "Advance Tax", slug: "advance-tax", description: "Quarterly advance tax instalments." },
  { name: "GST Registration", slug: "gst-registration", description: "Thresholds and application process." },
  { name: "Input Tax Credit", slug: "input-tax-credit", description: "ITC eligibility, reversal and matching." },
  { name: "GSTR-3B", slug: "gstr-3b", description: "Monthly summary return compliance." },
  { name: "E-Invoicing", slug: "e-invoicing", description: "IRN generation and turnover thresholds." },
  { name: "TDS Return", slug: "tds-return", description: "Form 24Q, 26Q and quarterly statements." },
  { name: "Form 16", slug: "form-16", description: "Salary TDS certificates." },
  { name: "Tax Audit", slug: "tax-audit", description: "Section 44AB audit and Form 3CD." },
  { name: "Presumptive Taxation", slug: "presumptive-taxation", description: "Sections 44AD, 44ADA and 44AE." },
  { name: "MSME & Udyam", slug: "msme-udyam", description: "Udyam registration and payment timelines." },
  { name: "ROC Annual Filing", slug: "roc-annual-filing", description: "AOC-4, MGT-7 and MGT-7A." },
  { name: "DIR-3 KYC", slug: "dir-3-kyc", description: "Annual director KYC requirement." },
  { name: "Startup India", slug: "startup-india", description: "DPIIT recognition and 80-IAC benefits." },
  { name: "Cash Flow", slug: "cash-flow", description: "Working capital and runway management." },
  { name: "Internal Controls", slug: "internal-controls", description: "Process controls and segregation of duties." },
  { name: "Due Dates", slug: "due-dates", description: "Statutory deadlines and penalties." },
];

export type SeedAuthor = {
  name: string;
  slug: string;
  role: string;
  credentials: string;
  bio: string;
  avatarUrl: string;
  linkedinUrl: string;
  displayOrder: number;
};

export const defaultBlogAuthors: SeedAuthor[] = [
  {
    name: "CA Ravi Varma",
    slug: "ca-ravi-varma",
    role: "Managing Partner — Direct Tax",
    credentials: "FCA, DISA (ICAI)",
    bio: "Ravi leads the direct tax and litigation practice at Carvi Associates. He has represented closely held companies and promoter families before assessing officers and appellate authorities for over sixteen years, with a focus on capital gains, reassessment and search matters.",
    avatarUrl: "/images/blog/blog-admin-1-1.png",
    linkedinUrl: "https://www.linkedin.com/company/carvi-associates",
    displayOrder: 0,
  },
  {
    name: "CA Sneha Iyer",
    slug: "ca-sneha-iyer",
    role: "Partner — Indirect Tax & GST",
    credentials: "ACA, B.Com (Hons)",
    bio: "Sneha heads the GST practice and advises manufacturers, e-commerce sellers and service exporters on input tax credit, classification and departmental audits. She writes the firm's monthly indirect tax digest.",
    avatarUrl: "/images/blog/blog-admin-1-2.png",
    linkedinUrl: "https://www.linkedin.com/company/carvi-associates",
    displayOrder: 1,
  },
  {
    name: "CS Arjun Mehta",
    slug: "cs-arjun-mehta",
    role: "Head — Corporate Secretarial",
    credentials: "ACS, LL.B",
    bio: "Arjun runs the corporate secretarial desk, taking companies from incorporation through funding rounds and annual ROC compliance. He is the firm's go-to for board processes, charge management and director compliances.",
    avatarUrl: "/images/blog/blog-admin-1-3.png",
    linkedinUrl: "https://www.linkedin.com/company/carvi-associates",
    displayOrder: 2,
  },
  {
    name: "CA Priya Nandan",
    slug: "ca-priya-nandan",
    role: "Partner — Audit & Assurance",
    credentials: "FCA, CPA (Australia)",
    bio: "Priya leads statutory and internal audit engagements for mid-market clients across manufacturing and SaaS. She specialises in internal financial controls, revenue recognition and audit readiness for first-time institutional investors.",
    avatarUrl: "/images/blog/blog-admin-1-4.png",
    linkedinUrl: "https://www.linkedin.com/company/carvi-associates",
    displayOrder: 3,
  },
];

export type SeedPost = {
  title: string;
  slug: string;
  subtitle: string;
  excerpt: string;
  contentHtml: string;
  coverImageUrl: string;
  coverImageAlt: string;
  contentType: BlogContentType;
  categorySlug: string;
  authorSlug: string;
  tagSlugs: string[];
  keyTakeaways: string[];
  faqs: BlogFaq[];
  sources: BlogSource[];
  isFeatured: boolean;
  isPinned: boolean;
  publishedDaysAgo: number;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
};

export const defaultBlogPosts: SeedPost[] = [
  {
    title: "Why Business Startups Need Strong Cash Flow",
    slug: "why-business-startups-need-strong-cash-flow",
    subtitle: "Profit is an opinion. Cash is a fact.",
    excerpt: "Most startups that shut down were profitable on paper at some point. Here is how to build a cash flow discipline that survives delayed receivables, GST blockages and a funding winter.",
    contentHtml: "<p>Every founder we meet can quote their revenue. Far fewer can tell us, without opening a spreadsheet, how many weeks of cash they have left. That gap is where most avoidable business failures begin — not in the profit and loss account, but in the bank statement.</p><h2>Profit is an accounting view. Cash is a survival view.</h2><p>Accrual accounting recognises revenue when you raise the invoice, not when the money lands. A business can book <strong>₹2 crore of revenue</strong> in a quarter, report a healthy margin, and still be unable to pay salaries — because ₹1.4 crore of that is sitting in receivables at 90+ days.</p><blockquote><p><strong>The classic trap</strong><br>Growth consumes cash. Every new order needs inventory, people and working capital <em>before</em> the customer pays. Scaling a business with a 90-day collection cycle and a 30-day payment cycle is a structural cash drain, however good the margin looks.</p></blockquote><h2>Build a rolling 13-week cash forecast</h2><p>A monthly P&amp;L tells you what already happened. A 13-week cash forecast tells you what is about to happen, while you can still do something about it. Rebuild it every Monday with three inputs:</p><ol><li><p>Opening bank balance across all accounts, including any sweep or FD you would actually break.</p></li><li><p>Committed inflows — invoices raised, with a realistic collection date rather than the credit-period date.</p></li><li><p>Committed outflows — payroll, statutory dues, rent, vendor payments, EMI and advance tax instalments.</p></li></ol><blockquote><p><strong>Make it honest</strong><br>Use the date the customer actually pays, based on their last four payments — not the date printed on your invoice. A forecast built on credit terms rather than behaviour is a wish list.</p></blockquote><h2>The three cash drains we see most often</h2><h3>1. Receivables that quietly age</h3><p>Pull an ageing report every fortnight and split it at 30 / 60 / 90 / 90+ days. Anything past 90 days needs a named owner and a dated action, not a reminder email. Consider linking a small part of the sales incentive to collection rather than to order booking.</p><h3>2. Input tax credit that never gets claimed</h3><p>GST input tax credit is only available when your supplier has actually reported the invoice and you have paid them within 180 days. Every unreconciled GSTR-2B line is working capital parked with the government. Reconcile monthly, not at year end.</p><table><tbody><tr><th><p>Leak</p></th><th><p>Typical size</p></th><th><p>Fix</p></th></tr><tr><td><p>Receivables &gt; 90 days</p></td><td><p>8–15% of annual revenue</p></td><td><p>Fortnightly ageing review with named owners</p></td></tr><tr><td><p>Unreconciled ITC</p></td><td><p>1–3% of purchases</p></td><td><p>Monthly GSTR-2B vs purchase register matching</p></td></tr><tr><td><p>Excess inventory</p></td><td><p>20–40 days of cash</p></td><td><p>Reorder levels based on actual lead times</p></td></tr><tr><td><p>Advance tax mismatch</p></td><td><p>Interest u/s 234B/234C</p></td><td><p>Quarterly profit estimate before each instalment</p></td></tr></tbody></table><p><em>Where SME cash usually hides</em></p><h3>3. Paying MSME vendors late — now a tax cost</h3><p>Section 43B(h) of the Income-tax Act disallows a deduction for amounts payable to micro and small enterprises if they are not paid within the timeline agreed (capped at 45 days) — and the deduction only comes back in the year of actual payment. Delaying an MSME vendor across 31 March now inflates your taxable profit.</p><blockquote><p><strong>Check your vendor master</strong><br>Collect the Udyam registration number from every vendor and flag micro and small enterprises in your accounting system. You cannot apply section 43B(h) correctly if you do not know which vendors it covers.</p></blockquote><h2>A simple monthly rhythm</h2><ul><li><p>Week 1 — close the previous month, reconcile bank, GSTR-2B and receivables.</p></li><li><p>Week 2 — collections review; escalate anything past 60 days.</p></li><li><p>Week 3 — vendor payment run, prioritising MSME dues and statutory liabilities.</p></li><li><p>Week 4 — refresh the 13-week forecast and stress-test it against a 20% revenue drop.</p></li></ul><blockquote><p>Revenue is vanity, profit is sanity, cash is reality. — An old finance adage that has never stopped being true</p></blockquote><blockquote><p><strong>Want a cash flow review of your business?</strong><br>Our team builds a 13-week forecast from your books and flags the leaks in the first sitting.<br><a href=\"/#contact\">Talk to an expert</a></p></blockquote>",
    coverImageUrl: "/images/blog/blog-1-1.jpg",
    coverImageAlt: "Founder reviewing a cash flow statement with an advisor",
    contentType: "BLOG",
    categorySlug: "startup-business-setup",
    authorSlug: "ca-ravi-varma",
    tagSlugs: [
      "cash-flow",
      "msme-udyam",
      "startup-india",
    ],
    keyTakeaways: [
      "Profit and cash are different numbers — a growing business can be profitable and still run out of money.",
      "Track a rolling 13-week cash forecast, not just the monthly P&L.",
      "Blocked GST input tax credit and delayed receivables are the two largest silent cash drains for Indian SMEs.",
      "Section 43B(h) makes on-time payment to MSME vendors a tax issue, not just a relationship issue.",
    ],
    faqs: [
      {
        question: "How much cash runway should a startup keep?",
        answer: "As a working rule, keep at least six months of fixed operating cost in accessible cash, and twelve months if you are pre-revenue or dependent on a single large customer. Runway should be measured against committed outflows, not average burn.",
      },
      {
        question: "Is a cash flow statement mandatory for private limited companies?",
        answer: "A cash flow statement forms part of the financial statements under the Companies Act, 2013, but One Person Companies, small companies and dormant companies are exempt from preparing it. Even where exempt, most lenders and investors will ask for one.",
      },
      {
        question: "What is the 45-day MSME payment rule?",
        answer: "Under the MSMED Act read with section 43B(h) of the Income-tax Act, payments to registered micro and small enterprises must be made within the agreed period, and in any case within 45 days. Amounts unpaid at year end are disallowed as a deduction until actually paid.",
      },
    ],
    sources: [
      {
        label: "Income-tax Act, 1961 — Section 43B",
        url: "https://incometaxindia.gov.in",
      },
      {
        label: "Udyam Registration portal",
        url: "https://udyamregistration.gov.in",
      },
    ],
    isFeatured: true,
    isPinned: false,
    publishedDaysAgo: 4,
    seoTitle: "Why Startups Need Strong Cash Flow | Carvi Associates",
    seoDescription: "A practical cash flow playbook for Indian startups and SMEs — 13-week forecasting, receivables ageing, GST input tax credit leaks and the section 43B(h) MSME payment rule.",
    seoKeywords: "startup cash flow India, 13 week cash forecast, MSME 45 day payment rule, section 43B(h), working capital management",
  },
  {
    title: "Old vs New Tax Regime: How To Actually Decide",
    slug: "old-vs-new-tax-regime-how-to-decide",
    subtitle: "A break-even approach instead of a rule of thumb",
    excerpt: "The new regime is now the default. Whether it is right for you depends on one number — your total eligible deductions — and this article shows you how to find your personal break-even point.",
    contentHtml: "<p>Every year around January, the same question arrives from clients and colleagues: <em>which regime should I pick?</em> The honest answer is that there is no universally better regime — there is only a break-even point, and which side of it you fall on.</p><blockquote><p><strong>The default has changed</strong><br>The new regime under section 115BAC is now the default. If you take no action, your employer deducts TDS and your return is prepared under the new regime. The old regime is available, but you have to ask for it.</p></blockquote><h2>What each regime actually gives you</h2><table><tbody><tr><th><p>Feature</p></th><th><p>Old regime</p></th><th><p>New regime</p></th></tr><tr><td><p>Slab rates</p></td><td><p>Higher</p></td><td><p>Lower and more graduated</p></td></tr><tr><td><p>Standard deduction (salary)</p></td><td><p>Available</p></td><td><p>Available</p></td></tr><tr><td><p>Section 80C / 80D / 80CCD(1B)</p></td><td><p>Available</p></td><td><p>Not available</p></td></tr><tr><td><p>HRA and LTA exemption</p></td><td><p>Available</p></td><td><p>Not available</p></td></tr><tr><td><p>Home loan interest (self-occupied)</p></td><td><p>Available</p></td><td><p>Not available</p></td></tr><tr><td><p>Employer NPS contribution — 80CCD(2)</p></td><td><p>Available</p></td><td><p>Available</p></td></tr></tbody></table><p><em>The trade-off in one view</em></p><h2>Find your break-even, then decide</h2><p>The method is mechanical, and it takes about ten minutes:</p><ol><li><p>Total your gross income for the year — salary, house property, capital gains, business and other sources.</p></li><li><p>List the deductions you will genuinely claim, not the ones you could theoretically claim. Only count investments you would make anyway.</p></li><li><p>Compute tax under both regimes on those numbers, including cess and any surcharge.</p></li><li><p>Pick the lower figure — and note how far you are from the crossover, because next year's numbers will move.</p></li></ol><blockquote><p><strong>The honesty test</strong><br>Only count a deduction if you would make that investment regardless of the tax break. Locking ₹1.5 lakh into a five-year product purely to save tax is a portfolio decision disguised as a tax decision.</p></blockquote><h2>Who tends to land where</h2><ul><li><p><strong>Old regime usually wins</strong> for salaried taxpayers paying significant rent in a metro, servicing a home loan, and using 80C, 80D and NPS fully.</p></li><li><p><strong>New regime usually wins</strong> for early-career professionals, those without a home loan or rent claim, and anyone whose deductions are modest.</p></li><li><p><strong>Too close to call?</strong> Choose the new regime for the simpler compliance — fewer proofs to collect and fewer disallowance disputes.</p></li></ul><h2>How often can you switch?</h2><p>If you have only salary and other non-business income, you can choose afresh each assessment year while filing your return. If you have income from business or profession, the option to move back to the old regime is generally available only once — after which the choice becomes sticky. Business owners should therefore model several years, not one.</p><blockquote><p><strong>Filing on time matters</strong><br>The option to choose the old regime is exercised in the return of income. Miss the due date and, for many taxpayers, the ability to opt out of the default new regime for that year goes with it.</p></blockquote><blockquote><p><strong>Not sure which regime fits your numbers?</strong><br>Send us your salary structure and investment list — we will run both computations and show you the break-even.<br><a href=\"/#contact\">Request a comparison</a></p></blockquote>",
    coverImageUrl: "/images/blog/blog-1-2.jpg",
    coverImageAlt: "Calculator and tax documents on a desk",
    contentType: "GUIDE",
    categorySlug: "income-tax",
    authorSlug: "ca-ravi-varma",
    tagSlugs: [
      "new-tax-regime",
      "itr-filing",
      "section-80c",
    ],
    keyTakeaways: [
      "The new regime under section 115BAC is the default — you must consciously opt out to use the old one.",
      "The decision reduces to a single break-even: the total deductions at which both regimes produce the same tax.",
      "Salaried taxpayers can switch every year; business income can generally exercise the option only once.",
      "Run the comparison on actual numbers before choosing, not on last year's assumption.",
    ],
    faqs: [
      {
        question: "Can I switch between the old and new tax regime every year?",
        answer: "Salaried taxpayers and others without business income can choose the regime each year when filing their return. Taxpayers with income from business or profession can generally opt out of the new regime only once, and switching back again is restricted.",
      },
      {
        question: "Is the standard deduction available in the new regime?",
        answer: "Yes. The standard deduction against salary income is available in both regimes. What the new regime removes are the Chapter VI-A deductions such as 80C and 80D, and exemptions such as HRA and LTA.",
      },
      {
        question: "Does my employer's regime choice bind me at filing time?",
        answer: "No. The declaration you give your employer only decides how TDS is computed during the year. You can still choose the other regime when filing your return, subject to the rules for business income and the filing due date.",
      },
    ],
    sources: [
      {
        label: "Income-tax Act, 1961 — Section 115BAC",
        url: "https://incometaxindia.gov.in",
      },
      {
        label: "Income Tax Department e-filing portal",
        url: "https://www.incometax.gov.in",
      },
    ],
    isFeatured: true,
    isPinned: true,
    publishedDaysAgo: 9,
    seoTitle: "Old vs New Tax Regime — How To Decide | Carvi Associates",
    seoDescription: "A break-even method for choosing between the old and new income tax regimes under section 115BAC, including who can switch each year and who cannot.",
    seoKeywords: "old vs new tax regime, section 115BAC, income tax regime comparison, standard deduction new regime, tax planning India",
  },
  {
    title: "Input Tax Credit: The Five Conditions People Forget",
    slug: "input-tax-credit-five-conditions-people-forget",
    subtitle: "Why your GSTR-2B and purchase register never agree",
    excerpt: "Input tax credit is not automatic. Five conditions must all be satisfied — and the two that trip up most businesses are supplier compliance and the 180-day payment rule.",
    contentHtml: "<p>Input tax credit is the mechanism that stops GST from cascading. It is also the single largest source of departmental notices we handle. The reason is simple: businesses treat ITC as an entitlement that arrives with the invoice, when the law treats it as a conditional benefit.</p><h2>The five conditions, in order</h2><ol><li><p><strong>You hold a valid tax invoice</strong> or debit note issued by a registered supplier — with the correct GSTIN, place of supply and HSN.</p></li><li><p><strong>You have received the goods or services.</strong> Where delivery is in lots, credit is available only on receipt of the last lot.</p></li><li><p><strong>The supplier has actually paid the tax</strong> to the government and reported the invoice, so it appears in your GSTR-2B.</p></li><li><p><strong>You have filed the relevant return</strong> in which the credit is claimed.</p></li><li><p><strong>You pay the supplier within 180 days</strong> of the invoice date, failing which the credit is reversed with interest.</p></li></ol><blockquote><p><strong>Condition three is not in your control</strong><br>You can do everything right and still lose credit because your supplier did not file. This is why vendor GST compliance belongs in your procurement checklist, not only in your accounts department.</p></blockquote><h2>Reconcile monthly, not annually</h2><p>GSTR-2B is a static, auto-drafted statement generated once a month. It is the reference point for what you may claim. Compare it against your purchase register every month and split the differences into three buckets:</p><table><tbody><tr><th><p>Bucket</p></th><th><p>What it means</p></th><th><p>Action</p></th></tr><tr><td><p>In books, not in 2B</p></td><td><p>Supplier has not filed or filed late</p></td><td><p>Chase the supplier before the annual return deadline</p></td></tr><tr><td><p>In 2B, not in books</p></td><td><p>Invoice not recorded, or wrong GSTIN used</p></td><td><p>Book it, or ask the supplier to amend</p></td></tr><tr><td><p>Value or tax mismatch</p></td><td><p>Rate, taxable value or place of supply differs</p></td><td><p>Reconcile line by line and seek a debit/credit note</p></td></tr></tbody></table><p><em>A three-bucket reconciliation that takes an hour a month</em></p><h2>The 180-day rule, explained properly</h2><p>If you have not paid the supplier the invoice value together with tax within 180 days of the invoice date, the credit already taken must be added back to your output liability, with interest. The good news: once you actually pay, you may reclaim the credit without the usual time limit for that reclaim.</p><blockquote><p><strong>Build it into the ageing report</strong><br>Add a 180-day flag to your creditors ageing. It converts a GST risk into a routine payables review, and it pairs neatly with the MSME 45-day rule you are already tracking.</p></blockquote><h2>Blocked credits: know them before you book them</h2><p>Section 17(5) blocks credit on specified items regardless of business use — motor vehicles below a seating threshold, food and beverages, club memberships, works contract services for immovable property, and goods lost, stolen or given as free samples, among others. Coding these correctly at the point of entry avoids a reversal, interest and a penalty conversation later.</p><blockquote><p>The cheapest GST litigation is the reconciliation you did on time. — CA Sneha Iyer</p></blockquote><blockquote><p><strong>Facing an ITC mismatch notice?</strong><br>We reconcile the period, prepare the response and represent you before the department.<br><a href=\"/#contact\">Get GST support</a></p></blockquote>",
    coverImageUrl: "/images/blog/blog-1-3.jpg",
    coverImageAlt: "Accountant reconciling GST invoices on a laptop",
    contentType: "ARTICLE",
    categorySlug: "gst",
    authorSlug: "ca-sneha-iyer",
    tagSlugs: [
      "input-tax-credit",
      "gstr-3b",
      "e-invoicing",
    ],
    keyTakeaways: [
      "ITC needs a valid tax invoice, receipt of goods or services, tax actually paid by the supplier, a filed return, and payment within 180 days.",
      "GSTR-2B is the statutory basis for claiming credit — reconcile against it every month.",
      "Credit reversed for non-payment within 180 days can be reclaimed once you pay the supplier.",
      "Blocked credits under section 17(5) are not recoverable at all — classify them correctly at entry.",
    ],
    faqs: [
      {
        question: "Can I claim ITC if the invoice is not in my GSTR-2B?",
        answer: "No. Credit can be availed only in respect of invoices that appear in GSTR-2B, meaning the supplier has reported them. The practical remedy is to follow up with the supplier to file or amend before the deadline for that financial year's credit.",
      },
      {
        question: "What happens if I pay the supplier after 180 days?",
        answer: "The credit must be reversed with interest in the month the 180 days expire. Once you make the payment, you can reclaim that credit, and the usual time limit for availing credit does not restrict this reclaim.",
      },
      {
        question: "Is ITC available on employee expenses?",
        answer: "It depends on the item. Credit on food and beverages, health services and club memberships is generally blocked under section 17(5) unless the employer is required by law to provide them, or the supply is used to make an outward taxable supply of the same category.",
      },
    ],
    sources: [
      {
        label: "CGST Act, 2017 — Sections 16 and 17",
        url: "https://cbic-gst.gov.in",
      },
      {
        label: "GST portal — Returns dashboard",
        url: "https://www.gst.gov.in",
      },
    ],
    isFeatured: false,
    isPinned: false,
    publishedDaysAgo: 14,
    seoTitle: "Input Tax Credit — Five Conditions People Forget | Carvi Associates",
    seoDescription: "The five statutory conditions for claiming GST input tax credit, how to reconcile GSTR-2B monthly, the 180-day payment rule and blocked credits under section 17(5).",
    seoKeywords: "input tax credit conditions, GSTR-2B reconciliation, ITC 180 day rule, section 17(5) blocked credit, GST compliance India",
  },
  {
    title: "ROC Annual Filing Checklist For Private Limited Companies",
    slug: "roc-annual-filing-checklist-private-limited-companies",
    subtitle: "AOC-4, MGT-7A, DIR-3 KYC and the ones people miss",
    excerpt: "A dated, form-by-form checklist of everything a private limited company must file with the Registrar of Companies each year — plus the additional fee you will pay if you slip.",
    contentHtml: "<p>ROC compliance is unforgiving in one specific way: the additional fee for late filing runs at ₹100 per day per form and does not stop. A form forgotten for a year is not a small penalty — it is a five-figure one, per form, per company.</p><blockquote><p><strong>Who this covers</strong><br>This checklist is for a private limited company that is not a small company exception case. One Person Companies and small companies file MGT-7A instead of MGT-7 and have a lighter board meeting requirement.</p></blockquote><h2>The annual sequence</h2><ol><li><p><strong>Close the books</strong> and get the financial statements ready for audit.</p></li><li><p><strong>Board meeting</strong> to approve the financial statements and the board's report.</p></li><li><p><strong>Statutory audit</strong> completed and the audit report signed.</p></li><li><p><strong>Annual General Meeting</strong> held within six months of financial year end (nine months for the first AGM).</p></li><li><p><strong>File AOC-4</strong> with the financial statements within 30 days of the AGM.</p></li><li><p><strong>File MGT-7 or MGT-7A</strong> with the annual return within 60 days of the AGM.</p></li><li><p><strong>File DIR-3 KYC</strong> for every director by the annual deadline.</p></li></ol><h2>Form-by-form reference</h2><table><tbody><tr><th><p>Form</p></th><th><p>Purpose</p></th><th><p>Timeline</p></th></tr><tr><td><p>AOC-4</p></td><td><p>Financial statements and board's report</p></td><td><p>30 days from AGM</p></td></tr><tr><td><p>MGT-7 / MGT-7A</p></td><td><p>Annual return</p></td><td><p>60 days from AGM</p></td></tr><tr><td><p>DIR-3 KYC</p></td><td><p>Director KYC for each DIN holder</p></td><td><p>Annual, by the notified date</p></td></tr><tr><td><p>ADT-1</p></td><td><p>Auditor appointment</p></td><td><p>15 days from AGM (on appointment)</p></td></tr><tr><td><p>MSME-1</p></td><td><p>Half-yearly return of dues to MSME vendors</p></td><td><p>Half-yearly</p></td></tr><tr><td><p>DPT-3</p></td><td><p>Return of deposits and exempted receipts</p></td><td><p>Annual</p></td></tr></tbody></table><p><em>The recurring filings most private companies need</em></p><blockquote><p><strong>The DIN trap</strong><br>Miss DIR-3 KYC and the director's DIN is deactivated. That director then cannot sign any form for any company until the KYC is filed with the reactivation fee — which usually surfaces at the worst possible moment, mid-transaction.</p></blockquote><h2>Registers and records to keep current</h2><ul><li><p>Register of members, directors and key managerial personnel.</p></li><li><p>Register of charges, kept in step with every loan and security created.</p></li><li><p>Minutes of board and general meetings, signed and paginated.</p></li><li><p>Statutory registers available at the registered office for inspection.</p></li></ul><blockquote><p><strong>Do it in one sitting</strong><br>Block a single week after the AGM for the entire filing set. Splitting it across months is how the second and third forms get forgotten.</p></blockquote><blockquote><p><strong>Want your ROC calendar managed end to end?</strong><br>Our corporate secretarial desk tracks every due date and files on your behalf.<br><a href=\"/#contact\">Talk to our team</a></p></blockquote>",
    coverImageUrl: "/images/blog/blog-1-4.jpg",
    coverImageAlt: "Company secretary reviewing statutory registers",
    contentType: "CHECKLIST",
    categorySlug: "company-law-roc",
    authorSlug: "cs-arjun-mehta",
    tagSlugs: [
      "roc-annual-filing",
      "dir-3-kyc",
      "due-dates",
    ],
    keyTakeaways: [
      "AOC-4 is due within 30 days and MGT-7/MGT-7A within 60 days of the AGM.",
      "DIR-3 KYC is an annual obligation for every director holding a DIN, even in a dormant company.",
      "Late ROC filing attracts an additional fee of ₹100 per day per form, with no cap.",
      "A deactivated DIN blocks the director from signing any form for any company.",
    ],
    faqs: [
      {
        question: "What is the penalty for late ROC filing?",
        answer: "An additional fee of ₹100 per day per form applies from the due date until the date of actual filing, with no upper limit. Continuing default can also attract penalties on the company and its officers under the relevant section.",
      },
      {
        question: "Does a dormant or zero-revenue company still have to file?",
        answer: "Yes. Annual filings and DIR-3 KYC are required regardless of turnover. A company with no operations still files AOC-4 and MGT-7A, and its directors still complete KYC.",
      },
      {
        question: "What is the difference between MGT-7 and MGT-7A?",
        answer: "MGT-7A is the abridged annual return prescribed for One Person Companies and small companies. Other companies file MGT-7. The content of the abridged form is lighter but the deadline is the same.",
      },
    ],
    sources: [
      {
        label: "Companies Act, 2013 — Sections 92 and 137",
        url: "https://www.mca.gov.in",
      },
      {
        label: "MCA21 portal",
        url: "https://www.mca.gov.in",
      },
    ],
    isFeatured: false,
    isPinned: false,
    publishedDaysAgo: 21,
    seoTitle: "ROC Annual Filing Checklist for Private Limited Companies | Carvi Associates",
    seoDescription: "AOC-4, MGT-7/MGT-7A, DIR-3 KYC, ADT-1, MSME-1 and DPT-3 — a dated annual ROC compliance checklist for Indian private limited companies, with late filing consequences.",
    seoKeywords: "ROC annual filing, AOC-4 due date, MGT-7A, DIR-3 KYC, private limited company compliance, MCA filing checklist",
  },
  {
    title: "Tax Audit Under Section 44AB: Do You Actually Need One?",
    slug: "tax-audit-section-44ab-do-you-need-one",
    subtitle: "Turnover limits, the 5% cash test and presumptive interaction",
    excerpt: "The tax audit threshold is no longer a single number. Whether you cross it depends on your cash receipts and payments, and on whether you have opted into presumptive taxation.",
    contentHtml: "<p>&quot;Do I need a tax audit?&quot; sounds like a yes-or-no question. It is actually three questions: what is your turnover, how much of your money moves in cash, and have you ever opted into a presumptive scheme.</p><h2>The cash test that changes the threshold</h2><p>For a business, the basic turnover threshold for tax audit is raised substantially where <strong>both</strong> of these hold true:</p><ul><li><p>Aggregate cash <strong>receipts</strong> during the year do not exceed 5% of total receipts, and</p></li><li><p>Aggregate cash <strong>payments</strong> during the year do not exceed 5% of total payments.</p></li></ul><blockquote><p><strong>Both limbs, not either</strong><br>Businesses often check receipts and stop. Fail the payments limb — a run of cash wages or cash vendor settlements — and the higher threshold is lost entirely for that year.</p></blockquote><h2>Professionals are treated differently</h2><p>Gross receipts from a profession are tested against their own threshold, and the 5% cash relaxation applicable to business turnover does not apply in the same way. A consultant, doctor or architect should test their position against the professional limit, not the business one.</p><h2>How presumptive taxation interacts</h2><table><tbody><tr><th><p>Situation</p></th><th><p>Tax audit consequence</p></th></tr><tr><td><p>Within presumptive limits and declaring the presumptive rate or higher</p></td><td><p>No tax audit required on that ground</p></td></tr><tr><td><p>Declaring lower than the presumptive rate, with income above the basic exemption</p></td><td><p>Audit required, and books must be maintained</p></td></tr><tr><td><p>Opted out of 44AD after opting in</p></td><td><p>Locked out of 44AD for five years; audit can be triggered in that period</p></td></tr></tbody></table><p><em>Presumptive taxation and the audit trigger</em></p><blockquote><p><strong>Section 44AD's five-year lock</strong><br>If you declare presumptive income under 44AD and then opt out in a later year, you cannot return to 44AD for the next five assessment years — and in those years the audit and bookkeeping requirements can apply.</p></blockquote><h2>What the auditor will ask for</h2><ol><li><p>Trial balance, general ledger and bank statements for the full year.</p></li><li><p>Fixed asset register with additions, disposals and depreciation working.</p></li><li><p>Stock records with the valuation basis and physical verification evidence.</p></li><li><p>TDS deduction and deposit summary, reconciled to Form 26AS.</p></li><li><p>GST returns reconciled to the revenue in the books.</p></li><li><p>Related party transaction details and loan confirmations.</p></li></ol><blockquote><p><strong>Form 3CD is read closely</strong><br>The clauses on disallowances, related party payments, loans accepted or repaid in cash, and TDS defaults are the ones that most often become assessment questions. Get them right the first time rather than explaining them later.</p></blockquote><blockquote><p><strong>Not sure whether the audit applies to you?</strong><br>Send us your turnover and cash mix — we will confirm your position in writing.<br><a href=\"/#contact\">Check my position</a></p></blockquote>",
    coverImageUrl: "/images/blog/blog-1-5.jpg",
    coverImageAlt: "Auditor reviewing ledgers and financial statements",
    contentType: "ARTICLE",
    categorySlug: "audit-assurance",
    authorSlug: "ca-priya-nandan",
    tagSlugs: [
      "tax-audit",
      "presumptive-taxation",
      "due-dates",
    ],
    keyTakeaways: [
      "The higher turnover threshold applies only if cash receipts and cash payments are each within 5% of the total.",
      "Digital-first businesses often stay outside audit at turnover levels that would once have required one.",
      "Opting out of presumptive taxation after opting in can independently trigger a tax audit.",
      "Form 3CD is a disclosure document — errors in it travel straight into assessment proceedings.",
    ],
    faqs: [
      {
        question: "What is the due date for filing the tax audit report?",
        answer: "The audit report in Form 3CA/3CB with Form 3CD must be filed by the specified date, which falls one month before the due date for filing the return for audited taxpayers. Confirm the current year's dates, as extensions are common.",
      },
      {
        question: "What is the penalty for not getting a tax audit done?",
        answer: "Section 271B provides a penalty of 0.5% of turnover or gross receipts, capped at ₹1,50,000. The penalty may not be levied if there was reasonable cause for the failure.",
      },
      {
        question: "Does a loss-making business need a tax audit?",
        answer: "Turnover, not profitability, drives the requirement. A loss-making business above the threshold still needs the audit, and a taxpayer declaring less than the presumptive rate with income above the exemption limit can be pulled in as well.",
      },
    ],
    sources: [
      {
        label: "Income-tax Act, 1961 — Sections 44AB, 44AD, 44ADA",
        url: "https://incometaxindia.gov.in",
      },
      {
        label: "ICAI Guidance Note on Tax Audit",
        url: "https://www.icai.org",
      },
    ],
    isFeatured: false,
    isPinned: false,
    publishedDaysAgo: 28,
    seoTitle: "Tax Audit Under Section 44AB — Do You Need One? | Carvi Associates",
    seoDescription: "Tax audit applicability explained — turnover thresholds, the 5% cash receipts and payments test, professional limits, presumptive taxation interaction and Form 3CD readiness.",
    seoKeywords: "section 44AB tax audit, tax audit limit, 5% cash transaction rule, form 3CD, section 44AD five year rule",
  },
  {
    title: "Statutory Due Dates Every Business Should Diarise",
    slug: "statutory-due-dates-every-business-should-diarise",
    subtitle: "One calendar across income tax, GST, TDS, PF and ROC",
    excerpt: "Compliance failures are rarely decisions — they are forgotten dates. Here is a consolidated recurring calendar you can lift straight into your finance team's workflow.",
    contentHtml: "<p>Nobody sets out to miss a statutory deadline. They get missed because the finance calendar lives in four different systems and nobody owns the consolidated view. This is that consolidated view.</p><h2>The monthly rhythm</h2><table><tbody><tr><th><p>Day</p></th><th><p>Obligation</p></th><th><p>Applies to</p></th></tr><tr><td><p>7th</p></td><td><p>TDS/TCS deposit for the previous month</p></td><td><p>All deductors</p></td></tr><tr><td><p>11th</p></td><td><p>GSTR-1 — outward supplies</p></td><td><p>Monthly filers</p></td></tr><tr><td><p>13th</p></td><td><p>IFF / QRMP outward supplies</p></td><td><p>Quarterly filers</p></td></tr><tr><td><p>15th</p></td><td><p>PF and ESI contribution deposit</p></td><td><p>Covered employers</p></td></tr><tr><td><p>20th</p></td><td><p>GSTR-3B — summary return and payment</p></td><td><p>Monthly filers</p></td></tr><tr><td><p>25th</p></td><td><p>PMT-06 payment under QRMP</p></td><td><p>Quarterly filers</p></td></tr></tbody></table><p><em>Recurring monthly deadlines</em></p><h2>Advance tax: the four instalments</h2><table><tbody><tr><th><p>Instalment</p></th><th><p>Cumulative tax payable</p></th></tr><tr><td><p>By 15 June</p></td><td><p>15%</p></td></tr><tr><td><p>By 15 September</p></td><td><p>45%</p></td></tr><tr><td><p>By 15 December</p></td><td><p>75%</p></td></tr><tr><td><p>By 15 March</p></td><td><p>100%</p></td></tr></tbody></table><p><em>Cumulative, not incremental — each date covers everything up to it</em></p><blockquote><p><strong>Interest is automatic</strong><br>Sections 234B and 234C charge interest for shortfall and deferment without any notice or discretion. Estimate your annual profit before each instalment rather than paying last year's number again.</p></blockquote><h2>Quarterly and annual anchors</h2><ul><li><p><strong>Quarterly</strong> — TDS returns (24Q/26Q/27Q), followed by Form 16A issuance to deductees.</p></li><li><p><strong>Annually</strong> — Form 16 to employees, income tax return, tax audit report where applicable.</p></li><li><p><strong>Annually</strong> — GSTR-9 and GSTR-9C where the turnover thresholds are crossed.</p></li><li><p><strong>Annually</strong> — AOC-4, MGT-7/MGT-7A and DIR-3 KYC for companies.</p></li></ul><blockquote><p><strong>Make the calendar a control</strong><br>Give every date a named owner and a reviewer, set the reminder three working days early, and review misses monthly. A calendar without owners is decoration.</p></blockquote><blockquote><p><strong>Dates move</strong><br>Due dates are extended more often than anyone would like. Treat this as the standing schedule and confirm the current year's notifications before each filing.</p></blockquote><blockquote><p><strong>Want this calendar managed for you?</strong><br>We run the compliance calendar for clients end to end — filings, reminders and confirmations.<br><a href=\"/#contact\">Book a compliance review</a></p></blockquote>",
    coverImageUrl: "/images/blog/blog-1-6.jpg",
    coverImageAlt: "Wall calendar with compliance deadlines marked",
    contentType: "UPDATE",
    categorySlug: "compliance-calendar",
    authorSlug: "cs-arjun-mehta",
    tagSlugs: [
      "due-dates",
      "gstr-3b",
      "tds-return",
      "advance-tax",
    ],
    keyTakeaways: [
      "Most recurring dues cluster on the 7th, 11th, 15th and 20th of each month.",
      "Advance tax runs on a 15/45/75/100 percent cumulative schedule across four instalments.",
      "Interest under sections 234B and 234C accrues automatically — no notice is needed.",
      "Put a named owner against every date; a shared calendar with no owner is not a control.",
    ],
    faqs: [
      {
        question: "What happens if I miss the GSTR-3B due date?",
        answer: "Late fee accrues per day of delay for each of CGST and SGST, subject to caps, and interest applies on the net tax paid in cash. Persistent delays can also block your GSTR-1 filing and affect your recipients' credit.",
      },
      {
        question: "Do I pay advance tax if I am a salaried employee?",
        answer: "Usually not, because your employer deducts TDS. Advance tax becomes relevant when you have significant income outside salary — capital gains, interest, rent or freelance income — on which no tax has been deducted.",
      },
      {
        question: "Are senior citizens exempt from advance tax?",
        answer: "A resident senior citizen who does not have income from business or profession is not required to pay advance tax. Income from a business or profession removes that relief.",
      },
    ],
    sources: [
      {
        label: "Income Tax Department — Tax calendar",
        url: "https://www.incometax.gov.in",
      },
      {
        label: "GST portal — Return due dates",
        url: "https://www.gst.gov.in",
      },
    ],
    isFeatured: false,
    isPinned: false,
    publishedDaysAgo: 35,
    seoTitle: "Statutory Due Dates Calendar for Indian Businesses | Carvi Associates",
    seoDescription: "A consolidated compliance calendar covering TDS deposits, GSTR-1 and GSTR-3B, PF and ESI, advance tax instalments, quarterly TDS returns and annual ROC filings.",
    seoKeywords: "statutory due dates India, compliance calendar, GSTR-3B due date, advance tax instalments, TDS payment due date",
  },
  {
    title: "How A Manufacturer Recovered ₹42 Lakh Of Blocked GST Credit",
    slug: "manufacturer-recovered-blocked-gst-credit-case-study",
    subtitle: "A twelve-week reconciliation and vendor remediation programme",
    excerpt: "An auto-components manufacturer had written off years of unreconciled input tax credit as a lost cause. A structured vendor-by-vendor programme recovered most of it.",
    contentHtml: "<blockquote><p><strong>Client profile</strong><br>An auto-components manufacturer in Telangana, approximately ₹180 crore turnover, roughly 400 active vendors, with two plants and a central accounts team of six. Details are anonymised.</p></blockquote><h2>The problem</h2><p>The company carried a growing gap between the credit in its purchase register and the credit appearing in GSTR-2B. Nobody could explain it line by line, so each year the difference was quietly written off to the profit and loss account. By the time we were engaged, the accumulated gap stood at about ₹42 lakh.</p><h2>What we did</h2><ol><li><p><strong>Weeks 1–2 — rebuild the base.</strong> Extracted 36 months of purchase data and GSTR-2B, normalised GSTIN and invoice number formats, and matched on a tolerance basis rather than exact strings.</p></li><li><p><strong>Weeks 3–4 — segment by root cause.</strong> Split the residual gap into four queues: supplier never filed, supplier filed under the wrong GSTIN, value or rate mismatch, and our own booking errors.</p></li><li><p><strong>Weeks 5–9 — vendor remediation.</strong> Issued queue-specific communications and, crucially, routed unresolved cases into the fortnightly payment approval run so commercial leverage applied naturally.</p></li><li><p><strong>Weeks 10–12 — claim, reverse and document.</strong> Availed the recoverable credit in the eligible periods, reversed what was genuinely blocked under section 17(5), and documented the basis for each decision.</p></li></ol><table><tbody><tr><th><p>Root cause</p></th><th><p>Value (₹ lakh)</p></th><th><p>Outcome</p></th></tr><tr><td><p>Supplier had not filed</p></td><td><p>18.4</p></td><td><p>16.1 recovered after follow-up</p></td></tr><tr><td><p>Wrong GSTIN used by supplier</p></td><td><p>9.7</p></td><td><p>9.7 recovered via amendment</p></td></tr><tr><td><p>Value or rate mismatch</p></td><td><p>7.2</p></td><td><p>5.9 recovered, balance credit-noted</p></td></tr><tr><td><p>Blocked under section 17(5)</p></td><td><p>6.7</p></td><td><p>Correctly reversed, not recoverable</p></td></tr></tbody></table><p><em>Where the ₹42 lakh actually sat</em></p><h2>The result</h2><p>₹31.7 lakh of credit was recovered and ₹6.7 lakh was correctly identified as blocked and reversed with a documented rationale — which is itself a win, because it removed an exposure the company did not know it carried. The remaining balance related to vendors who had ceased operations.</p><blockquote><p><strong>What made it stick</strong><br>We handed over a monthly three-bucket reconciliation with a named owner and put the 180-day payment flag into the creditors ageing report. Eighteen months later the backlog has not rebuilt.</p></blockquote><blockquote><p>We assumed the difference was the cost of doing business. It was mostly just unfinished follow-up. — Finance Controller, client company</p></blockquote><blockquote><p><strong>Sitting on unreconciled credit?</strong><br>We will size the recoverable portion before you commit to anything.<br><a href=\"/#contact\">Request an ITC health check</a></p></blockquote>",
    coverImageUrl: "/images/blog/blog-2-1.jpg",
    coverImageAlt: "Manufacturing plant floor with inventory racks",
    contentType: "CASE_STUDY",
    categorySlug: "gst",
    authorSlug: "ca-sneha-iyer",
    tagSlugs: [
      "input-tax-credit",
      "gstr-3b",
      "cash-flow",
    ],
    keyTakeaways: [
      "Unreconciled ITC is recoverable far more often than businesses assume.",
      "Segmenting mismatches by root cause turns an unmanageable list into four workable queues.",
      "Vendor escalation works best when it is tied to the payment run.",
      "A monthly reconciliation discipline prevented the backlog from rebuilding.",
    ],
    faqs: [
      {
        question: "How far back can input tax credit be reconciled and claimed?",
        answer: "Credit for a financial year must generally be availed by the earlier of 30 November of the following financial year or the date of filing the annual return. Older periods can still be reconciled to quantify exposure, even where the credit itself has lapsed.",
      },
      {
        question: "Can we recover credit if the supplier has closed down?",
        answer: "Practically, no. If the supplier never reported the invoice and no longer exists to amend its returns, the credit condition cannot be satisfied. This is why vendor GST compliance belongs in onboarding, not only in reconciliation.",
      },
    ],
    sources: [
      {
        label: "CGST Act, 2017 — Section 16(4)",
        url: "https://cbic-gst.gov.in",
      },
    ],
    isFeatured: false,
    isPinned: false,
    publishedDaysAgo: 45,
    seoTitle: "Case Study: Recovering ₹42 Lakh of Blocked GST Credit | Carvi Associates",
    seoDescription: "How a manufacturer recovered ₹31.7 lakh of unreconciled GST input tax credit through a twelve-week reconciliation and vendor remediation programme.",
    seoKeywords: "GST input tax credit recovery, ITC reconciliation case study, GSTR-2B mismatch, vendor GST compliance",
  },
  {
    title: "Choosing Your Business Structure: LLP, Private Limited Or Proprietorship",
    slug: "choosing-business-structure-llp-private-limited-proprietorship",
    subtitle: "Liability, tax, compliance cost and fundraising, compared honestly",
    excerpt: "The structure you pick on day one shapes your tax rate, your compliance bill and whether an investor can write you a cheque. Here is a comparison that avoids the usual hand-waving.",
    contentHtml: "<p>There is no single best structure — only the structure that matches how you intend to raise money, share ownership and absorb risk over the next three years. Start from those three questions and the answer usually chooses itself.</p><h2>Side by side</h2><table><tbody><tr><th><p>Dimension</p></th><th><p>Proprietorship</p></th><th><p>LLP</p></th><th><p>Private Limited</p></th></tr><tr><td><p>Separate legal entity</p></td><td><p>No</p></td><td><p>Yes</p></td><td><p>Yes</p></td></tr><tr><td><p>Personal liability</p></td><td><p>Unlimited</p></td><td><p>Limited</p></td><td><p>Limited</p></td></tr><tr><td><p>Taxed at</p></td><td><p>Individual slab rates</p></td><td><p>Flat firm rate</p></td><td><p>Corporate rate</p></td></tr><tr><td><p>Annual compliance cost</p></td><td><p>Lowest</p></td><td><p>Moderate</p></td><td><p>Highest</p></td></tr><tr><td><p>Statutory audit</p></td><td><p>Only if thresholds crossed</p></td><td><p>Threshold based</p></td><td><p>Always</p></td></tr><tr><td><p>Equity fundraising</p></td><td><p>Not possible</p></td><td><p>Difficult</p></td><td><p>Standard</p></td></tr><tr><td><p>ESOPs</p></td><td><p>No</p></td><td><p>No</p></td><td><p>Yes</p></td></tr><tr><td><p>Ownership transfer</p></td><td><p>Not applicable</p></td><td><p>Cumbersome</p></td><td><p>Straightforward</p></td></tr></tbody></table><p><em>The comparison that actually drives the decision</em></p><h2>When each one fits</h2><h3>Proprietorship</h3><p>Right for a single founder testing an idea, a consultant, or a local trading business with limited liability exposure. You are the business — which is efficient until something goes wrong, at which point your personal assets are reachable.</p><h3>Limited Liability Partnership</h3><p>Right for professional practices and stable partner groups who want liability protection without the full weight of company law. Profit share to partners is not taxed again in their hands, which makes distribution simpler than dividends.</p><h3>Private Limited Company</h3><p>Right if you intend to raise institutional capital, issue ESOPs, or bring in co-founders with defined equity. It carries the highest compliance load — board meetings, statutory audit regardless of size, and the full ROC calendar — but it is the only structure most investors will fund.</p><blockquote><p><strong>Do not incorporate a company too early</strong><br>A private limited company with no revenue still needs an audit, annual filings and director KYC every year. If you are eighteen months from raising, that is real money spent on compliance rather than product.</p></blockquote><blockquote><p><strong>Registrations to line up either way</strong><br>PAN and TAN, GST where thresholds or inter-state supply apply, Udyam registration, professional tax where applicable, and a current account in the entity's own name. Shop and establishment registration is state-specific.</p></blockquote><h2>Changing structure later</h2><p>Conversion is a well-trodden path — proprietorship to LLP or company, LLP to company — but it takes weeks, carries professional and filing fees, and can trigger tax consequences on the transfer of assets if the prescribed conditions are not met. It is far easier when you have five vendors than when you have five hundred.</p><blockquote><p><strong>Deciding how to set up?</strong><br>Tell us your funding plan and risk profile — we will recommend a structure and handle the registration end to end.<br><a href=\"/#contact\">Get set-up advice</a></p></blockquote>",
    coverImageUrl: "/images/blog/blog-2-2.jpg",
    coverImageAlt: "Founders discussing business structure options",
    contentType: "GUIDE",
    categorySlug: "startup-business-setup",
    authorSlug: "cs-arjun-mehta",
    tagSlugs: [
      "startup-india",
      "roc-annual-filing",
      "presumptive-taxation",
    ],
    keyTakeaways: [
      "A proprietorship is cheapest to run and offers no liability separation.",
      "An LLP suits professional services and bootstrapped businesses with stable ownership.",
      "Institutional investors will almost always require a private limited company.",
      "Converting later is possible but costs time, fees and sometimes tax — choose with a three-year view.",
    ],
    faqs: [
      {
        question: "Can an LLP raise venture capital funding?",
        answer: "It is legally possible but practically rare. Venture investors expect equity shares, preference instruments, ESOP pools and a defined cap table — all standard in a private limited company and awkward in an LLP. Most funds simply require conversion first.",
      },
      {
        question: "Does a private limited company always need a statutory audit?",
        answer: "Yes. Every company incorporated under the Companies Act requires a statutory audit regardless of turnover or activity, including a company with no operations during the year.",
      },
      {
        question: "Is Startup India recognition worth applying for?",
        answer: "For eligible entities it is inexpensive and unlocks self-certification on some labour and environmental laws, IPR fee benefits, and access to the 80-IAC tax holiday if separately approved. It does not by itself reduce your compliance obligations.",
      },
    ],
    sources: [
      {
        label: "Ministry of Corporate Affairs",
        url: "https://www.mca.gov.in",
      },
      {
        label: "Startup India — Recognition",
        url: "https://www.startupindia.gov.in",
      },
    ],
    isFeatured: false,
    isPinned: false,
    publishedDaysAgo: 52,
    seoTitle: "LLP vs Private Limited vs Proprietorship — Which To Choose | Carvi Associates",
    seoDescription: "Compare proprietorship, LLP and private limited company on liability, taxation, compliance cost, audit requirements, ESOPs and fundraising before you register.",
    seoKeywords: "LLP vs private limited, business structure India, company registration, proprietorship vs company, startup entity structure",
  },
  {
    title: "TDS Defaults: Reading Your Notice And Fixing It Properly",
    slug: "tds-defaults-reading-your-notice-and-fixing-it",
    subtitle: "Short deduction, short payment, late fee and the PAN error nobody expects",
    excerpt: "A TDS default notice usually looks worse than it is. Most are traceable to four causes, and three of them are fixed with a correction statement rather than a payment.",
    contentHtml: "<p>A default intimation from the TRACES system arrives with a total at the bottom and very little explanation. Before you pay it, work out which of the four categories each line belongs to — because the remedy differs, and paying a demand you do not owe is hard to unwind.</p><h2>The four categories</h2><table><tbody><tr><th><p>Default</p></th><th><p>What it means</p></th><th><p>Usual remedy</p></th></tr><tr><td><p>Short deduction</p></td><td><p>Deducted at a lower rate than required</p></td><td><p>Correction statement, or pay the difference with interest</p></td></tr><tr><td><p>Short payment</p></td><td><p>Deducted correctly but deposited less</p></td><td><p>Pay the shortfall and tag the challan in a correction</p></td></tr><tr><td><p>Late payment interest</p></td><td><p>Deposited after the 7th of the following month</p></td><td><p>Pay interest at the prescribed rate</p></td></tr><tr><td><p>Late filing fee (234E)</p></td><td><p>Quarterly statement filed after the due date</p></td><td><p>Pay the fee — it is mandatory, not discretionary</p></td></tr></tbody></table><p><em>Diagnose before you pay</em></p><h2>The PAN problem behind most short-deduction notices</h2><p>Where a deductee's PAN is not furnished, is invalid, or has become inoperative for want of Aadhaar linkage, tax must be deducted at the higher rate prescribed under section 206AA. You deducted at 10%, the system expected 20%, and the difference lands on you as the deductor — not on the deductee.</p><blockquote><p><strong>The cost falls on the deductor</strong><br>You cannot recover the shortfall from a vendor who has already been paid in full. Validate PAN status at onboarding and again before each payment run — it is a two-minute check on the income tax portal.</p></blockquote><h2>Fixing it in the right order</h2><ol><li><p>Download the justification report from TRACES — it explains each default line by line.</p></li><li><p>Reconcile challans: unconsumed challans from another quarter can often be tagged against the demand.</p></li><li><p>Correct genuine data errors — PAN, section code, amount, deduction date — via a correction statement.</p></li><li><p>Pay only what genuinely remains after correction, using the right challan type and assessment year.</p></li><li><p>Re-download the conso file and confirm the demand has closed.</p></li></ol><blockquote><p><strong>Unconsumed challans are common</strong><br>Businesses frequently overpay in one quarter and short-pay in another. Before paying a demand, check whether an unconsumed challan already sitting with the department can be tagged against it.</p></blockquote><h2>Preventing the next one</h2><ul><li><p>Validate PAN and its operative status at vendor onboarding.</p></li><li><p>Maintain a section-code map for recurring vendor categories so rates are not chosen ad hoc.</p></li><li><p>Deposit by the 7th, and diarise the quarterly statement dates with a named owner.</p></li><li><p>Reconcile Form 26AS/AIS against your books each quarter, not each year.</p></li></ul><blockquote><p><strong>Received a TDS default notice?</strong><br>Send us the justification report — we will tell you what is genuinely payable before you pay anything.<br><a href=\"/#contact\">Get help with a notice</a></p></blockquote>",
    coverImageUrl: "/images/blog/blog-2-3.jpg",
    coverImageAlt: "Finance team reviewing a tax notice on screen",
    contentType: "ARTICLE",
    categorySlug: "tds-tcs",
    authorSlug: "ca-ravi-varma",
    tagSlugs: [
      "tds-return",
      "form-16",
      "due-dates",
    ],
    keyTakeaways: [
      "Most defaults trace to four causes — short deduction, short payment, late payment interest and late filing fee.",
      "An inoperative or incorrect PAN triggers deduction at the higher rate and shows up as short deduction.",
      "Late filing fee under section 234E accrues per day and cannot be waived by the assessing officer.",
      "File a correction statement before paying anything you do not actually owe.",
    ],
    faqs: [
      {
        question: "Can the late filing fee under section 234E be waived?",
        answer: "The fee is levied for each day of delay and the assessing officer has no discretion to waive it. Relief, where available, generally comes through appellate proceedings on limited grounds rather than through a request to the officer.",
      },
      {
        question: "What is the higher TDS rate for an inoperative PAN?",
        answer: "Where PAN is not furnished, is invalid, or is inoperative, section 206AA requires deduction at the higher of the applicable rate, the rate in force, or 20%. Confirm the current position for your payment category before applying it.",
      },
      {
        question: "How do I fix a wrong PAN in a filed TDS return?",
        answer: "File a correction statement against the original return, updating the deductee record. Corrections to PAN are subject to structural validation limits, so material changes may need to be handled as a deletion and fresh addition.",
      },
    ],
    sources: [
      {
        label: "Income-tax Act, 1961 — Sections 200A, 206AA, 234E",
        url: "https://incometaxindia.gov.in",
      },
      {
        label: "TRACES — TDS Reconciliation Portal",
        url: "https://www.tdscpc.gov.in",
      },
    ],
    isFeatured: false,
    isPinned: false,
    publishedDaysAgo: 60,
    seoTitle: "TDS Default Notices — How To Read And Fix Them | Carvi Associates",
    seoDescription: "Understand short deduction, short payment, late payment interest and section 234E late filing fees, plus how PAN validation and correction statements resolve TDS demands.",
    seoKeywords: "TDS default notice, short deduction TDS, section 234E late fee, section 206AA higher rate, TRACES justification report",
  },
];
