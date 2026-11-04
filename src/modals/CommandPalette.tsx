import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowSwap,
  Calendar,
  Cards as CardsIcon,
  CheckCircle,
  ChevronRight,
  Folder,
  Request,
  Search,
  UserPeople,
} from "../components/icons/Icons";
import "./CommandPalette.css";

type IconCmp = typeof Search;

interface PaletteItem {
  id: string;
  Icon?: IconCmp;
  avatar?: string;
  label: string;
  sublabel?: string;
  trailing?: string;
  trailingSub?: string;
  chip?: string;
  indent?: boolean;
}

type Tab =
  | "All"
  | "Pages"
  | "Transactions"
  | "Accounts"
  | "Cards"
  | "Recipients"
  | "Statements"
  | "Scheduled"
  | "Approvals"
  | "Team"
  | "Departments";

const TABS: Tab[] = [
  "All",
  "Pages",
  "Transactions",
  "Accounts",
  "Cards",
  "Recipients",
  "Statements",
  "Scheduled",
  "Approvals",
  "Team",
  "Departments",
];

const DATA: Record<Tab, PaletteItem[]> = {
  All: [
    { id: "all-1", Icon: ArrowSwap, label: "Recent transactions", trailing: "View all" },
    { id: "all-2", Icon: Calendar, label: "Scheduled payments" },
    { id: "all-3", Icon: CheckCircle, label: "Payment approvals" },
    { id: "all-4", Icon: CardsIcon, label: "Cards" },
    { id: "all-5", Icon: Folder, label: "View statements for Ops / Payroll" },
    { id: "all-6", Icon: Request, label: "Ops / Payroll" },
  ],
  Pages: [
    { id: "p-1", Icon: Calendar, label: "Account Security" },
    { id: "p-2", Icon: Calendar, label: "Accounting" },
    { id: "p-3", Icon: Calendar, label: "Accounts" },
    { id: "p-4", Icon: Calendar, label: "Add a recipient" },
    { id: "p-5", Icon: Calendar, label: "Add a wire drawdown authorization (reverse wire)" },
    { id: "p-6", Icon: Calendar, label: "Add funds" },
    { id: "p-7", Icon: Calendar, label: "Add funds via wire transfer" },
    { id: "p-8", Icon: Calendar, label: "Add NetSuite integration" },
    { id: "p-9", Icon: Calendar, label: "Add QuickBooks integration" },
    { id: "p-10", Icon: Calendar, label: "Add security key" },
  ],
  Transactions: [
    { id: "t-g1", label: "Ops / Payroll", trailing: "View all transactions" },
    { id: "t-1", label: "−$55,810.16", sublabel: "", trailingSub: "Transfer · Nov 5", indent: true },
    { id: "t-2", label: "$31,764.10", trailingSub: "Treasury Transfer · Nov 4", indent: true },
    { id: "t-g2", label: "AP", trailing: "View all transactions" },
    { id: "t-3", label: "−$40,000.00", trailingSub: "Transfer · Nov 5", indent: true },
    { id: "t-g3", label: "AR", trailing: "View all transactions" },
    { id: "t-4", label: "$55,810.16", trailingSub: "Transfer · Nov 5", indent: true },
    { id: "t-5", label: "−$150,000.00", trailingSub: "Transfer · Nov 4", indent: true },
    { id: "t-6", label: "$55,810.16", trailingSub: "Transfer · Nov 4", indent: true },
    { id: "t-g4", label: "Post Oak Checking ••0297", trailing: "View all transactions" },
  ],
  Accounts: [
    { id: "a-1", label: "Credit Card" },
    { id: "a-2", label: "Treasury", trailing: "$200,000.00" },
    { id: "a-3", label: "Ops / Payroll ••1038", trailing: "$2,023,267.12" },
    { id: "a-4", label: "AP ••1794", trailing: "$226,767.82" },
    { id: "a-5", label: "AR ••4296", trailing: "$0.00" },
    { id: "a-6", label: "Checking ••0297", trailing: "$1,374,471.14" },
    { id: "a-7", label: "Savings ••7658", trailing: "$1,320,201.00" },
  ],
  Cards: [
    { id: "c-1", label: "Physical Debit ••3745", sublabel: "John J. · $0.00 spent this week" },
    { id: "c-2", label: "Grocery/Meals ••4928", sublabel: "John J. · $0.00 spent this week", chip: "Single-use" },
    { id: "c-3", label: "Column Card ••6112", sublabel: "John J. · $0.00 spent this week" },
    { id: "c-4", label: "Team Lunch Debit Card ••4471", sublabel: "John J. · $0.00 spent this week" },
    { id: "c-5", label: "John's IO card ••5555", sublabel: "John J. · $0.00 spent this week" },
    { id: "c-6", label: "AWS billing ••0330", sublabel: "John J. · $100.00 spent this week" },
    { id: "c-7", label: "Facebook ads ••3054", sublabel: "John J. · $240.00 spent this week" },
  ],
  Recipients: [
    { id: "r-1", avatar: "LP", label: "Lighthouse Properties #3431", sublabel: "Last paid $5,250 on Nov 5" },
    { id: "r-2", avatar: "D", label: "Debug LLC", sublabel: "Last paid $450.50 on Nov 5" },
    { id: "r-3", avatar: "N", label: "Nutritionist (Aliyah McMahon)", sublabel: "aliyah@mcmahon.com · Last paid $1,041.80 on Nov 5" },
    { id: "r-4", avatar: "DA", label: "Domestic Ads", sublabel: "Last paid $300.03 on Nov 4" },
    { id: "r-5", avatar: "JO", label: "Jordi O'Donnell", sublabel: "jordi@postoak.com · Last paid $2,200.67 on Nov 4" },
    { id: "r-6", avatar: "JV", label: "Jean Vallee", sublabel: "Last paid Nov 3" },
    { id: "r-7", avatar: "DM", label: "Deshaun Moore" },
  ],
  Statements: [
    { id: "s-1", Icon: Folder, label: "Credit Card" },
    { id: "s-2", Icon: Folder, label: "Treasury" },
    { id: "s-3", Icon: Folder, label: "Ops / Payroll" },
    { id: "s-4", Icon: Folder, label: "AP" },
    { id: "s-5", Icon: Folder, label: "AR" },
    { id: "s-6", Icon: Folder, label: "Checking ••0297" },
    { id: "s-7", Icon: Folder, label: "Savings ••7658" },
  ],
  Scheduled: [
    { id: "sc-1", avatar: "JG", label: "To Jason Green", sublabel: "ACH scheduled for Nov 5", trailing: "$213.11" },
    { id: "sc-2", avatar: "L", label: "To Lighthouse Properties #3431", sublabel: "ACH scheduled for Dec 1", trailing: "$950.00" },
    { id: "sc-3", avatar: "DA", label: "To Domestic Ads", sublabel: "ACH scheduled for Dec 4", trailing: "$37.19" },
    { id: "sc-4", avatar: "DA", label: "To Domestic Ads", sublabel: "Check scheduled for Dec 24", trailing: "$1.99" },
    { id: "sc-5", avatar: "AM", label: "To Aliyah McMahon", sublabel: "International Wire scheduled for May 3", trailing: "$34,691.17" },
    { id: "sc-6", avatar: "JV", label: "To Jean Vallee", sublabel: "International Wire scheduled for Jul 2", trailing: "$4,123.00" },
  ],
  Approvals: [
    { id: "ap-1", avatar: "V", label: "To Vendor Payments to Jason Green", sublabel: "Created Sep 1", trailing: "$6,042.95" },
    { id: "ap-2", avatar: "V", label: "To Vendor Payments to Bridget Adam", sublabel: "Created Sep 1", trailing: "$6,042.95" },
    { id: "ap-3", avatar: "JG", label: "To Jason Green", sublabel: "Created Nov 3", trailing: "$1,042.95" },
    { id: "ap-4", avatar: "JG", label: "To Jason Green", sublabel: "Due Dec 9", trailing: "$5,000.00" },
    { id: "ap-5", avatar: "SB", label: "To Savings ••8888", sublabel: "Created Nov 3", trailing: "$20,000.00" },
    { id: "ap-6", avatar: "CB", label: "To Checking ••9876", sublabel: "Created Nov 4", trailing: "$120,000.00" },
    { id: "ap-7", avatar: "PR", label: "To Pending Recipient", trailing: "$1,000.00" },
  ],
  Team: [
    { id: "tm-1", avatar: "JJ", label: "John Jackman", sublabel: "Other C-Level (e.g. COO, CTO) · john@postoak.com", chip: "Active" },
    { id: "tm-2", avatar: "AK", label: "Abigail Kyte", sublabel: "Product Manager · abigail@postoak.com", chip: "Active" },
    { id: "tm-3", avatar: "AC", label: "Alice Chen", sublabel: "Software Engineer · alice@postoak.com", chip: "Active" },
    { id: "tm-4", avatar: "AJ", label: "Andrew Jeffords", sublabel: "VP of Finance · andrew@postoak.com", chip: "Active" },
    { id: "tm-5", avatar: "AB", label: "Anthony Buteo", sublabel: "Product Manager · anthony@postoak.com", chip: "Active" },
    { id: "tm-6", avatar: "BF", label: "Brian Ford", sublabel: "Bookkeeper · brian@postoak.com", chip: "Active" },
    { id: "tm-7", avatar: "BF", label: "Brock Forestead" },
  ],
  Departments: [
    { id: "d-1", Icon: UserPeople, label: "Executive", sublabel: "Led by John Jackman" },
    { id: "d-2", Icon: UserPeople, label: "Finance", sublabel: "Led by Alice Chen" },
    { id: "d-3", Icon: UserPeople, label: "Product", sublabel: "Led by Landon Shepherd" },
  ],
};

export default function CommandPalette({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<Tab>("All");
  const [active, setActive] = useState(0);
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const items = useMemo(() => {
    const base = DATA[tab];
    if (!q.trim()) return base;
    const needle = q.toLowerCase();
    return base.filter(
      (i) =>
        i.label.toLowerCase().includes(needle) ||
        i.sublabel?.toLowerCase().includes(needle)
    );
  }, [tab, q]);

  useEffect(() => {
    setActive(0);
  }, [tab, q]);

  function onInputKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      onClose();
    }
  }

  function scrollTabs(dir: 1 | -1) {
    tabsRef.current?.scrollBy({ left: dir * 180, behavior: "smooth" });
  }

  return (
    <div className="cmd-overlay" onClick={onClose}>
      <div
        className="cmd-palette"
        role="dialog"
        aria-label="Search"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="cmd-search">
          <Search width={18} height={18} />
          <input
            autoFocus
            type="text"
            placeholder="Search for anything"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onInputKey}
          />
        </div>

        <div className="cmd-tabs-row">
          <button
            type="button"
            className="cmd-tab-nav"
            aria-label="Previous tabs"
            onClick={() => scrollTabs(-1)}
          >
            <ChevronRight
              width={14}
              height={14}
              style={{ transform: "rotate(180deg)" }}
            />
          </button>
          <div className="cmd-tabs" ref={tabsRef} role="tablist">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={tab === t}
                className={`cmd-tab ${tab === t ? "is-active" : ""}`}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="cmd-tab-nav"
            aria-label="Next tabs"
            onClick={() => scrollTabs(1)}
          >
            <ChevronRight width={14} height={14} />
          </button>
        </div>

        {tab === "All" && items.length > 0 && (
          <div className="cmd-section-label">Examples</div>
        )}

        <div className="cmd-list">
          {items.length === 0 ? (
            <div className="cmd-empty">No matches</div>
          ) : (
            items.map((it, i) => {
              const isGroup =
                tab === "Transactions" && !it.indent && it.id.startsWith("t-g");
              return (
                <button
                  key={it.id}
                  type="button"
                  role="option"
                  aria-selected={i === active}
                  className={`cmd-item ${i === active ? "is-active" : ""} ${
                    it.indent ? "is-indent" : ""
                  } ${isGroup ? "is-group" : ""}`}
                  onMouseEnter={() => setActive(i)}
                  onClick={onClose}
                >
                  {it.avatar !== undefined ? (
                    <span className="cmd-avatar mono">{it.avatar}</span>
                  ) : it.Icon ? (
                    <span className="cmd-ico">
                      <it.Icon width={15} height={15} />
                    </span>
                  ) : (
                    <span className="cmd-ico cmd-ico-empty" />
                  )}
                  <span className="cmd-text">
                    <span className="cmd-label">
                      {it.label}
                      {it.chip && <span className="cmd-chip">{it.chip}</span>}
                    </span>
                    {it.sublabel && <span className="cmd-sublabel">{it.sublabel}</span>}
                  </span>
                  <span className="cmd-right">
                    {it.trailing && <span className="cmd-trailing">{it.trailing}</span>}
                    {it.trailingSub && (
                      <span className="cmd-trailing-sub">{it.trailingSub}</span>
                    )}
                    {isGroup && <ChevronRight width={14} height={14} />}
                  </span>
                </button>
              );
            })
          )}
        </div>

        <div className="cmd-foot">
          <span className="cmd-foot-item">
            <kbd className="cmd-key">↑</kbd>
            <kbd className="cmd-key">↓</kbd>
            Navigate
          </span>
          <span className="cmd-foot-item">
            <kbd className="cmd-key">↵</kbd>
            Open page
          </span>
          <span className="cmd-foot-item">
            <kbd className="cmd-key">⌘</kbd>
            <kbd className="cmd-key">↵</kbd>
            Open in new tab
          </span>
        </div>
      </div>
    </div>
  );
}
