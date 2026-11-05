import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, DragEvent, ReactNode } from "react";
import { BRAND, accounts } from "../data";
import { money } from "../format";
import Wordmark from "../components/Wordmark";
import AccountMark from "../components/icons/AccountMark";
import {
  AlertCircle,
  ArrowLeft,
  BankIcon,
  Check,
  CheckCircle,
  CheckIcon,
  Chevron,
  Close,
  MessageSquare,
  Refresh,
} from "../components/icons/Icons";
import "./CheckDepositFlow.css";

type Step =
  | "getting-started"
  | "check-details"
  | "check-images"
  | "review"
  | "confirmation";

const STEPS: { key: Step; label: string }[] = [
  { key: "getting-started", label: "Getting started" },
  { key: "check-details", label: "Check details" },
  { key: "check-images", label: "Check images" },
  { key: "review", label: "Review" },
];

interface Props {
  onClose: () => void;
}

export default function CheckDepositFlow({ onClose }: Props) {
  const [step, setStep] = useState<Step>("getting-started");
  const [amount, setAmount] = useState("");
  const [from, setFrom] = useState("");
  const [note, setNote] = useState("");
  const [depositTo, setDepositTo] = useState<string>(accounts[2].id);
  const [frontImg, setFrontImg] = useState<string | null>(null);
  const [backImg, setBackImg] = useState<string | null>(null);

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

  const account = accounts.find((a) => a.id === depositTo) ?? accounts[0];

  return (
    <div className="cd-overlay" role="dialog" aria-label="Check deposit">
      <header className="cd-header">
        <div className="cd-brand">
          <Wordmark height={30} />
        </div>
        <button
          type="button"
          className="cd-close"
          aria-label="Close"
          onClick={onClose}
        >
          <Close width={20} height={20} />
        </button>
      </header>

      <div className="cd-scroll">
        {step === "getting-started" && (
          <GettingStarted
            onBack={onClose}
            onNext={() => setStep("check-details")}
          />
        )}

        {step === "check-details" && (
          <StepLayout current={step} onStepClick={setStep}>
            <CheckDetails
              amount={amount}
              from={from}
              note={note}
              depositTo={depositTo}
              onAmount={setAmount}
              onFrom={setFrom}
              onNote={setNote}
              onDepositTo={setDepositTo}
              onBack={() => setStep("getting-started")}
              onNext={() => setStep("check-images")}
            />
          </StepLayout>
        )}

        {step === "check-images" && (
          <StepLayout current={step} onStepClick={setStep}>
            <CheckImages
              frontImg={frontImg}
              backImg={backImg}
              onFront={setFrontImg}
              onBack={setBackImg}
              onPrev={() => setStep("check-details")}
              onNext={() => setStep("review")}
            />
          </StepLayout>
        )}

        {step === "review" && (
          <StepLayout current={step} onStepClick={setStep}>
            <ReviewStep
              amount={amount}
              from={from}
              note={note}
              account={account}
              frontImg={frontImg}
              backImg={backImg}
              onPrev={() => setStep("check-images")}
              onDeposit={() => setStep("confirmation")}
            />
          </StepLayout>
        )}

        {step === "confirmation" && (
          <Confirmation
            amount={amount}
            onAnother={() => {
              setStep("getting-started");
              setAmount("");
              setFrom("");
              setNote("");
              setFrontImg(null);
              setBackImg(null);
            }}
            onDashboard={onClose}
          />
        )}
      </div>
    </div>
  );
}

/* ====================================================================
   Shared step layout (sidebar stepper + right content)
   ==================================================================== */
function StepLayout({
  current,
  onStepClick,
  children,
}: {
  current: Step;
  onStepClick: (s: Step) => void;
  children: ReactNode;
}) {
  const currentIdx = STEPS.findIndex((s) => s.key === current);
  return (
    <div className="cd-layout">
      <aside className="cd-nav">
        {STEPS.map((s, i) => {
          const isActive = s.key === current;
          const isDone = i < currentIdx;
          const isReachable = i <= currentIdx;
          return (
            <button
              key={s.key}
              type="button"
              className={`cd-nav-step ${isActive ? "is-active" : ""} ${
                isDone ? "is-done" : ""
              }`}
              disabled={!isReachable}
              onClick={() => isReachable && onStepClick(s.key)}
            >
              {s.label}
            </button>
          );
        })}
      </aside>
      <main className="cd-main">{children}</main>
    </div>
  );
}

/* ====================================================================
   Step 1 — Getting started
   ==================================================================== */
function GettingStarted({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: () => void;
}) {
  const items = [
    {
      Icon: Refresh,
      text:
        "Deposited funds usually take 1 – 5 business days after review to appear in your account.",
    },
    {
      Icon: BankIcon,
      text:
        "Checks must be issued by a United States bank and be less than 180 days old from the stated date.",
    },
    {
      Icon: AlertCircle,
      text:
        "We do not accept e-checks, credit card checks, courtesy checks and temporary/starter checks.",
    },
    {
      Icon: MessageSquare,
      text: "More Questions? Check out our Help Center.",
    },
  ];
  return (
    <main className="cd-body cd-body-center">
      <h1 className="cd-title cd-title-center">Getting started</h1>
      <ul className="cd-info-list">
        {items.map((it, i) => (
          <li key={i} className="cd-info-row">
            <span className="cd-info-ico">
              <it.Icon width={18} height={18} />
            </span>
            <span className="cd-info-text">{it.text}</span>
          </li>
        ))}
      </ul>
      <div className="cd-foot cd-foot-center">
        <button type="button" className="cd-btn cd-btn-ghost" onClick={onBack}>
          <ArrowLeft width={14} height={14} />
          Go back
        </button>
        <button type="button" className="cd-btn cd-btn-accent" onClick={onNext}>
          Got it
        </button>
      </div>
    </main>
  );
}

/* ====================================================================
   Step 2 — Check details
   ==================================================================== */
function CheckDetails({
  amount,
  from,
  note,
  depositTo,
  onAmount,
  onFrom,
  onNote,
  onDepositTo,
  onBack,
  onNext,
}: {
  amount: string;
  from: string;
  note: string;
  depositTo: string;
  onAmount: (v: string) => void;
  onFrom: (v: string) => void;
  onNote: (v: string) => void;
  onDepositTo: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  function onAmountInput(e: ChangeEvent<HTMLInputElement>) {
    const v = e.target.value.replace(/[^0-9.]/g, "");
    const parts = v.split(".");
    const cleaned =
      parts.length <= 1 ? v : `${parts[0]}.${parts.slice(1).join("").slice(0, 2)}`;
    onAmount(cleaned);
  }
  const canNext = Boolean(amount && parseFloat(amount) > 0 && from.trim() && depositTo);
  return (
    <>
      <h1 className="cd-title">Check details</h1>

      <label className="cd-field">
        <span className="cd-label">Amount</span>
        <div className="cd-input-wrap">
          <span className="cd-input-prefix">$</span>
          <input
            className="cd-input cd-input-amount"
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={onAmountInput}
            autoFocus
          />
        </div>
      </label>

      <label className="cd-field">
        <span className="cd-label">From</span>
        <input
          className="cd-input"
          type="text"
          value={from}
          onChange={(e) => onFrom(e.target.value)}
          placeholder="Payer name"
        />
      </label>

      <label className="cd-field">
        <span className="cd-label">Add a note to yourself (optional)</span>
        <input
          className="cd-input"
          type="text"
          value={note}
          onChange={(e) => onNote(e.target.value)}
        />
      </label>

      <div className="cd-field">
        <span className="cd-label">Deposit to</span>
        <AccountPicker value={depositTo} onChange={onDepositTo} />
      </div>

      <div className="cd-foot">
        <button type="button" className="cd-btn cd-btn-ghost" onClick={onBack}>
          <ArrowLeft width={14} height={14} />
          Back
        </button>
        <button
          type="button"
          className="cd-btn cd-btn-accent"
          disabled={!canNext}
          onClick={onNext}
        >
          Next
          <Chevron
            width={14}
            height={14}
            style={{ transform: "rotate(-90deg)" }}
          />
        </button>
      </div>
    </>
  );
}

/* ====================================================================
   Step 3 — Check images
   ==================================================================== */
function CheckImages({
  frontImg,
  backImg,
  onFront,
  onBack,
  onPrev,
  onNext,
}: {
  frontImg: string | null;
  backImg: string | null;
  onFront: (url: string | null) => void;
  onBack: (url: string | null) => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const info = [
    { Icon: CheckIcon, text: "Sign the back of the check in permanent ink." },
    {
      Icon: BankIcon,
      text: `Write "${BRAND.name}, Incorporated" and "For mobile deposit only" below your signature.`,
    },
    {
      Icon: AlertCircle,
      text:
        "Take a well-lit picture on a dark background with all four corners visible and the routing number, account number, and check number clearly readable.",
    },
  ];
  const canNext = Boolean(frontImg && backImg);
  return (
    <>
      <h1 className="cd-title">Upload pictures</h1>

      <ul className="cd-info-list cd-info-list-compact">
        {info.map((it, i) => (
          <li key={i} className="cd-info-row">
            <span className="cd-info-ico">
              <it.Icon width={18} height={18} />
            </span>
            <span className="cd-info-text">{it.text}</span>
          </li>
        ))}
      </ul>

      <ImageDrop
        label="Upload a picture of the front of the check"
        value={frontImg}
        onChange={onFront}
      />
      <ImageDrop
        label="Upload a picture of the back of the check"
        value={backImg}
        onChange={onBack}
      />

      <div className="cd-foot">
        <button type="button" className="cd-btn cd-btn-ghost" onClick={onPrev}>
          <ArrowLeft width={14} height={14} />
          Back
        </button>
        <button
          type="button"
          className="cd-btn cd-btn-accent"
          disabled={!canNext}
          onClick={onNext}
        >
          Review
          <Chevron
            width={14}
            height={14}
            style={{ transform: "rotate(-90deg)" }}
          />
        </button>
      </div>
    </>
  );
}

function ImageDrop({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null;
  onChange: (url: string | null) => void;
}) {
  const [dragOver, setDragOver] = useState(false);
  const [rotation, setRotation] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  function readFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      onChange(String(e.target?.result ?? ""));
      setRotation(0);
    };
    reader.readAsDataURL(file);
  }

  function onPick(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) readFile(f);
    e.target.value = "";
  }
  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) readFile(f);
  }
  function onDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(true);
  }

  if (value) {
    return (
      <div className="cd-field">
        <span className="cd-label">{label}</span>
        <div className="cd-image-preview">
          <img
            src={value}
            alt=""
            style={{ transform: `rotate(${rotation}deg)` }}
          />
          <div className="cd-image-actions">
            <button
              type="button"
              className="cd-pill-btn"
              onClick={() => setRotation((r) => (r + 90) % 360)}
            >
              <Refresh width={14} height={14} />
              Rotate
            </button>
            <button
              type="button"
              className="cd-pill-btn"
              onClick={() => inputRef.current?.click()}
            >
              Replace
            </button>
            <button
              type="button"
              className="cd-pill-btn cd-pill-danger"
              onClick={() => onChange(null)}
            >
              Remove
            </button>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={onPick}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="cd-field">
      <span className="cd-label">{label}</span>
      <div
        className={`cd-dropzone ${dragOver ? "is-dragover" : ""}`}
        onClick={() => inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={() => setDragOver(false)}
        role="button"
        tabIndex={0}
      >
        <span className="cd-dropzone-ico">
          <BankIcon width={22} height={22} />
        </span>
        <span>
          <strong>Upload</strong> a picture of this side of the check.
        </span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={onPick}
        />
      </div>
    </div>
  );
}

/* ====================================================================
   Step 4 — Review
   ==================================================================== */
function ReviewStep({
  amount,
  from,
  note,
  account,
  frontImg,
  backImg,
  onPrev,
  onDeposit,
}: {
  amount: string;
  from: string;
  note: string;
  account: (typeof accounts)[number];
  frontImg: string | null;
  backImg: string | null;
  onPrev: () => void;
  onDeposit: () => void;
}) {
  const parsed = parseFloat(amount || "0");
  return (
    <>
      <h1 className="cd-title">Review check deposit</h1>

      <div className="cd-review-amount">
        <div className="cd-review-sub">Check deposit from {from || "—"}</div>
        <div className="cd-review-total tnum">
          {parsed > 0 ? money(parsed) : "$0.00"}
        </div>
        {note && <div className="cd-review-note">Note to yourself: {note}</div>}
      </div>

      <div className="cd-field">
        <span className="cd-label">Deposit to</span>
        <div className="cd-review-account">
          <span className="cd-picker-ico">
            <AccountMark width={28} height={28} />
          </span>
          <span className="cd-picker-text">
            <span className="cd-picker-title">{account.name}</span>
            <span className="cd-picker-sub">
              <span className="tnum">{money(account.balance)}</span>
              {account.sublabel && (
                <>
                  <span className="cd-picker-divider">/</span>
                  <span>{account.sublabel}</span>
                </>
              )}
            </span>
          </span>
        </div>
      </div>

      <div className="cd-field">
        <span className="cd-label">Check pictures</span>
        <div className="cd-review-images">
          {frontImg && (
            <img src={frontImg} alt="Front of check" className="cd-review-img" />
          )}
          {backImg && (
            <img src={backImg} alt="Back of check" className="cd-review-img" />
          )}
        </div>
      </div>

      <div className="cd-review-tip">
        <CheckCircle width={16} height={16} />
        <span>Please keep the check at least a week until it clears.</span>
      </div>
      <div className="cd-review-tip">
        <MessageSquare width={16} height={16} />
        <span>If we have any questions, we'll reach out via email.</span>
      </div>

      <div className="cd-foot">
        <button type="button" className="cd-btn cd-btn-ghost" onClick={onPrev}>
          <ArrowLeft width={14} height={14} />
          Back
        </button>
        <button type="button" className="cd-btn cd-btn-accent" onClick={onDeposit}>
          Deposit check
        </button>
      </div>
    </>
  );
}

/* ====================================================================
   Step 5 — Confirmation
   ==================================================================== */
function Confirmation({
  amount,
  onAnother,
  onDashboard,
}: {
  amount: string;
  onAnother: () => void;
  onDashboard: () => void;
}) {
  const parsed = parseFloat(amount || "0");
  // Simple "latest" ETA: today + 5 business days (demo).
  const eta = useEta(5);
  return (
    <main className="cd-body cd-body-center">
      <h1 className="cd-title cd-title-center">
        We're reviewing your <br />check deposit
      </h1>
      <p className="cd-sub">
        Once it's reviewed, the deposit should arrive in your account 1 to 5 business days.
      </p>

      <div className="cd-review-tip cd-conf-tip">
        <AlertCircle width={16} height={16} />
        <span>
          At the latest, your deposit should be available for use by:{" "}
          <strong>{eta}</strong>
        </span>
      </div>

      <div className="cd-conf-amount">
        <div className="cd-conf-amount-label">Check deposit from</div>
        <div className="cd-conf-amount-value tnum">
          {parsed > 0 ? money(parsed) : "$0.00"}
        </div>
      </div>

      <div className="cd-foot cd-foot-center">
        <button type="button" className="cd-btn cd-btn-ghost" onClick={onAnother}>
          Deposit another check
        </button>
        <button type="button" className="cd-btn cd-btn-accent" onClick={onDashboard}>
          Go to dashboard
        </button>
      </div>
    </main>
  );
}

function useEta(businessDays: number) {
  // Skip weekends.
  const d = new Date();
  let added = 0;
  while (added < businessDays) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) added++;
  }
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/* ====================================================================
   AccountPicker (shared)
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
    <div className="cd-picker" ref={ref}>
      <button
        type="button"
        className={`cd-picker-btn ${open ? "is-open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="cd-picker-ico">
          <AccountMark width={28} height={28} />
        </span>
        <span className="cd-picker-text">
          <span className="cd-picker-title">{selected.name}</span>
          <span className="cd-picker-sub">
            <span className="tnum">{money(selected.balance)}</span>
            {selected.sublabel && (
              <>
                <span className="cd-picker-divider">/</span>
                <span>{selected.sublabel}</span>
              </>
            )}
          </span>
        </span>
        <Chevron
          width={16}
          height={16}
          className="cd-picker-caret"
          style={{
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.14s ease",
          }}
        />
      </button>
      {open && (
        <ul className="cd-picker-list" role="listbox">
          {accounts.map((a) => (
            <li key={a.id}>
              <button
                type="button"
                role="option"
                aria-selected={a.id === value}
                className={`cd-picker-opt ${
                  a.id === value ? "is-selected" : ""
                }`}
                onClick={() => {
                  onChange(a.id);
                  setOpen(false);
                }}
              >
                <span className="cd-picker-ico">
                  <AccountMark width={28} height={28} />
                </span>
                <span className="cd-picker-text">
                  <span className="cd-picker-title">{a.name}</span>
                  <span className="cd-picker-sub">
                    <span className="tnum">{money(a.balance)}</span>
                    {a.sublabel && (
                      <>
                        <span className="cd-picker-divider">/</span>
                        <span>{a.sublabel}</span>
                      </>
                    )}
                  </span>
                </span>
                {a.id === value && (
                  <Check width={14} height={14} className="cd-picker-check" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
