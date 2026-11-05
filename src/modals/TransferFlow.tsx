import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { accounts } from "../data";
import { money } from "../format";
import Wordmark from "../components/Wordmark";
import AccountMark from "../components/icons/AccountMark";
import {
  Chevron,
  ChevronRight,
  Close,
  FileUpload,
  Refresh,
} from "../components/icons/Icons";
import "./TransferFlow.css";

interface Props {
  onClose: () => void;
}

export default function TransferFlow({ onClose }: Props) {
  const [amount, setAmount] = useState("");
  const [fromId, setFromId] = useState<string>("");
  const [toId, setToId] = useState<string>("");
  const [showDetails, setShowDetails] = useState(false);
  const [note, setNote] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

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

  function onAmount(e: ChangeEvent<HTMLInputElement>) {
    // Allow digits + single decimal, strip anything else.
    const v = e.target.value.replace(/[^0-9.]/g, "");
    const parts = v.split(".");
    const cleaned =
      parts.length <= 1 ? v : `${parts[0]}.${parts.slice(1).join("").slice(0, 2)}`;
    setAmount(cleaned);
  }

  function addFiles(list: FileList | null) {
    if (!list) return;
    setFiles((prev) => [...prev, ...Array.from(list)]);
  }
  function onPick(e: ChangeEvent<HTMLInputElement>) {
    addFiles(e.target.files);
    e.target.value = "";
  }
  function onDrop(e: DragEvent<HTMLButtonElement>) {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  }
  function onDragOver(e: DragEvent<HTMLButtonElement>) {
    e.preventDefault();
    setDragOver(true);
  }

  const canNext = Boolean(amount && parseFloat(amount) > 0 && fromId && toId);

  return (
    <div className="tf-overlay" role="dialog" aria-label="Transfer funds">
      <header className="tf-header">
        <div className="tf-brand">
          <Wordmark height={30} />
        </div>
        <button
          type="button"
          className="tf-close"
          aria-label="Close"
          onClick={onClose}
        >
          <Close width={20} height={20} />
        </button>
      </header>

      <div className="tf-scroll">
        <main className="tf-body">
          <h1 className="tf-heading">Transfer funds</h1>

          <section className="tf-card">
            <h2 className="tf-card-title">One-time transfer</h2>

            <label className="tf-field">
              <span className="tf-label">Amount</span>
              <div className="tf-input-wrap">
                <span className="tf-input-prefix">$</span>
                <input
                  className="tf-input tf-input-amount"
                  type="text"
                  inputMode="decimal"
                  placeholder="0.00"
                  value={amount}
                  onChange={onAmount}
                  autoFocus
                />
              </div>
            </label>

            <AccountSelect
              id="from"
              label="Transfer from"
              value={fromId}
              onChange={setFromId}
              excludeId={toId}
            />
            <AccountSelect
              id="to"
              label="Transfer to"
              value={toId}
              onChange={setToId}
              excludeId={fromId}
            />

            <button
              type="button"
              className="tf-toggle-row"
              onClick={() => setShowDetails((s) => !s)}
              aria-pressed={showDetails}
            >
              <span
                className={`tf-switch ${showDetails ? "is-on" : ""}`}
                aria-hidden="true"
              >
                <span className="tf-switch-knob" />
              </span>
              Add more details
            </button>

            {showDetails && (
              <div className="tf-details">
                <label className="tf-field">
                  <span className="tf-label">Internal note</span>
                  <textarea
                    className="tf-textarea"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                  />
                </label>

                <div className="tf-field">
                  <span className="tf-label">Attachments</span>
                  <button
                    type="button"
                    className={`tf-drop ${dragOver ? "is-dragover" : ""}`}
                    onClick={() => fileRef.current?.click()}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    onDragLeave={() => setDragOver(false)}
                  >
                    <span className="tf-drop-ico">
                      <FileUpload width={22} height={22} />
                    </span>
                    <span className="tf-drop-text">
                      <span className="tf-drop-title">
                        Drag and drop here or click to upload
                      </span>
                      <span className="tf-drop-sub">
                        You may upload PDF, PNG, or JPEG files
                      </span>
                    </span>
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    multiple
                    hidden
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={onPick}
                  />
                  {files.length > 0 && (
                    <ul className="tf-files">
                      {files.map((f, i) => (
                        <li key={`${f.name}-${i}`}>
                          <span className="tf-file-name">{f.name}</span>
                          <span className="tf-file-size">
                            {(f.size / 1024).toFixed(1)} KB
                          </span>
                          <button
                            type="button"
                            className="tf-file-x"
                            aria-label="Remove"
                            onClick={() =>
                              setFiles((prev) =>
                                prev.filter((_, idx) => idx !== i)
                              )
                            }
                          >
                            <Close width={13} height={13} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            <div className="tf-foot">
              <button type="button" className="tf-btn tf-btn-ghost" onClick={onClose}>
                Back
              </button>
              <button
                type="button"
                className="tf-btn tf-btn-accent"
                disabled={!canNext}
                onClick={onClose}
              >
                Next
                <ChevronRight width={14} height={14} />
              </button>
            </div>
          </section>

          <button type="button" className="tf-rule-row">
            <span className="tf-rule-ico">
              <Refresh width={16} height={16} />
            </span>
            <span className="tf-rule-label">Auto transfer rule</span>
            <ChevronRight width={16} height={16} className="tf-rule-chev" />
          </button>
        </main>
      </div>
    </div>
  );
}

/* ---------- AccountSelect (custom dropdown) ---------- */
function AccountSelect({
  id,
  label,
  value,
  onChange,
  excludeId,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (id: string) => void;
  excludeId?: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
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

  const selected = accounts.find((a) => a.id === value);
  const options = accounts.filter((a) => a.id !== excludeId);

  return (
    <div className="tf-field" ref={wrapRef}>
      <label className="tf-label" htmlFor={`tf-sel-${id}`}>
        {label}
      </label>
      <button
        id={`tf-sel-${id}`}
        type="button"
        className={`tf-select ${open ? "is-open" : ""} ${selected ? "has-value" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selected ? (
          <>
            <span className="tf-opt-ico">
              <AccountMark width={28} height={28} />
            </span>
            <span className="tf-opt-text">
              <span className="tf-opt-title">{selected.name}</span>
              <span className="tf-opt-sub">
                <span className="tnum">{money(selected.balance)}</span>
                {selected.sublabel && (
                  <>
                    <span className="tf-opt-divider">/</span>
                    <span>{selected.sublabel}</span>
                  </>
                )}
              </span>
            </span>
          </>
        ) : (
          <span className="tf-select-placeholder">Select an account</span>
        )}
        <Chevron
          width={16}
          height={16}
          className="tf-select-caret"
          style={{
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.14s ease",
          }}
        />
      </button>
      {open && (
        <ul className="tf-options" role="listbox">
          {options.map((a) => (
            <li key={a.id}>
              <button
                type="button"
                role="option"
                aria-selected={a.id === value}
                className={`tf-option ${a.id === value ? "is-selected" : ""}`}
                onClick={() => {
                  onChange(a.id);
                  setOpen(false);
                }}
              >
                <span className="tf-opt-ico">
                  <AccountMark width={28} height={28} />
                </span>
                <span className="tf-opt-text">
                  <span className="tf-opt-title">{a.name}</span>
                  <span className="tf-opt-sub">
                    <span className="tnum">{money(a.balance)}</span>
                    {a.sublabel && (
                      <>
                        <span className="tf-opt-divider">/</span>
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
