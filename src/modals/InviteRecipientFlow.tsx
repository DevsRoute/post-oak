import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, DragEvent, KeyboardEvent as RKE, ReactNode } from "react";
import { BRAND, accounts } from "../data";
import { money } from "../format";
import Logo from "../components/Logo";
import AccountMark from "../components/icons/AccountMark";
import {
  ArrowLeft,
  Check,
  Chevron,
  Close,
  FileAttach,
  FileUpload,
  Plus,
} from "../components/icons/Icons";
import "./InviteRecipientFlow.css";

type BaseStep =
  | "invite"
  | "amount"
  | "purpose"
  | "additional"
  | "review";
type Step = BaseStep | "details";

const PURPOSES = [
  "Employee",
  "Contractor",
  "Vendor",
  "Landlord",
  "Transferring to subsidiary",
  "Other",
];

const METHOD_OPTIONS = [
  "ACH",
  "Check",
  "Wire",
  "International Wire",
  "RTP",
];

const NAME_SUGGESTIONS = [
  `${BRAND.name}, Incorporated`,
  `Charlie Tuna, Incorporated`,
  `Universe, Incorporated`,
  `${BRAND.name} Demo`,
];

interface Props {
  onClose: () => void;
}

export default function InviteRecipientFlow({ onClose }: Props) {
  /* -------- shared state across steps -------- */
  const [step, setStep] = useState<Step>("invite");

  // Step 1
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [methods, setMethods] = useState<string[]>(["ACH", "Check", "Wire"]);
  const [displayName, setDisplayName] = useState("");
  const [requireTax, setRequireTax] = useState(false);
  const [setupNow, setSetupNow] = useState(true);

  // Step 2
  const [amount, setAmount] = useState("");
  const [sendFromId, setSendFromId] = useState<string>(accounts[2].id);

  // Step 3
  const [purpose, setPurpose] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState(false);

  // Step 4 (conditional Wire details)
  const [detailsDesc, setDetailsDesc] = useState("");
  const [detailsLink, setDetailsLink] = useState("");
  const [detailsFiles, setDetailsFiles] = useState<File[]>([]);

  // Step 5 (Additional info)
  const [externalMemo, setExternalMemo] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [internalNote, setInternalNote] = useState("");

  const steps = useMemo<{ key: Step; label: string }[]>(() => {
    const base: { key: Step; label: string }[] = [
      { key: "invite", label: "Invite recipient" },
      { key: "amount", label: "Amount & source" },
      { key: "purpose", label: "Wire purpose" },
    ];
    if (additionalDetails) base.push({ key: "details", label: "Wire details" });
    base.push({ key: "additional", label: "Additional info" });
    base.push({ key: "review", label: "Review" });
    return base;
  }, [additionalDetails]);

  const currentIdx = steps.findIndex((s) => s.key === step);

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

  function goBack() {
    if (currentIdx > 0) setStep(steps[currentIdx - 1].key);
  }
  function goNext() {
    if (currentIdx < steps.length - 1) setStep(steps[currentIdx + 1].key);
  }

  /* -------- amount helpers -------- */
  function onAmount(e: ChangeEvent<HTMLInputElement>) {
    const v = e.target.value.replace(/[^0-9.]/g, "");
    const parts = v.split(".");
    const cleaned =
      parts.length <= 1 ? v : `${parts[0]}.${parts.slice(1).join("").slice(0, 2)}`;
    setAmount(cleaned);
  }
  const parsedAmount = parseFloat(amount || "0");
  const sendFrom = accounts.find((a) => a.id === sendFromId) ?? accounts[0];

  /* -------- gating -------- */
  const canInvite = name.trim() && /^\S+@\S+\.\S+$/.test(email) && methods.length > 0;
  const canAmount = parsedAmount > 0 && Boolean(sendFromId);
  const canPurpose = Boolean(purpose);

  function nextDisabled(): boolean {
    switch (step) {
      case "invite":
        return !canInvite;
      case "amount":
        return !canAmount;
      case "purpose":
        return !canPurpose;
      default:
        return false;
    }
  }

  return (
    <div className="ir-overlay" role="dialog" aria-label="Invite recipient">
      <header className="ir-header">
        <div className="ir-brand">
          <Logo size={26} />
          <span className="ir-divider" />
          <span className="ir-brand-name">{BRAND.name} Demo</span>
        </div>
        <button
          type="button"
          className="ir-close"
          aria-label="Close"
          onClick={onClose}
        >
          <Close width={20} height={20} />
        </button>
      </header>

      <div className="ir-scroll">
        <div className="ir-layout">
          <aside className="ir-nav">
            {steps.map((s, i) => {
              const isActive = s.key === step;
              const isReachable = i <= currentIdx;
              return (
                <button
                  key={s.key}
                  type="button"
                  className={`ir-nav-step ${isActive ? "is-active" : ""} ${
                    i < currentIdx ? "is-done" : ""
                  }`}
                  disabled={!isReachable}
                  onClick={() => isReachable && setStep(s.key)}
                >
                  {s.label}
                </button>
              );
            })}
          </aside>

          <main className="ir-main">
            {step === "invite" && (
              <InviteStep
                name={name}
                email={email}
                methods={methods}
                displayName={displayName}
                requireTax={requireTax}
                setupNow={setupNow}
                onName={setName}
                onEmail={setEmail}
                onMethods={setMethods}
                onDisplayName={setDisplayName}
                onRequireTax={setRequireTax}
                onSetupNow={setSetupNow}
              />
            )}
            {step === "amount" && (
              <AmountStep
                amount={amount}
                onAmount={onAmount}
                sendFromId={sendFromId}
                onSendFrom={setSendFromId}
              />
            )}
            {step === "purpose" && (
              <PurposeStep
                purpose={purpose}
                onPurpose={setPurpose}
                additional={additionalDetails}
                onAdditional={setAdditionalDetails}
              />
            )}
            {step === "details" && (
              <DetailsStep
                desc={detailsDesc}
                onDesc={setDetailsDesc}
                link={detailsLink}
                onLink={setDetailsLink}
                files={detailsFiles}
                onFiles={setDetailsFiles}
              />
            )}
            {step === "additional" && (
              <AdditionalStep
                memo={externalMemo}
                onMemo={setExternalMemo}
                files={attachments}
                onFiles={setAttachments}
                note={internalNote}
                onNote={setInternalNote}
              />
            )}
            {step === "review" && (
              <ReviewStep
                name={name}
                email={email}
                amount={parsedAmount}
                sendFromName={sendFrom.name}
                memo={externalMemo}
                files={attachments}
                note={internalNote}
                onRemoveFile={(i) =>
                  setAttachments((prev) => prev.filter((_, idx) => idx !== i))
                }
              />
            )}

            <div className="ir-foot">
              {currentIdx === 0 ? (
                <button type="button" className="ir-btn ir-btn-ghost" onClick={onClose}>
                  <ArrowLeft width={14} height={14} />
                  Go back
                </button>
              ) : (
                <button type="button" className="ir-btn ir-btn-ghost" onClick={goBack}>
                  <ArrowLeft width={14} height={14} />
                  Back
                </button>
              )}
              {step === "review" ? (
                <button type="button" className="ir-btn ir-btn-accent" onClick={onClose}>
                  Queue payment
                </button>
              ) : step === "additional" ? (
                <button
                  type="button"
                  className="ir-btn ir-btn-accent"
                  onClick={goNext}
                >
                  Review
                  <Chevron
                    width={14}
                    height={14}
                    style={{ transform: "rotate(-90deg)" }}
                  />
                </button>
              ) : (
                <button
                  type="button"
                  className="ir-btn ir-btn-accent"
                  onClick={goNext}
                  disabled={nextDisabled()}
                >
                  Next
                  <Chevron
                    width={14}
                    height={14}
                    style={{ transform: "rotate(-90deg)" }}
                  />
                </button>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

/* ====================================================================
   Step 1 — Invite recipient
   ==================================================================== */
function InviteStep({
  name,
  email,
  methods,
  displayName,
  requireTax,
  setupNow,
  onName,
  onEmail,
  onMethods,
  onDisplayName,
  onRequireTax,
  onSetupNow,
}: {
  name: string;
  email: string;
  methods: string[];
  displayName: string;
  requireTax: boolean;
  setupNow: boolean;
  onName: (v: string) => void;
  onEmail: (v: string) => void;
  onMethods: (v: string[]) => void;
  onDisplayName: (v: string) => void;
  onRequireTax: (v: boolean) => void;
  onSetupNow: (v: boolean) => void;
}) {
  const [addOpen, setAddOpen] = useState(false);
  const [nameOpen, setNameOpen] = useState(false);
  const nameRef = useRef<HTMLDivElement>(null);
  const addRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!nameOpen && !addOpen) return;
    const onDown = (e: MouseEvent) => {
      if (nameOpen && !nameRef.current?.contains(e.target as Node)) setNameOpen(false);
      if (addOpen && !addRef.current?.contains(e.target as Node)) setAddOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [nameOpen, addOpen]);

  function removeMethod(m: string) {
    onMethods(methods.filter((x) => x !== m));
  }
  function addMethod(m: string) {
    if (!methods.includes(m)) onMethods([...methods, m]);
    setAddOpen(false);
  }

  const availableMethods = METHOD_OPTIONS.filter((m) => !methods.includes(m));

  return (
    <>
      <h1 className="ir-title">Invite recipient</h1>
      <p className="ir-sub">
        We'll email your recipient a secure form to enter their payment details.
        In the meantime, you can finish setting up the payment so it can process
        as soon as they submit their info.
      </p>
      <button type="button" className="ir-link">
        Want to invite multiple recipients? Import a CSV
      </button>

      <label className="ir-field">
        <span className="ir-label">Name</span>
        <input
          className="ir-input"
          value={name}
          onChange={(e) => onName(e.target.value)}
          autoFocus
        />
      </label>

      <label className="ir-field">
        <span className="ir-label">Email address</span>
        <input
          className="ir-input"
          type="email"
          value={email}
          onChange={(e) => onEmail(e.target.value)}
        />
      </label>

      <div className="ir-field" ref={addRef}>
        <span className="ir-label">Possible payment methods</span>
        <div className="ir-chip-row">
          {methods.map((m) => (
            <span key={m} className="ir-chip">
              {m}
              <button
                type="button"
                className="ir-chip-x"
                aria-label={`Remove ${m}`}
                onClick={() => removeMethod(m)}
              >
                <Close width={11} height={11} />
              </button>
            </span>
          ))}
          {availableMethods.length > 0 && (
            <div className="ir-chip-add-wrap">
              <button
                type="button"
                className="ir-chip-add"
                onClick={() => setAddOpen((o) => !o)}
                aria-label="Add method"
              >
                <Plus width={12} height={12} />
              </button>
              {addOpen && (
                <ul className="ir-chip-menu" role="menu">
                  {availableMethods.map((m) => (
                    <li key={m}>
                      <button
                        type="button"
                        role="menuitem"
                        className="ir-chip-menu-item"
                        onClick={() => addMethod(m)}
                      >
                        {m}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="ir-field" ref={nameRef}>
        <span className="ir-label">Name to show on the request</span>
        <div className="ir-input-wrap">
          <input
            className="ir-input"
            value={displayName}
            onChange={(e) => {
              onDisplayName(e.target.value);
              setNameOpen(true);
            }}
            onFocus={() => setNameOpen(true)}
          />
          <Chevron
            width={14}
            height={14}
            className="ir-input-caret"
            style={{
              transform: nameOpen ? "rotate(180deg)" : "none",
              transition: "transform 0.14s ease",
            }}
          />
        </div>
        {nameOpen && (
          <ul className="ir-menu" role="listbox">
            {NAME_SUGGESTIONS.filter(
              (s) =>
                !displayName ||
                s.toLowerCase().includes(displayName.toLowerCase())
            ).map((s) => (
              <li key={s}>
                <button
                  type="button"
                  role="option"
                  aria-selected={s === displayName}
                  className={`ir-menu-item ${s === displayName ? "is-selected" : ""}`}
                  onClick={() => {
                    onDisplayName(s);
                    setNameOpen(false);
                  }}
                >
                  {s}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <label className="ir-check-row">
        <input
          type="checkbox"
          className="ir-check"
          checked={requireTax}
          onChange={(e) => onRequireTax(e.target.checked)}
        />
        <span className="ir-check-text">
          <span>Require tax documents (W-9 or W-8BEN)</span>
        </span>
      </label>

      <label className="ir-check-row">
        <input
          type="checkbox"
          className="ir-check"
          checked={setupNow}
          onChange={(e) => onSetupNow(e.target.checked)}
        />
        <span className="ir-check-text">
          <span>Set up a payment now</span>
          <span className="ir-check-sub">
            It won't be sent until your recipient provides their details.
          </span>
        </span>
      </label>
    </>
  );
}

/* ====================================================================
   Step 2 — Amount & source
   ==================================================================== */
function AmountStep({
  amount,
  onAmount,
  sendFromId,
  onSendFrom,
}: {
  amount: string;
  onAmount: (e: ChangeEvent<HTMLInputElement>) => void;
  sendFromId: string;
  onSendFrom: (id: string) => void;
}) {
  return (
    <>
      <h1 className="ir-title">Amount & source</h1>
      <label className="ir-field">
        <span className="ir-label">Recipient gets</span>
        <div className="ir-input-wrap">
          <span className="ir-input-prefix">$</span>
          <input
            className="ir-input ir-input-amount"
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={onAmount}
            autoFocus
          />
        </div>
      </label>
      <div className="ir-field">
        <span className="ir-label">Send from</span>
        <AccountPicker value={sendFromId} onChange={onSendFrom} />
      </div>
      <p className="ir-sub">
        The payment will be sent after the recipient provides their information.
      </p>
    </>
  );
}

/* ====================================================================
   Step 3 — Wire purpose
   ==================================================================== */
function PurposeStep({
  purpose,
  onPurpose,
  additional,
  onAdditional,
}: {
  purpose: string;
  onPurpose: (v: string) => void;
  additional: boolean;
  onAdditional: (v: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <>
      <h1 className="ir-title">Wire purpose</h1>
      <div className="ir-field" ref={ref}>
        <span className="ir-label">Who or what is this payment for?</span>
        <button
          type="button"
          className={`ir-select ${open ? "is-open" : ""}`}
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <span className={purpose ? "" : "ir-input-placeholder"}>
            {purpose || " "}
          </span>
          <Chevron
            width={14}
            height={14}
            style={{
              marginLeft: "auto",
              color: "var(--fg-muted)",
              transform: open ? "rotate(180deg)" : "none",
              transition: "transform 0.14s ease",
            }}
          />
        </button>
        {open && (
          <ul className="ir-menu" role="listbox">
            {PURPOSES.map((p) => (
              <li key={p}>
                <button
                  type="button"
                  role="option"
                  aria-selected={p === purpose}
                  className={`ir-menu-item ${p === purpose ? "is-selected" : ""}`}
                  onClick={() => {
                    onPurpose(p);
                    setOpen(false);
                  }}
                >
                  {p}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <label className="ir-check-row">
        <input
          type="checkbox"
          className="ir-check"
          checked={additional}
          onChange={(e) => onAdditional(e.target.checked)}
        />
        <span className="ir-check-text">
          I'd like to provide additional information about this payment
        </span>
      </label>
    </>
  );
}

/* ====================================================================
   Step 4 — Wire details (conditional)
   ==================================================================== */
function DetailsStep({
  desc,
  onDesc,
  link,
  onLink,
  files,
  onFiles,
}: {
  desc: string;
  onDesc: (v: string) => void;
  link: string;
  onLink: (v: string) => void;
  files: File[];
  onFiles: (f: File[]) => void;
}) {
  return (
    <>
      <h1 className="ir-title">Wire details</h1>
      <label className="ir-field">
        <span className="ir-label">
          Detailed description of work the recipient did or reason for payment
        </span>
        <textarea
          className="ir-textarea"
          value={desc}
          maxLength={103}
          onChange={(e) => onDesc(e.target.value)}
          rows={3}
        />
        <span className="ir-char">{desc.length}/103 characters</span>
      </label>
      <label className="ir-field">
        <span className="ir-label">
          Website or LinkedIn profile for the recipient (if available)
        </span>
        <textarea
          className="ir-textarea"
          value={link}
          maxLength={299}
          onChange={(e) => onLink(e.target.value)}
          rows={3}
        />
        <span className="ir-char">{link.length}/299 characters</span>
      </label>
      <div className="ir-field">
        <span className="ir-label">
          Upload any other invoices, contracts, or supporting documents if you
          have them
        </span>
        <DropArea
          files={files}
          onAdd={(f) => onFiles([...files, ...f])}
          onRemove={(i) => onFiles(files.filter((_, idx) => idx !== i))}
        />
      </div>
    </>
  );
}

/* ====================================================================
   Step 5 — Additional info
   ==================================================================== */
function AdditionalStep({
  memo,
  onMemo,
  files,
  onFiles,
  note,
  onNote,
}: {
  memo: string;
  onMemo: (v: string) => void;
  files: File[];
  onFiles: (f: File[]) => void;
  note: string;
  onNote: (v: string) => void;
}) {
  return (
    <>
      <h1 className="ir-title">Additional info</h1>
      <label className="ir-field">
        <span className="ir-label">External memo</span>
        <input
          className="ir-input"
          value={memo}
          onChange={(e) => onMemo(e.target.value)}
        />
        <span className="ir-hint">
          For Further Credit, For Benefit Of, or info for the recipient
        </span>
      </label>
      <div className="ir-field">
        <span className="ir-label">Attachments</span>
        <DropArea
          files={files}
          onAdd={(f) => onFiles([...files, ...f])}
          onRemove={(i) => onFiles(files.filter((_, idx) => idx !== i))}
        />
      </div>
      <label className="ir-field">
        <span className="ir-label">Transaction note</span>
        <textarea
          className="ir-textarea"
          rows={2}
          value={note}
          onChange={(e) => onNote(e.target.value)}
        />
        <span className="ir-hint ir-hint-icon">
          <EyeOffSmall /> Not visible to the recipient
        </span>
      </label>
    </>
  );
}

/* ====================================================================
   Step 6 — Review
   ==================================================================== */
function ReviewStep({
  name,
  email,
  amount,
  sendFromName,
  memo,
  files,
  note,
  onRemoveFile,
}: {
  name: string;
  email: string;
  amount: number;
  sendFromName: string;
  memo: string;
  files: File[];
  note: string;
  onRemoveFile: (i: number) => void;
}) {
  return (
    <div className="ir-review">
      <div className="ir-review-head">
        <div className="ir-review-label">Queued payment to {name || "—"}</div>
        <div className="ir-review-amount tnum">
          {amount > 0 ? money(amount) : "$0.00"}
        </div>
        <div className="ir-review-pair">
          <div>
            <div className="ir-review-k">Bank</div>
            <div className="ir-review-v">Details Pending</div>
          </div>
          <div>
            <div className="ir-review-k">Address</div>
            <div className="ir-review-v">Details Pending</div>
          </div>
        </div>
      </div>

      <div className="ir-review-rule" />

      <div className="ir-review-block">
        <div className="ir-review-k">External memo</div>
        <div className="ir-review-v">{memo || "—"}</div>
      </div>

      {files.length > 0 && (
        <div className="ir-review-block">
          <div className="ir-review-k">Attachments</div>
          <ul className="ir-review-files">
            {files.map((f, i) => (
              <li key={`${f.name}-${i}`}>
                <FileAttach width={14} height={14} />
                <span className="ir-review-file-name">{f.name}</span>
                <button
                  type="button"
                  className="ir-review-file-x"
                  aria-label="Remove"
                  onClick={() => onRemoveFile(i)}
                >
                  <Close width={12} height={12} />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="ir-review-block">
        <div className="ir-review-k">Internal note</div>
        <div className="ir-review-v">{note || "—"}</div>
      </div>

      <div className="ir-review-rule" />

      <div className="ir-review-block">
        <div className="ir-review-k">Recipient details invite will be sent to:</div>
        <div className="ir-review-chip-row">
          <span className="ir-review-email-chip">{email || "—"}</span>
        </div>
      </div>

      <div className="ir-review-block">
        <div className="ir-review-k">Send from</div>
        <div className="ir-review-v">{sendFromName}</div>
      </div>
    </div>
  );
}

/* ====================================================================
   Pieces
   ==================================================================== */
function DropArea({
  files,
  onAdd,
  onRemove,
}: {
  files: File[];
  onAdd: (f: File[]) => void;
  onRemove: (i: number) => void;
}) {
  const [over, setOver] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  function pick(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) onAdd(Array.from(e.target.files));
    e.target.value = "";
  }
  function drop(e: DragEvent<HTMLButtonElement>) {
    e.preventDefault();
    setOver(false);
    if (e.dataTransfer.files) onAdd(Array.from(e.dataTransfer.files));
  }
  function over_(e: DragEvent<HTMLButtonElement>) {
    e.preventDefault();
    setOver(true);
  }
  return (
    <>
      <button
        type="button"
        className={`ir-drop ${over ? "is-over" : ""}`}
        onClick={() => ref.current?.click()}
        onDrop={drop}
        onDragOver={over_}
        onDragLeave={() => setOver(false)}
      >
        <span className="ir-drop-ico">
          <FileUpload width={20} height={20} />
        </span>
        <span>
          <strong>Drop file here or click to upload</strong>
          <br />
          <span className="ir-drop-sub">PDF, PNG, or JPEG files accepted</span>
        </span>
      </button>
      <input
        ref={ref}
        type="file"
        multiple
        accept=".pdf,.png,.jpg,.jpeg"
        hidden
        onChange={pick}
      />
      {files.length > 0 && (
        <ul className="ir-files">
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`}>
              <span className="ir-file-ico">
                <Check width={10} height={10} />
              </span>
              <span className="ir-file-name">{f.name}</span>
              <button
                type="button"
                className="ir-file-x"
                aria-label="Remove"
                onClick={() => onRemove(i)}
              >
                <Close width={12} height={12} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function EyeOffSmall() {
  return (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 3l18 18M12 6c6.4 0 10 6 10 6-.4.7-1.1 1.7-2 2.7M6 7a13 13 0 0 0-4 5s3.6 6 10 6c1.7 0 3.2-.4 4.4-1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---------- AccountPicker (local copy) ---------- */
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
    <div className="ir-picker" ref={ref}>
      <button
        type="button"
        className={`ir-picker-btn ${open ? "is-open" : ""}`}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="ir-picker-ico">
          <AccountMark width={28} height={28} />
        </span>
        <span className="ir-picker-text">
          <span className="ir-picker-title">{selected.name}</span>
          <span className="ir-picker-sub">
            <span className="tnum">{money(selected.balance)}</span>
            {selected.sublabel && (
              <>
                <span className="ir-picker-divider">/</span>
                <span>{selected.sublabel}</span>
              </>
            )}
          </span>
        </span>
        <Chevron
          width={16}
          height={16}
          className="ir-picker-caret"
          style={{
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.14s ease",
          }}
        />
      </button>
      {open && (
        <ul className="ir-picker-list" role="listbox">
          {accounts.map((a) => (
            <li key={a.id}>
              <button
                type="button"
                role="option"
                aria-selected={a.id === value}
                className={`ir-picker-opt ${a.id === value ? "is-selected" : ""}`}
                onClick={() => {
                  onChange(a.id);
                  setOpen(false);
                }}
              >
                <span className="ir-picker-ico">
                  <AccountMark width={28} height={28} />
                </span>
                <span className="ir-picker-text">
                  <span className="ir-picker-title">{a.name}</span>
                  <span className="ir-picker-sub">
                    <span className="tnum">{money(a.balance)}</span>
                    {a.sublabel && (
                      <>
                        <span className="ir-picker-divider">/</span>
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

// Keep RKE / ReactNode referenced so the import isn't flagged as unused.
export type _Noop = RKE<HTMLDivElement> & ReactNode;
