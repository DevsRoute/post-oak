import type {
  Account,
  Bookmark,
  ChartPoint,
  Customer,
  MonthlyMovement,
  NavItem,
  Transaction,
} from "./types";

export const BRAND = {
  name: "Post Oak Group",
  plan: "Oakline Banking",
  userName: "John Jackman",
  userFirst: "John",
  userEmail: "john@postoakgroup.com",
};

export const totalBalance = 5_216_471.18;

export const accounts: Account[] = [
  { id: "credit", name: "Credit Card", balance: 12_505.87, kind: "credit", pendingIn: 0, pendingOut: 3_900, available: 21_249, sublabel: "Credit ••7742" },
  { id: "treasury", name: "Treasury", balance: 200_000.0, kind: "treasury", pendingIn: 31_764.1, pendingOut: 0, available: 200_000, sublabel: "Treasury ••5521" },
  { id: "ops", name: "Ops / Payroll", balance: 2_023_267.12, kind: "depository", pendingIn: 14_240.5, pendingOut: 8_120.75, available: 2_017_347.11, sublabel: "Checking ••1038" },
  { id: "ap", name: "AP", balance: 226_767.82, kind: "depository", pendingIn: 0, pendingOut: 11_430, available: 215_337.82, sublabel: "Checking ••1794" },
  { id: "ar", name: "AR", balance: 0.0, kind: "depository", pendingIn: 419, pendingOut: 0, available: 0, sublabel: "Checking ••4296" },
];
export const extraAccountCount = 2;

export const navItems: NavItem[] = [
  { label: "Home", icon: "home", active: true },
  { label: "Tasks", icon: "tasks", badge: "10" },
  { label: "Command", icon: "command", tag: "New" },
  { label: "Accounts", icon: "accounts", children: [{ label: "Treasury" }, { label: "Financing" }] },
  { label: "Transactions", icon: "transactions", children: [{ label: "Insights" }] },
  { label: "Cards", icon: "cards", children: [{ label: "Credit Card" }] },
  {
    label: "Team Spend",
    icon: "team",
    children: [{ label: "Budgets" }, { label: "Reimbursements" }, { label: "Policies" }],
  },
  {
    label: "Payments",
    icon: "payments",
    children: [
      { label: "Bill Pay" },
      { label: "Recipients" },
      { label: "Taxes" },
      { label: "Wire Drawdowns" },
      { label: "ACH Authorizations" },
      { label: "Checkbooks" },
    ],
  },
  {
    label: "Invoicing",
    icon: "invoicing",
    children: [{ label: "Recurring Series" }, { label: "Customers" }, { label: "Catalog" }],
  },
  { label: "Accounting", icon: "accounting" },
];

export const bookmarks: Bookmark[] = [
  { label: "Ops / Payroll", amount: 2_023_267.12 },
  { label: "Credit Card" },
  { label: "Bill Pay" },
  { label: "Insights" },
];

/* 60-day balance series — multi-wave undulation around a slight uptrend. */
export const balanceSeries: ChartPoint[] = (() => {
  const end = new Date(2026, 10, 4); // Nov 4 2026
  const N = 60;
  const base = 4_700_000;
  const pts: ChartPoint[] = [];
  for (let i = 0; i < N; i++) {
    const d = new Date(end);
    d.setDate(end.getDate() - (N - 1 - i));
    const trend = i * 7_800;
    const wave1 = Math.sin(i * 0.52) * 92_000;
    const wave2 = Math.sin(i * 0.19 + 1.2) * 128_000;
    const wave3 = Math.cos(i * 0.37) * 54_000;
    const spike = i === 18 ? 65_000 : i === 42 ? -72_000 : 0;
    const value = base + trend + wave1 + wave2 + wave3 + spike;
    pts.push({
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      fullLabel: d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      iso: d.toISOString().slice(0, 10),
      value: Math.round(value),
    });
  }
  pts[pts.length - 1].value = Math.round(totalBalance);
  return pts;
})();

export const balanceSummary = {
  totalCurrent: 5_144_707.08,
  totalAvailable: 5_144_707.08,
  pendingTransfers: 71_764.1,
  pendingDeposits: 1_000.0,
  description:
    "Your Post Oak Group balance is a bird's eye view of available funds across all accounts, including internal transfers that are in flight.",
  availableHint:
    "Funds that can be spent immediately. Your IO balance may limit this. Learn more",
  shieldHint:
    "Oakline Vault actively monitors your funds and recommends actions to ensure maximum protection. Click to learn more.",
};

export const creditCard = {
  balance: 12_505.87,
  pending: 3_900,
  available: 21_249,
  limit: 40_000,
  autopayDate: "Nov 9",
};

export const billPay = {
  outstanding: 11,
  overdue: 1,
  dueSoon: 0,
  inboxItems: 3,
  inboxValue: "$10K",
};

export const invoicing = {
  overdueCount: 4,
  overdueValue: "$950.00",
  paidCount: 12,
  paidValue: "$6K",
  openCount: 12,
  openValue: "$12.3K",
};

/* --------- Money movement: 6 months of history for the carousel --------- */
export const months: MonthlyMovement[] = [
  {
    key: "2026-06",
    label: "Jun 2026",
    inTotal: 82_413.22,
    outTotal: 71_204.11,
    inAvg3mo: 525_000,
    outAvg3mo: 248_000,
    inSources: [
      { name: "Jameson Accounting", amount: 36_210 },
      { name: "Brightwave Media", amount: 14_880 },
      { name: "Vela Systems", amount: 9_430 },
      { name: "Orchard Labs", amount: 6_210 },
    ],
    outSources: [
      { name: "Milgram Brokerage", amount: 13_140 },
      { name: "Brightwave Media", amount: 11_520 },
      { name: "Monarch Books", amount: 7_310 },
      { name: "Orchard Labs", amount: 5_980 },
    ],
  },
  {
    key: "2026-07",
    label: "Jul 2026",
    inTotal: 91_207.88,
    outTotal: 78_613.5,
    inAvg3mo: 548_000,
    outAvg3mo: 254_000,
    inSources: [
      { name: "Jameson Accounting", amount: 39_820 },
      { name: "Brightwave Media", amount: 16_015 },
      { name: "Milgram Brokerage", amount: 9_740 },
      { name: "Vela Systems", amount: 7_322 },
    ],
    outSources: [
      { name: "Brightwave Media", amount: 13_915 },
      { name: "Milgram Brokerage", amount: 12_204 },
      { name: "Orchard Labs", amount: 8_421 },
      { name: "Monarch Books", amount: 5_890 },
    ],
  },
  {
    key: "2026-08",
    label: "Aug 2026",
    inTotal: 87_915.03,
    outTotal: 82_311.4,
    inAvg3mo: 571_000,
    outAvg3mo: 259_000,
    inSources: [
      { name: "Jameson Accounting", amount: 37_150 },
      { name: "Brightwave Media", amount: 15_488 },
      { name: "Milgram Brokerage", amount: 10_207 },
      { name: "Orchard Labs", amount: 7_013 },
    ],
    outSources: [
      { name: "Brightwave Media", amount: 14_140 },
      { name: "Milgram Brokerage", amount: 13_077 },
      { name: "Orchard Labs", amount: 8_612 },
      { name: "Monarch Books", amount: 6_104 },
    ],
  },
  {
    key: "2026-09",
    label: "Sep 2026",
    inTotal: 22_480.5,
    outTotal: 18_610.0,
    inAvg3mo: 590_000,
    outAvg3mo: 261_000,
    inSources: [
      { name: "Jameson Accounting", amount: 41_100 },
      { name: "Brightwave Media", amount: 16_803 },
      { name: "Milgram Brokerage", amount: 10_490 },
      { name: "Orchard Labs", amount: 7_422 },
    ],
    outSources: [
      { name: "Brightwave Media", amount: 14_333 },
      { name: "Milgram Brokerage", amount: 12_621 },
      { name: "Orchard Labs", amount: 8_740 },
      { name: "Monarch Books", amount: 6_018 },
    ],
  },
  {
    key: "2026-10",
    label: "Oct 2026",
    inTotal: 58_940.3,
    outTotal: 41_755.1,
    inAvg3mo: 598_000,
    outAvg3mo: 264_000,
    inSources: [
      { name: "Jameson Accounting", amount: 42_205 },
      { name: "Brightwave Media", amount: 17_322 },
      { name: "Milgram Brokerage", amount: 10_511 },
      { name: "Orchard Labs", amount: 7_533 },
    ],
    outSources: [
      { name: "Brightwave Media", amount: 14_512 },
      { name: "Milgram Brokerage", amount: 12_755 },
      { name: "Orchard Labs", amount: 8_820 },
      { name: "Monarch Books", amount: 6_117 },
    ],
  },
  {
    key: "2026-11",
    label: "Nov 2026",
    inTotal: 101_641.23,
    outTotal: 74_825.1,
    inAvg3mo: 604_000,
    outAvg3mo: 266_000,
    inSources: [
      { name: "Jameson Accounting", amount: 43_450.5 },
      { name: "Brightwave Media", amount: 17_943.39 },
      { name: "Milgram Brokerage", amount: 10_605.25 },
      { name: "Orchard Labs", amount: 7_643.54 },
    ],
    outSources: [
      { name: "Brightwave Media", amount: 14_725.22 },
      { name: "Milgram Brokerage", amount: 12_853.4 },
      { name: "Orchard Labs", amount: 8_964.53 },
      { name: "Monarch Books", amount: 6_245.72 },
    ],
  },
];

/* --------- Transactions: varied dataset with tab tags --------- */
export const transactions: Transaction[] = [
  { id: "t1", date: "Nov 4", counterparty: "John's Account", monogram: "JJ", amount: -750.0, account: "Ops / Payroll", method: "Linked account transfer", status: "settled", isMine: true },
  { id: "t2", date: "Nov 4", counterparty: "Northledger Working Capital", monogram: "NW", amount: -2_200.0, account: "Ops / Payroll", method: "Working Capital Loan Payment", status: "settled" },
  { id: "t3", date: "Nov 4", counterparty: "Payment from Vela Systems", monogram: "VS", amount: 419.0, account: "AR", method: "Request or Invoice Payment", status: "failed" },
  { id: "t4", date: "Nov 4", counterparty: "Payment from Acme Corp", monogram: "AC", amount: 200.0, account: "AR", method: "Request or Invoice Payment", status: "settled" },
  { id: "t5", date: "Nov 4", counterparty: "To Ops / Payroll", monogram: "OP", amount: -55_810.16, account: "AR", method: "Transfer", status: "settled" },
  { id: "t6", date: "Nov 4", counterparty: "From AR", monogram: "AR", amount: 55_810.16, account: "Ops / Payroll", method: "Transfer", status: "settled" },
  { id: "t7", date: "Nov 4", counterparty: "Lily's Eatery", monogram: "LE", amount: 0.93, account: "Ops / Payroll", method: "Alice C. ••1234", status: "settled" },
  { id: "t8", date: "Nov 4", counterparty: "Corner Deli", monogram: "CD", amount: 63.53, account: "Credit Card", method: "Mary M. ••0332", status: "settled" },
  { id: "t9", date: "Nov 4", counterparty: "Corner Deli", monogram: "CD", amount: 214.06, account: "Ops / Payroll", method: "Jane B. ••6112", status: "settled" },
  { id: "t10", date: "Nov 4", counterparty: "Office Stop Co.", monogram: "OS", amount: -287.89, account: "Ops / Payroll", method: "Jessica A. ••9914", status: "settled" },
  { id: "t11", date: "Nov 3", counterparty: "Jameson Accounting", monogram: "JA", amount: 43_450.5, account: "AR", method: "ACH credit", status: "settled" },
  { id: "t12", date: "Nov 3", counterparty: "Brightwave Media", monogram: "BM", amount: -14_725.22, account: "Ops / Payroll", method: "Wire out", status: "settled" },
  { id: "t13", date: "Nov 3", counterparty: "John's Coffee", monogram: "JC", amount: -8.75, account: "Credit Card", method: "John J. ••9014", status: "settled", isMine: true },
  { id: "t14", date: "Nov 2", counterparty: "Milgram Brokerage", monogram: "MB", amount: -12_853.4, account: "Ops / Payroll", method: "Wire out", status: "settled" },
  { id: "t15", date: "Nov 2", counterparty: "Payment from Acme Corp", monogram: "AC", amount: 17_943.39, account: "AR", method: "Request or Invoice Payment", status: "settled" },
  { id: "t16", date: "Nov 1", counterparty: "AWS", monogram: "AW", amount: -3_210.44, account: "Ops / Payroll", method: "Card ••1120", status: "settled" },
  { id: "t17", date: "Nov 1", counterparty: "Orchard Labs", monogram: "OL", amount: 7_643.54, account: "AR", method: "ACH credit", status: "settled" },
  { id: "t18", date: "Oct 31", counterparty: "John Jackman — reimbursement", monogram: "JJ", amount: -124.32, account: "Ops / Payroll", method: "Reimbursement", status: "settled", isMine: true },
  { id: "t19", date: "Oct 31", counterparty: "Monarch Books", monogram: "MB", amount: -6_245.72, account: "Ops / Payroll", method: "ACH debit", status: "settled" },
  { id: "t20", date: "Oct 30", counterparty: "Payroll run", monogram: "PR", amount: -48_117.9, account: "Ops / Payroll", method: "Payroll", status: "settled" },
];

export const customers: Customer[] = [
  { id: "nebula", name: "Nebula Strategy Group", email: "ap@nebulastrategy.co" },
  { id: "orbital", name: "Orbital Advisory Partners", email: "invoices@orbitaladvisory.com" },
  { id: "polaris", name: "Polaris Legal Services", email: "billing@polarislegal.com" },
  { id: "astral", name: "Astral Creative Co", email: "finance@astralcreative.co" },
  { id: "zenith", name: "Zenith Capital Firm", email: "accounts@zenithcapital.co" },
  { id: "quasar", name: "Quasar Design Studio", email: "hello@quasardesign.co" },
  { id: "solstice", name: "Solstice Marketing Group", email: "ap@solsticemarketing.com" },
  { id: "meridian", name: "Meridian Consulting", email: "invoices@meridianconsulting.co" },
  { id: "aphelion", name: "Aphelion Financial Advisors", email: "billing@aphelionfa.com" },
  { id: "vega", name: "Vega Compliance Partners", email: "ap@vegacompliance.com" },
];

export const txnTabs = [
  "Recent",
  "My transactions",
  "Monthly money in",
  "Monthly money out",
  "Operating expenses",
] as const;
