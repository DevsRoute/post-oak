import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { BRAND } from "../data";
import { money } from "../format";
import Wordmark from "../components/Wordmark";
import {
  AlertCircle,
  Bill,
  Bolt,
  Bookmark,
  Chevron,
  Close,
  Copy,
  Gear,
  MessageSquare,
  Send,
  Trash,
} from "../components/icons/Icons";
import "./BillPayFlow.css";

type Tab = "inbox" | "needs-approval" | "scheduled" | "paid";

interface Bill {
  id: string;
  dueDate: string;
  status: "overdue" | "pending" | "scheduled" | "paid";
  recipient: string;
  monogram: string;
  amount: number;
  invoiceNo: string;
  lastUpdated: string;
  tab: Tab;
}

const BILLS: Bill[] = [
  // Inbox
  { id: "b1", dueDate: "Apr 2025", status: "overdue", recipient: "Debug LLC", monogram: "D", amount: 220.00, invoiceNo: "INV-902", lastUpdated: "Nov 4", tab: "inbox" },
  { id: "b2", dueDate: "Dec 2025", status: "overdue", recipient: "Nano Tech LLC", monogram: "N", amount: 1290.00, invoiceNo: "INV-001", lastUpdated: "Nov 4", tab: "inbox" },
  { id: "b3", dueDate: "Jan 17", status: "overdue", recipient: "Tax Bureau Inc", monogram: "J", amount: 11600.00, invoiceNo: "INV-883346", lastUpdated: "Nov 4", tab: "inbox" },
  // Needs approval
  { id: "b4", dueDate: "Feb 10", status: "pending", recipient: "Zenith Capital Firm", monogram: "Z", amount: 5120.00, invoiceNo: "INV-901", lastUpdated: "Nov 3", tab: "needs-approval" },
  // Scheduled
  { id: "b5", dueDate: "Nov 10", status: "scheduled", recipient: "Milgram Brokerage", monogram: "M", amount: 2500.00, invoiceNo: "INV-440", lastUpdated: "Nov 2", tab: "scheduled" },
  { id: "b6", dueDate: "Nov 12", status: "scheduled", recipient: "Orchard Labs", monogram: "O", amount: 750.00, invoiceNo: "INV-441", lastUpdated: "Nov 2", tab: "scheduled" },
  { id: "b7", dueDate: "Nov 20", status: "scheduled", recipient: "Brightwave Media", monogram: "B", amount: 1850.00, invoiceNo: "INV-442", lastUpdated: "Nov 1", tab: "scheduled" },
  // Paid
  { id: "b8", dueDate: "Oct 15", status: "paid", recipient: "Monarch Books", monogram: "M", amount: 6245.72, invoiceNo: "INV-320", lastUpdated: "Oct 15", tab: "paid" },
  { id: "b9", dueDate: "Oct 10", status: "paid", recipient: "Orchard Labs", monogram: "O", amount: 980.00, invoiceNo: "INV-315", lastUpdated: "Oct 10", tab: "paid" },
];

const TABS: { key: Tab; label: string }[] = [
  { key: "inbox", label: "Inbox" },
  { key: "needs-approval", label: "Needs approval" },
  { key: "scheduled", label: "Scheduled" },
  { key: "paid", label: "Paid" },
];

interface Props {
  onClose: () => void;
}

export default function BillPayFlow({ onClose }: Props) {
  const [tab, setTab] = useState<Tab>("inbox");
  const [status, setStatus] = useState("All statuses");
  const [bills, setBills] = useState<Bill[]>(BILLS);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [bookmarked, setBookmarked] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (settingsOpen) setSettingsOpen(false);
        else onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, settingsOpen]);

  const forwardingEmail = `${BRAND.name.toLowerCase().replace(/\s+/g, "-")}@ap.postoakgroup.com`;

  const tabCounts = {
    inbox: BILLS.filter((b) => b.tab === "inbox").length,
    "needs-approval": BILLS.filter((b) => b.tab === "needs-approval").length,
    scheduled: BILLS.filter((b) => b.tab === "scheduled").length,
    paid: BILLS.filter((b) => b.tab === "paid").length,
  };

  const outstanding = BILLS.filter((b) => b.tab !== "paid");
  const outstandingTotal = outstanding.reduce((s, b) => s + b.amount, 0);
  const overdue = BILLS.filter((b) => b.status === "overdue");
  const overdueTotal = overdue.reduce((s, b) => s + b.amount, 0);
  const dueSoon = BILLS.filter(
    (b) => b.tab === "scheduled" && b.lastUpdated.startsWith("Nov")
  );
  const dueSoonTotal = 0;

  const visibleBills = bills.filter((b) => b.tab === tab);

  function copyEmail() {
    navigator.clipboard?.writeText(forwardingEmail);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  function removeBill(id: string) {
    setBills((prev) => prev.filter((b) => b.id !== id));
  }

  return (
    <div className="bp-overlay" role="dialog" aria-label="Bill Pay">
      <header className="bp-header">
        <div className="bp-brand">
          <Wordmark height={30} />
        </div>
        <button
          type="button"
          className="bp-close"
          aria-label="Close"
          onClick={onClose}
        >
          <Close width={20} height={20} />
        </button>
      </header>

      <div className="bp-scroll">
        <main className="bp-body">
          <div className="bp-title-row">
            <h1 className="bp-title">Bill Pay</h1>
            <button
              type="button"
              className={`bp-bookmark ${bookmarked ? "is-on" : ""}`}
              aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
              aria-pressed={bookmarked}
              onClick={() => setBookmarked((b) => !b)}
            >
              <Bookmark width={16} height={16} />
            </button>
            <div className="bp-spacer" />
            <button type="button" className="bp-pill">
              <MessageSquare width={14} height={14} />
              Feedback
            </button>
            <button type="button" className="bp-pill">
              <Send width={14} height={14} />
              Send money
            </button>
            <button type="button" className="bp-pill bp-pill-accent">
              <Bill width={14} height={14} />
              Upload bill
            </button>
          </div>

          <div className="bp-stats">
            <StatCard
              value={outstanding.length}
              label="Total outstanding"
              sub={money(outstandingTotal, { cents: false })}
            />
            <StatCard
              value={overdue.length}
              label="Overdue"
              sub={money(overdueTotal, { cents: false })}
              tone="warn"
            />
            <StatCard
              value={dueSoon.length}
              label="Due in next 7 days"
              sub={money(dueSoonTotal)}
            />
          </div>

          <div className="bp-toolbar">
            <div className="bp-tabs" role="tablist">
              {TABS.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  role="tab"
                  aria-selected={tab === t.key}
                  className={`bp-tab ${tab === t.key ? "is-active" : ""}`}
                  onClick={() => setTab(t.key)}
                >
                  {t.label}
                  <span className="bp-tab-count">{tabCounts[t.key]}</span>
                </button>
              ))}
            </div>
            <div className="bp-forward">
              <span className="tip-wrap">
                <button
                  type="button"
                  className="bp-forward-chip"
                  onClick={copyEmail}
                >
                  <Bill width={14} height={14} />
                  <span className="bp-forward-email">{forwardingEmail}</span>
                  <Copy width={14} height={14} />
                </button>
                <span className="tip tip-bottom-center">
                  {copied ? "Copied" : "Copy forwarding email"}
                </span>
              </span>
              <button
                type="button"
                className="bp-gear"
                aria-label="Bill Pay settings"
                onClick={() => setSettingsOpen(true)}
              >
                <Gear width={16} height={16} />
              </button>
            </div>
          </div>

          <div className="bp-table-toolbar">
            <StatusFilter value={status} onChange={setStatus} />
          </div>

          <div className="bp-table-wrap">
            <table className="bp-table">
              <thead>
                <tr>
                  <th style={{ width: 28 }}>
                    <input type="checkbox" className="bp-check" />
                  </th>
                  <th>
                    Due date <SortArrow />
                  </th>
                  <th>Status</th>
                  <th>Recipient</th>
                  <th className="num">Amount</th>
                  <th>Invoice no.</th>
                  <th>
                    Last updated <SortArrow />
                  </th>
                </tr>
              </thead>
              <tbody>
                {visibleBills.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="bp-empty">
                      No bills in this view.
                    </td>
                  </tr>
                ) : (
                  visibleBills.map((b) => (
                    <tr key={b.id} className="bp-row">
                      <td>
                        <input type="checkbox" className="bp-check" />
                      </td>
                      <td>{b.dueDate}</td>
                      <td>
                        <StatusBadge status={b.status} />
                      </td>
                      <td>
                        <div className="bp-recip">
                          <span className="mono bp-recip-mono">
                            {b.monogram}
                          </span>
                          {b.recipient}
                        </div>
                      </td>
                      <td className="num tnum">{money(b.amount)}</td>
                      <td className="muted">{b.invoiceNo}</td>
                      <td className="muted bp-row-last">
                        <span className="bp-row-updated">{b.lastUpdated}</span>
                        <span className="bp-row-actions">
                          <button
                            type="button"
                            className="bp-row-trash"
                            aria-label="Delete bill"
                            onClick={() => removeBill(b.id)}
                          >
                            <Trash width={14} height={14} />
                          </button>
                          <button type="button" className="bp-row-review">
                            Review
                            <Chevron
                              width={12}
                              height={12}
                              style={{ transform: "rotate(-90deg)" }}
                            />
                          </button>
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {settingsOpen && (
        <SettingsPanel
          email={forwardingEmail}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  );
}

/* ====================================================================
   Pieces
   ==================================================================== */
function StatCard({
  value,
  label,
  sub,
  tone,
}: {
  value: ReactNode;
  label: string;
  sub: string;
  tone?: "warn";
}) {
  return (
    <div className={`bp-stat ${tone === "warn" ? "is-warn" : ""}`}>
      <div className="bp-stat-value tnum">{value}</div>
      <div className="bp-stat-label">{label}</div>
      <div className="bp-stat-sub tnum">{sub}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: Bill["status"] }) {
  const copy: Record<Bill["status"], string> = {
    overdue: "Overdue",
    pending: "Pending",
    scheduled: "Scheduled",
    paid: "Paid",
  };
  return <span className={`bp-badge bp-badge-${status}`}>{copy[status]}</span>;
}

function SortArrow() {
  return (
    <Chevron
      width={10}
      height={10}
      style={{ marginLeft: 2, color: "var(--fg-faint)" }}
    />
  );
}

function StatusFilter({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const options = ["All statuses", "Overdue", "Pending", "Scheduled", "Paid"];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div className="bp-filter" ref={ref}>
      <button
        type="button"
        className="bp-filter-btn"
        onClick={() => setOpen((o) => !o)}
      >
        Status: <strong>{value}</strong>
        <Chevron
          width={12}
          height={12}
          style={{
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.14s ease",
          }}
        />
      </button>
      {open && (
        <ul className="bp-filter-menu" role="menu">
          {options.map((o) => (
            <li key={o}>
              <button
                type="button"
                role="menuitem"
                className={`bp-filter-item ${o === value ? "is-selected" : ""}`}
                onClick={() => {
                  onChange(o);
                  setOpen(false);
                }}
              >
                {o}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ====================================================================
   Settings panel
   ==================================================================== */
function SettingsPanel({
  email,
  onClose,
}: {
  email: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const rules = [
    "If amount is less than $100.00 require approval from Any admin",
    "If amount is greater or equal to $100.00 and less than $250.00 require approval from Any admin and require approval from John Jackman",
    "If amount is greater or equal to $250.00 require approval from Any admin and require approval from John Jackman and require approval from Jessica Awad or Mary Metcalfe",
  ];

  function copyEmail() {
    navigator.clipboard?.writeText(email);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <div className="bp-sheet-overlay" onClick={onClose}>
      <div
        className="bp-sheet"
        role="dialog"
        aria-label="Bill Pay settings"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bp-sheet-head">
          <div>
            <h2 className="bp-sheet-title">Bill Pay settings</h2>
            <p className="bp-sheet-sub">
              Any changes will also apply to the Payments dashboard.
            </p>
          </div>
          <button
            type="button"
            className="bp-close"
            aria-label="Close"
            onClick={onClose}
          >
            <Close width={18} height={18} />
          </button>
        </div>

        <div className="bp-sheet-body">
          <section className="bp-section">
            <div className="bp-section-head">
              <h3 className="bp-section-title">Bill forwarding email</h3>
              <button type="button" className="bp-link">Edit</button>
            </div>
            <p className="bp-section-sub">
              Bills that are forwarded to this email will automatically show up in your inbox.
            </p>
            <div className="bp-section-row">
              <input className="bp-input" value={email} readOnly />
              <button
                type="button"
                className="bp-input-copy"
                aria-label="Copy"
                onClick={copyEmail}
              >
                <Copy width={14} height={14} />
              </button>
            </div>
            <p className="bp-section-foot">
              Control which email forwarding alerts you receive.{" "}
              <button type="button" className="bp-link bp-link-inline">
                Manage
              </button>
            </p>
            {copied && <span className="bp-toast">Copied</span>}
          </section>

          <section className="bp-section">
            <div className="bp-section-head">
              <h3 className="bp-section-title">Approval rules</h3>
              <button type="button" className="bp-link">Edit</button>
            </div>
            <ul className="bp-rules">
              {rules.map((r, i) => (
                <li key={i} className="bp-rule">
                  <span className="bp-rule-ico">
                    <AlertCircle width={14} height={14} />
                  </span>
                  {r}
                </li>
              ))}
            </ul>
          </section>

          <section className="bp-section">
            <div className="bp-section-head">
              <h3 className="bp-section-title">Approved senders</h3>
              <button type="button" className="bp-link">Edit</button>
            </div>
            <p className="bp-section-sub">
              Add trusted recipient emails to spot bills from known senders. Emails from unknown recipients will land in your inbox but be flagged for review.
            </p>
            <div className="bp-approved">
              <span className="bp-approved-ico">
                <Bolt width={13} height={13} />
              </span>
              19 approved senders
            </div>
          </section>

          <section className="bp-section bp-section-last">
            <div className="bp-section-head">
              <h3 className="bp-section-title">Accounting sync</h3>
              <button type="button" className="bp-link">Connect</button>
            </div>
            <p className="bp-section-sub">
              Close your books faster by connecting your accounting software.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
