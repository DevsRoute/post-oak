import { useEffect, useRef, useState } from "react";
import { BRAND, accounts } from "../data";
import { money } from "../format";
import type { Account } from "../types";
import Logo from "../components/Logo";
import AccountMark from "../components/icons/AccountMark";
import { useModal } from "./ModalContext";
import {
  AlertCircle,
  BankIcon,
  Chevron,
  ChevronRight,
  CheckIcon,
  Close,
  Copy,
  DownloadPdf,
  InvoiceIcon,
  SafeIcon,
  Send,
  WireIcon,
} from "../components/icons/Icons";
import "./DepositFlow.css";

interface Props {
  onClose: () => void;
}

type View = "methods" | "payment-details";

const ROUTING = "132456789";
const WIRE_DOMESTIC = {
  routingNumber: "132456789",
  accountNumber: "••••••1038",
  accountType: "Checking",
  beneficiaryName: `${BRAND.name}, Incorporated`,
  beneficiaryAddress:
    "2261 Market St, Suite 86807, San Francisco, CA 94114, United States",
  bankName: "Column n.a.",
  bankAddress:
    "1 Letterman Drive, Building A, Suite A4-700, San Francisco, CA 94129, United States",
};
const WIRE_INTL = {
  swift: "CLNOUS66MER",
  aba: "132456789",
  intermediarySwift: "CHASUS33XXX",
  iban: "3631271038",
};

export default function DepositFlow({ onClose }: Props) {
  const [view, setView] = useState<View>("methods");

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

  return (
    <div className="df-overlay" role="dialog" aria-label="Add funds">
      <header className="df-header">
        <div className="df-brand">
          <Logo size={26} />
          <span className="df-divider" />
          <span className="df-brand-name">{BRAND.name} Demo</span>
        </div>
        <button
          type="button"
          className="df-close"
          aria-label="Close"
          onClick={onClose}
        >
          <Close width={20} height={20} />
        </button>
      </header>

      <div className="df-scroll">
        {view === "methods" ? (
          <MethodsView onOpenDetails={() => setView("payment-details")} />
        ) : (
          <PaymentDetailsView onBack={() => setView("methods")} />
        )}
      </div>
    </div>
  );
}

/* ====================================================================
   Methods list
   ==================================================================== */

function MethodsView({ onOpenDetails }: { onOpenDetails: () => void }) {
  const modal = useModal();
  const [openId, setOpenId] = useState<string>("wire");
  const [acctId, setAcctId] = useState<string>(accounts[2].id); // Ops / Payroll
  const selected = accounts.find((a) => a.id === acctId) ?? accounts[0];

  function handleMethodClick(id: string, currentlyOpen: boolean) {
    if (id === "bank") {
      modal.open("transfer");
      return;
    }
    if (id === "check") {
      modal.open("check-deposit");
      return;
    }
    setOpenId(currentlyOpen ? "" : id);
  }

  const methods = [
    {
      id: "wire",
      Icon: WireIcon,
      title: "Wire Transfer",
      tag: "Fastest",
      time: "Arrives in 1–2 business days.",
    },
    {
      id: "bank",
      Icon: BankIcon,
      title: "Bank Transfer",
      tag: "Most common",
      time: "Arrives in 2–4 business days.",
    },
    {
      id: "check",
      Icon: CheckIcon,
      title: "Check Deposit",
      time: "Appears in 1 to 5 business days.",
    },
    { id: "invoice", Icon: InvoiceIcon, title: "Invoice" },
    { id: "safe", Icon: SafeIcon, title: "SAFE Investment" },
  ] as const;

  return (
    <main className="df-body">
      <h1 className="df-heading">Add funds to your accounts</h1>

      <section className="df-stack">
        {methods.map((m) => {
          const isOpen = openId === m.id;
          return (
            <article
              key={m.id}
              className={`df-method ${isOpen ? "is-open" : ""}`}
            >
              <button
                type="button"
                className="df-method-head"
                onClick={() => handleMethodClick(m.id, isOpen)}
                aria-expanded={isOpen}
              >
                <span className="df-method-ico">
                  <m.Icon width={18} height={18} />
                </span>
                <span className="df-method-meta">
                  <span className="df-method-title-row">
                    <span className="df-method-title">{m.title}</span>
                    {"tag" in m && m.tag && (
                      <span className="df-tag">{m.tag}</span>
                    )}
                  </span>
                  {"time" in m && m.time && (
                    <span className="df-method-time">{m.time}</span>
                  )}
                </span>
                {!isOpen && (
                  <ChevronRight
                    width={16}
                    height={16}
                    className="df-method-chev"
                  />
                )}
              </button>

              {isOpen && m.id === "wire" && (
                <div className="df-method-body">
                  <WireContent
                    account={selected}
                    onChangeAccount={setAcctId}
                    onOpenDetails={onOpenDetails}
                  />
                </div>
              )}
              {isOpen && m.id !== "wire" && (
                <div className="df-method-body df-empty">
                  Details for {m.title} would appear here.
                </div>
              )}
            </article>
          );
        })}
      </section>
    </main>
  );
}

function WireContent({
  account,
  onChangeAccount,
  onOpenDetails,
}: {
  account: Account;
  onChangeAccount: (id: string) => void;
  onOpenDetails: () => void;
}) {
  return (
    <div className="df-wire">
      <label className="df-label">Receiving account</label>
      <AccountPicker value={account.id} onChange={onChangeAccount} />

      <div className="df-wire-fields">
        <CopyField label="Routing number" value={ROUTING} />
        <CopyField
          label="Account number"
          value={WIRE_DOMESTIC.accountNumber}
          mask
        />
      </div>

      <div className="df-wire-actions">
        <button type="button" className="df-pill-btn">
          <Send width={14} height={14} />
          Wire instructions
        </button>
        <button type="button" className="df-link" onClick={onOpenDetails}>
          View more details
        </button>
      </div>
    </div>
  );
}

function CopyField({
  label,
  value,
  mask,
}: {
  label: string;
  value: string;
  mask?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  function onCopy() {
    navigator.clipboard?.writeText(value.replace(/[•]/g, ""));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }
  return (
    <div className="df-field">
      <span className="df-label">{label}</span>
      <div className="df-copy-wrap">
        <input
          className={`df-input ${mask ? "tnum" : ""}`}
          type="text"
          value={value}
          readOnly
        />
        <span className="tip-wrap">
          <button
            type="button"
            className="df-copy-btn"
            onClick={onCopy}
            aria-label={`Copy ${label}`}
          >
            <Copy width={14} height={14} />
          </button>
          <span className="tip tip-top-center">
            {copied ? "Copied" : "Click to copy"}
          </span>
        </span>
      </div>
    </div>
  );
}

/* ====================================================================
   Payment Details sub-view
   ==================================================================== */

function PaymentDetailsView({ onBack }: { onBack: () => void }) {
  const [acctId, setAcctId] = useState<string>(accounts[2].id);
  const [openSection, setOpenSection] = useState<"domestic" | "intl" | null>(
    "intl"
  );

  return (
    <div className="df-pd">
      <aside className="df-pd-nav">
        <button
          type="button"
          className="df-pd-step"
          onClick={onBack}
        >
          Choose method
        </button>
        <button type="button" className="df-pd-step is-active">
          Payment details
        </button>
      </aside>

      <main className="df-pd-main">
        <div className="df-pd-head">
          <h1 className="df-pd-title">Payment details</h1>
          <button type="button" className="df-pd-pdf">
            Download as PDF
            <DownloadPdf width={14} height={14} />
          </button>
        </div>

        <div className="df-pd-banner" role="status">
          <AlertCircle width={16} height={16} />
          <span>
            The details shown here are only an example. Please visit your own,
            real dashboard to see the wire details for your account.
          </span>
        </div>

        <div className="df-pd-select">
          <AccountPicker value={acctId} onChange={setAcctId} />
        </div>

        <div className="df-pd-section">
          <button
            type="button"
            className="df-pd-section-head"
            onClick={() =>
              setOpenSection(openSection === "domestic" ? null : "domestic")
            }
            aria-expanded={openSection === "domestic"}
          >
            <span>DOMESTIC TRANSFER DETAILS</span>
            <Chevron
              width={14}
              height={14}
              style={{
                transform:
                  openSection === "domestic" ? "rotate(180deg)" : "none",
                transition: "transform 0.14s ease",
                color: "var(--fg-muted)",
              }}
            />
          </button>
          {openSection === "domestic" && (
            <div className="df-pd-section-body">
              <DetailRow label="Routing number" value={WIRE_DOMESTIC.routingNumber} />
              <DetailRow
                label="Account number"
                value={WIRE_DOMESTIC.accountNumber}
              />
              <DetailRow label="Account type" value={WIRE_DOMESTIC.accountType} />
              <DetailRow
                label="Beneficiary name"
                value={WIRE_DOMESTIC.beneficiaryName}
              />
              <DetailRow
                label="Beneficiary address"
                value={WIRE_DOMESTIC.beneficiaryAddress}
                wrap
              />
              <DetailRow label="Bank name" value={WIRE_DOMESTIC.bankName} />
              <DetailRow
                label="Bank address"
                value={WIRE_DOMESTIC.bankAddress}
                wrap
              />
            </div>
          )}
        </div>

        <div className="df-pd-section">
          <button
            type="button"
            className="df-pd-section-head"
            onClick={() =>
              setOpenSection(openSection === "intl" ? null : "intl")
            }
            aria-expanded={openSection === "intl"}
          >
            <span>INTERNATIONAL WIRE DETAILS</span>
            <Chevron
              width={14}
              height={14}
              style={{
                transform: openSection === "intl" ? "rotate(180deg)" : "none",
                transition: "transform 0.14s ease",
                color: "var(--fg-muted)",
              }}
            />
          </button>
          {openSection === "intl" && (
            <div className="df-pd-section-body">
              <SectionLabel
                title="Receiving/Beneficiary Bank"
                sub="Section 57D – Account with institution"
              />
              <DetailRow label="SWIFT / BIC Code" value={WIRE_INTL.swift} />
              <DetailRow label="ABA Routing Number" value={WIRE_INTL.aba} />
              <DetailRow label="Bank Name" value={WIRE_DOMESTIC.bankName} />
              <DetailRow
                label="Bank Address"
                value={WIRE_DOMESTIC.bankAddress}
                wrap
              />

              <SectionLabel
                title="Intermediary Bank"
                sub="Section 56 – Intermediary institution"
              />
              <DetailRow
                label="SWIFT / BIC Code"
                value={WIRE_INTL.intermediarySwift}
              />

              <SectionLabel title="Beneficiary" sub="Section 59 – Recipient" />
              <DetailRow
                label="IBAN / Account Number"
                value={WIRE_INTL.iban}
              />
              <DetailRow
                label="Beneficiary Name"
                value={WIRE_DOMESTIC.beneficiaryName}
              />
              <DetailRow
                label="Beneficiary Address"
                value={WIRE_DOMESTIC.beneficiaryAddress}
                wrap
              />

              <div className="df-pd-note">
                <AlertCircle width={16} height={16} />
                <span>
                  Make sure to provide the beneficiary's address details to
                  avoid potential delays or rejections.
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="df-pd-foot">
          <button type="button" className="df-btn df-btn-ghost" onClick={onBack}>
            <Chevron
              width={14}
              height={14}
              style={{ transform: "rotate(90deg)" }}
            />
            Back
          </button>
          <button type="button" className="df-btn df-btn-accent">
            <Send width={14} height={14} />
            Share
          </button>
        </div>
      </main>
    </div>
  );
}

function SectionLabel({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="df-pd-sublabel">
      <div className="df-pd-sublabel-title">{title}</div>
      <div className="df-pd-sublabel-sub">{sub}</div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  wrap,
}: {
  label: string;
  value: string;
  wrap?: boolean;
}) {
  return (
    <div className="df-pd-row">
      <span className="df-pd-row-label">{label}</span>
      <span className={`df-pd-row-value ${wrap ? "wrap" : ""}`}>{value}</span>
    </div>
  );
}

/* ====================================================================
   Shared AccountPicker (Mercury-style trigger + dropdown)
   ==================================================================== */

function AccountPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = accounts.find((a) => a.id === value) ?? accounts[0];

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

  return (
    <div className="df-picker" ref={ref}>
      <button
        type="button"
        className={`df-picker-btn ${open ? "is-open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="df-picker-ico">
          <AccountMark width={28} height={28} />
        </span>
        <span className="df-picker-text">
          <span className="df-picker-title">{selected.name}</span>
          <span className="df-picker-sub">
            <span className="tnum">{money(selected.balance)}</span>
            {selected.sublabel && (
              <>
                <span className="df-picker-divider">/</span>
                <span>{selected.sublabel}</span>
              </>
            )}
          </span>
        </span>
        <Chevron
          width={16}
          height={16}
          className="df-picker-caret"
          style={{
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.14s ease",
          }}
        />
      </button>
      {open && (
        <ul className="df-picker-list" role="listbox">
          {accounts.map((a) => (
            <li key={a.id}>
              <button
                type="button"
                role="option"
                aria-selected={a.id === value}
                className={`df-picker-opt ${a.id === value ? "is-selected" : ""}`}
                onClick={() => {
                  onChange(a.id);
                  setOpen(false);
                }}
              >
                <span className="df-picker-ico">
                  <AccountMark width={28} height={28} />
                </span>
                <span className="df-picker-text">
                  <span className="df-picker-title">{a.name}</span>
                  <span className="df-picker-sub">
                    <span className="tnum">{money(a.balance)}</span>
                    {a.sublabel && (
                      <>
                        <span className="df-picker-divider">/</span>
                        <span>{a.sublabel}</span>
                      </>
                    )}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
