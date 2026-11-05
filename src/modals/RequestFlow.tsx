import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, KeyboardEvent as RKeyboardEvent, ReactNode } from "react";
import { BRAND, customers as seedCustomers } from "../data";
import type { Customer } from "../types";
import Logo from "../components/Logo";
import {
  ArrowLeft,
  ArrowSwap,
  Bolt,
  Chevron,
  Close,
  Deposit,
  Plus,
  Request as RequestIcon,
  Transfer,
} from "../components/icons/Icons";
import "./RequestFlow.css";

type Option = "one-time" | "recurring" | "link";
type View = "pick" | "add";

interface Props {
  onClose: () => void;
}

export default function RequestFlow({ onClose }: Props) {
  const [view, setView] = useState<View>("pick");
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [customerDraft, setCustomerDraft] = useState("");
  const [localCustomers, setLocalCustomers] = useState<Customer[]>([]);
  const [option, setOption] = useState<Option>("one-time");

  const allCustomers = useMemo(
    () => [...localCustomers, ...seedCustomers],
    [localCustomers]
  );

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

  const customer = allCustomers.find((c) => c.id === customerId);
  const canNext = Boolean(customer);

  function handleCustomerAdded(c: Customer) {
    setLocalCustomers((prev) => [c, ...prev]);
    setCustomerId(c.id);
    setCustomerDraft("");
    setView("pick");
  }

  return (
    <div className="rq-overlay" role="dialog" aria-label="Request money">
      <header className="rq-header">
        <div className="rq-brand">
          <Logo size={26} />
          <span className="rq-divider" />
          <span className="rq-brand-name">{BRAND.name} Demo</span>
        </div>
        <button
          type="button"
          className="rq-close"
          aria-label="Close"
          onClick={onClose}
        >
          <Close width={20} height={20} />
        </button>
      </header>

      <div className="rq-scroll">
        <div className="rq-grid">
          {view === "pick" ? (
            <section className="rq-left">
              <h1 className="rq-title">How would you like to request money?</h1>

              <CustomerCombobox
                value={customerId}
                draft={customerDraft}
                onDraft={setCustomerDraft}
                onChange={setCustomerId}
                customers={allCustomers}
                onRequestAdd={() => setView("add")}
              />

              <div className="rq-compare">
                <h2 className="rq-compare-title">Compare options</h2>

                <OptionCard
                  selected={option === "one-time"}
                  onSelect={() => setOption("one-time")}
                  title="Create a one-time invoice"
                  desc="Send a one-time invoice with a built-in payment link."
                />
                <OptionCard
                  selected={option === "recurring"}
                  onSelect={() => setOption("recurring")}
                  title="Create a recurring series"
                  desc="Automatically generate recurring invoices on a set schedule."
                />
                <OptionCard
                  selected={option === "link"}
                  onSelect={() => setOption("link")}
                  title="Request money without an invoice"
                  desc="Send only a payment link with a single amount."
                />
              </div>

              <div className="rq-foot">
                <button type="button" className="rq-btn rq-btn-ghost" onClick={onClose}>
                  <ArrowLeft width={14} height={14} />
                  Back
                </button>
                <button
                  type="button"
                  className="rq-btn rq-btn-accent"
                  disabled={!canNext}
                  onClick={onClose}
                >
                  Next
                  <Chevron
                    width={14}
                    height={14}
                    style={{ transform: "rotate(-90deg)" }}
                  />
                </button>
              </div>
            </section>
          ) : (
            <AddCustomerView
              draftName={customerDraft}
              onBack={() => setView("pick")}
              onSubmit={handleCustomerAdded}
            />
          )}

          <section className="rq-right">
            <div className="rq-preview">
              {option === "link" ? (
                <PaymentLinkPreview customerName={customer?.name} />
              ) : (
                <InvoicePreview
                  customerName={customer?.name}
                  recurring={option === "recurring"}
                />
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

/* ====================================================================
   Option card
   ==================================================================== */
function OptionCard({
  selected,
  onSelect,
  title,
  desc,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  desc: string;
}) {
  return (
    <button
      type="button"
      className={`rq-opt ${selected ? "is-selected" : ""}`}
      onClick={onSelect}
      aria-pressed={selected}
    >
      <span
        className={`rq-opt-radio ${selected ? "is-selected" : ""}`}
        aria-hidden="true"
      />
      <span className="rq-opt-text">
        <span className="rq-opt-title">{title}</span>
        <span className="rq-opt-desc">{desc}</span>
      </span>
    </button>
  );
}

/* ====================================================================
   Customer combobox
   ==================================================================== */
function CustomerCombobox({
  value,
  draft,
  onDraft,
  onChange,
  customers,
  onRequestAdd,
}: {
  value: string | null;
  draft: string;
  onDraft: (v: string) => void;
  onChange: (id: string | null) => void;
  customers: Customer[];
  onRequestAdd: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = customers.find((c) => c.id === value);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const filtered = useMemo(() => {
    if (!draft.trim()) return customers;
    return customers.filter((c) =>
      c.name.toLowerCase().includes(draft.toLowerCase())
    );
  }, [draft]);

  return (
    <div className="rq-combo" ref={ref}>
      <label className="rq-label" htmlFor="rq-combo-input">
        Name
      </label>
      {!open && selected ? (
        <button
          type="button"
          className="rq-combo-chip"
          onClick={() => setOpen(true)}
        >
          <span className="rq-opt-mono mono">{monogram(selected.name)}</span>
          <span className="rq-combo-name">{selected.name}</span>
          <Chevron
            width={14}
            height={14}
            className="rq-combo-caret"
            style={{ color: "var(--fg-muted)" }}
          />
        </button>
      ) : (
        <button
          type="button"
          className={`rq-combo-btn ${open ? "is-open" : ""}`}
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className="rq-combo-placeholder">
            {draft || "Select a customer"}
          </span>
          <Chevron
            width={14}
            height={14}
            className="rq-combo-caret"
            style={{
              color: "var(--fg-muted)",
              transform: open ? "rotate(180deg)" : "none",
              transition: "transform 0.14s ease",
            }}
          />
        </button>
      )}

      {open && (
        <div className="rq-combo-panel" role="listbox">
          <input
            id="rq-combo-input"
            className="rq-combo-input"
            placeholder="Select a customer"
            value={draft}
            onChange={(e) => onDraft(e.target.value)}
            autoFocus
          />
          <button
            type="button"
            className="rq-combo-add"
            onClick={() => {
              setOpen(false);
              onRequestAdd();
            }}
          >
            <span className="rq-opt-mono mono rq-combo-add-ico">
              <Plus width={12} height={12} />
            </span>
            Add new customer
          </button>
          <ul className="rq-combo-list">
            {filtered.length === 0 ? (
              <li className="rq-combo-empty">No matches</li>
            ) : (
              filtered.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={c.id === value}
                    className={`rq-combo-opt ${
                      c.id === value ? "is-selected" : ""
                    }`}
                    onClick={() => {
                      onChange(c.id);
                      onDraft("");
                      setOpen(false);
                    }}
                  >
                    <span className="rq-opt-mono mono">{monogram(c.name)}</span>
                    <span className="rq-combo-info">
                      <span className="rq-combo-name">{c.name}</span>
                      <span className="rq-combo-email">{c.email}</span>
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

function monogram(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

/* ====================================================================
   Previews
   ==================================================================== */
function PreviewFrame({ children }: { children: ReactNode }) {
  return (
    <div className="rq-prev-frame">
      <div className="rq-prev-bar">
        <span className="rq-prev-dot" />
        <span className="rq-prev-dot" />
        <span className="rq-prev-dot" />
        <span className="rq-prev-url">
          <span className="rq-prev-lock">🔒</span>
          {BRAND.name.toLowerCase().replace(/\s+/g, "")}.com
        </span>
        <span className="rq-prev-reload">↻</span>
      </div>
      <div className="rq-prev-body">{children}</div>
    </div>
  );
}

function InvoicePreview({
  customerName,
  recurring,
}: {
  customerName?: string;
  recurring?: boolean;
}) {
  return (
    <PreviewFrame>
      <div className="rq-inv">
        <div className="rq-inv-top">
          <span className="rq-inv-label">Invoice</span>
          <div className="rq-inv-top-icons">
            <span />
            <span />
            <span />
          </div>
        </div>
        <div className="rq-inv-meta">
          <div>
            <span className="rq-inv-k">From</span>
            <span className="rq-inv-v">{BRAND.name}</span>
            <span className="rq-inv-v rq-inv-v-muted">
              2201 Market St, Suite 86807
            </span>
            <span className="rq-inv-v rq-inv-v-muted">
              San Francisco, CA 94114
            </span>
            <span className="rq-inv-v rq-inv-v-muted">United States</span>
            <span className="rq-inv-v rq-inv-v-muted">Tax ID: 123456789</span>
          </div>
          <div>
            <span className="rq-inv-k">To</span>
            <span className="rq-inv-v">
              {customerName ?? "Your customer"}
            </span>
            <span className="rq-inv-v rq-inv-v-muted">accounts@email.co</span>
            <span className="rq-inv-k rq-inv-k-small">Details</span>
            <span className="rq-inv-v rq-inv-v-muted">Invoice no.</span>
            <span className="rq-inv-v rq-inv-v-muted">P.O. no.</span>
          </div>
        </div>

        <div className="rq-inv-table">
          <div className="rq-inv-table-head">
            <span>Item</span>
            <span>Quantity</span>
            <span>Unit price</span>
            <span>Total</span>
          </div>
          <div className="rq-inv-table-row">
            <span className="rq-inv-table-title">
              {BRAND.name.split(" ")[0]} Consulting Group sent
            </span>
            <span />
            <span />
            <span>you an invoice</span>
          </div>
          <div className="rq-inv-table-total">
            <span>Total</span>
            <span className="rq-inv-table-amt tnum">$0.00</span>
          </div>
        </div>

        <div className="rq-inv-footer">
          <div className="rq-inv-footer-col">
            <span className="rq-inv-k">Terms</span>
            <span className="rq-inv-k">Memo</span>
          </div>
          <div className="rq-inv-footer-col">
            <span className="rq-inv-k">
              {recurring ? "Recurring invoice" : "Invoice date"}
            </span>
            <span className="rq-inv-k">Due date</span>
            <span className="rq-inv-k">Service period</span>
            <span className="rq-inv-k">Pay via</span>
            <span className="rq-inv-v rq-inv-v-muted">Manual transfer. Pay by</span>
            <span className="rq-inv-v rq-inv-v-muted">{BRAND.name}</span>
          </div>
        </div>
      </div>
    </PreviewFrame>
  );
}

/* ====================================================================
   Add customer view (left column)
   ==================================================================== */
function AddCustomerView({
  draftName,
  onBack,
  onSubmit,
}: {
  draftName: string;
  onBack: () => void;
  onSubmit: (c: Customer) => void;
}) {
  const [name, setName] = useState(draftName);
  const [email, setEmail] = useState("");
  const [extraOpen, setExtraOpen] = useState(false);
  const [extraEmails, setExtraEmails] = useState<string[]>([]);
  const [extraDraft, setExtraDraft] = useState("");
  const [addressOn, setAddressOn] = useState(false);
  const [addr, setAddr] = useState({
    line1: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const emailOk = /^\S+@\S+\.\S+$/.test(email);
  const canSubmit = name.trim().length > 0 && emailOk;

  function addExtra() {
    const v = extraDraft.trim();
    if (!v || !/^\S+@\S+\.\S+$/.test(v)) return;
    setExtraEmails((prev) => [...prev, v]);
    setExtraDraft("");
  }
  function onExtraKey(e: RKeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addExtra();
    }
  }
  function removeExtra(i: number) {
    setExtraEmails((prev) => prev.filter((_, idx) => idx !== i));
  }
  function onAddr(k: keyof typeof addr) {
    return (e: ChangeEvent<HTMLInputElement>) =>
      setAddr((prev) => ({ ...prev, [k]: e.target.value }));
  }

  function handleSubmit() {
    if (!canSubmit) return;
    onSubmit({
      id: `local-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
    });
  }

  return (
    <section className="rq-left">
      <h1 className="rq-title">Add customer</h1>

      <label className="rq-field">
        <span className="rq-label">Name</span>
        <input
          className="rq-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
      </label>

      <label className="rq-field">
        <span className="rq-label">Primary customer email</span>
        <input
          className="rq-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>

      <div className="rq-field">
        <button
          type="button"
          className="rq-disclosure"
          onClick={() => setExtraOpen((o) => !o)}
          aria-expanded={extraOpen}
        >
          <span className="rq-label rq-label-row">
            Additional emails (optional)
          </span>
          <Chevron
            width={14}
            height={14}
            style={{
              transform: extraOpen ? "rotate(180deg)" : "none",
              transition: "transform 0.14s ease",
              color: "var(--fg-muted)",
            }}
          />
        </button>
        {extraOpen && (
          <div className="rq-chip-wrap">
            {extraEmails.map((e, i) => (
              <span key={i} className="rq-chip">
                {e}
                <button
                  type="button"
                  className="rq-chip-x"
                  onClick={() => removeExtra(i)}
                  aria-label={`Remove ${e}`}
                >
                  <Close width={10} height={10} />
                </button>
              </span>
            ))}
            <input
              className="rq-chip-input"
              placeholder="name@company.com"
              value={extraDraft}
              onChange={(e) => setExtraDraft(e.target.value)}
              onKeyDown={onExtraKey}
              onBlur={addExtra}
            />
          </div>
        )}
      </div>

      <button
        type="button"
        className="rq-toggle-row"
        onClick={() => setAddressOn((a) => !a)}
        aria-pressed={addressOn}
      >
        <span className={`rq-switch ${addressOn ? "is-on" : ""}`} aria-hidden="true">
          <span className="rq-switch-knob" />
        </span>
        Add customer address
      </button>

      {addressOn && (
        <div className="rq-addr">
          <label className="rq-field">
            <span className="rq-label">Street</span>
            <input
              className="rq-input"
              value={addr.line1}
              onChange={onAddr("line1")}
            />
          </label>
          <div className="rq-addr-grid">
            <label className="rq-field">
              <span className="rq-label">City</span>
              <input
                className="rq-input"
                value={addr.city}
                onChange={onAddr("city")}
              />
            </label>
            <label className="rq-field">
              <span className="rq-label">State / Province</span>
              <input
                className="rq-input"
                value={addr.state}
                onChange={onAddr("state")}
              />
            </label>
            <label className="rq-field">
              <span className="rq-label">ZIP / Postal code</span>
              <input
                className="rq-input"
                value={addr.zip}
                onChange={onAddr("zip")}
              />
            </label>
            <label className="rq-field">
              <span className="rq-label">Country</span>
              <input
                className="rq-input"
                value={addr.country}
                onChange={onAddr("country")}
              />
            </label>
          </div>
        </div>
      )}

      <div className="rq-foot rq-foot-center">
        <button type="button" className="rq-btn rq-btn-ghost" onClick={onBack}>
          <ArrowLeft width={14} height={14} />
          Back
        </button>
        <button
          type="button"
          className="rq-btn rq-btn-accent"
          disabled={!canSubmit}
          onClick={handleSubmit}
        >
          Add customer
          <Chevron
            width={14}
            height={14}
            style={{ transform: "rotate(-90deg)" }}
          />
        </button>
      </div>
    </section>
  );
}

function PaymentLinkPreview({ customerName }: { customerName?: string }) {
  return (
    <PreviewFrame>
      <div className="rq-pl">
        <div className="rq-pl-body">
          <h3 className="rq-pl-heading">
            {BRAND.name} Demo sent {customerName ?? "you"} a payment link
          </h3>
          <div className="rq-pl-amount tnum">$0.00</div>

          <div className="rq-pl-section-label">Payment methods</div>
          <ul className="rq-pl-methods">
            <li className="rq-pl-method">
              <span className="rq-pl-method-ico">
                <Bolt width={14} height={14} />
              </span>
              Pay With {BRAND.name.split(" ")[0]}
            </li>
            <li className="rq-pl-method">
              <span className="rq-pl-method-ico">
                <Transfer width={14} height={14} />
              </span>
              Manual Transfer
            </li>
            <li className="rq-pl-method">
              <span className="rq-pl-method-ico">
                <ArrowSwap width={14} height={14} />
              </span>
              International Wire
            </li>
          </ul>
        </div>
      </div>
      {/* Silence unused-icon warnings by referencing them in a no-op */}
      <div style={{ display: "none" }}>
        <RequestIcon />
        <Deposit />
      </div>
    </PreviewFrame>
  );
}
