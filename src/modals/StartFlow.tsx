import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import Wordmark from "../components/Wordmark";
import {
  ArrowLeft,
  ChevronRight,
  Close,
  MessageSquare,
  Plus,
  Search,
  UserPeople,
} from "../components/icons/Icons";
import { useModal } from "./ModalContext";
import "./StartFlow.css";

export type StartVariant = "send" | "transfer" | "deposit" | "request" | "upload-bill";

const COPY: Record<StartVariant, { heading: string; uploadHelper: string }> = {
  send: {
    heading: "How would you like to start?",
    uploadHelper:
      "Use this to automatically pre-fill your recipient's payment details.",
  },
  transfer: {
    heading: "How would you like to start?",
    uploadHelper: "Pre-fill transfer details from a document, if any.",
  },
  deposit: {
    heading: "How would you like to start?",
    uploadHelper: "Pre-fill deposit details from a document, if any.",
  },
  request: {
    heading: "How would you like to start?",
    uploadHelper: "Pre-fill the invoice from an uploaded document.",
  },
  "upload-bill": {
    heading: "How would you like to start?",
    uploadHelper:
      "Use this to automatically pre-fill your recipient's payment details.",
  },
};

interface Recipient {
  id: string;
  monogram: string;
  name: string;
  role?: string;
  email?: string;
}

const RECENT: Recipient[] = [
  { id: "da", monogram: "DA", name: "Domestic Ads" },
  { id: "am", monogram: "AM", name: "Aliyah McMahon", role: "Nutritionist", email: "aliyah@mcmahon.com" },
  { id: "jg", monogram: "JG", name: "Jason Green", role: "Contractor", email: "jason@green.com" },
  { id: "jo", monogram: "JO", name: "Jordi O'Donnell", role: "Consultant", email: "jordi@odonnell.com" },
  { id: "lp", monogram: "LP", name: "Lighthouse Properties", role: "Landlord" },
];

type View = "start" | "match" | "create";

interface Props {
  variant: StartVariant;
  onClose: () => void;
}

export default function StartFlow({ variant, onClose }: Props) {
  const modal = useModal();
  const copy = COPY[variant];
  const [view, setView] = useState<View>("start");
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [q, setQ] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (!searchOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!searchRef.current?.contains(e.target as Node)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [searchOpen]);

  function addFiles(list: FileList | null) {
    if (!list) return;
    const added = Array.from(list);
    setFiles((prev) => [...prev, ...added]);
    if (view === "start") setView("match");
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
  function onDragLeave() {
    setDragOver(false);
  }
  function removeFile(i: number) {
    const next = files.filter((_, idx) => idx !== i);
    setFiles(next);
    if (next.length === 0) setView("start");
  }

  const filteredRecent = useMemo(() => {
    if (!q.trim()) return RECENT;
    return RECENT.filter((r) =>
      r.name.toLowerCase().includes(q.toLowerCase())
    );
  }, [q]);

  const showSuggestions = searchOpen && q.trim().length > 0;

  /* ================================================================
     Match view (split layout with bill preview)
     ================================================================ */
  if (view === "match") {
    return (
      <div className="sf-overlay" role="dialog" aria-label="Recipient match">
        <header className="sf-header sf-header-split">
          <div className="sf-brand">
            <Wordmark height={30} />
          </div>
          <button
            type="button"
            className="sf-close"
            aria-label="Close"
            onClick={onClose}
          >
            <Close width={18} height={18} />
          </button>
        </header>
        <div className="sf-split">
          <section className="sf-split-left">
            <div className="sf-split-scroll">
              <MatchPanel onCreate={() => setView("create")} />
            </div>
            <div className="sf-split-foot">
              <button
                type="button"
                className="sf-btn sf-btn-ghost"
                onClick={() => {
                  setView("start");
                  setFiles([]);
                }}
              >
                <ArrowLeft width={14} height={14} />
                Go back
              </button>
              <button
                type="button"
                className="sf-btn sf-btn-accent"
                onClick={() => setView("create")}
              >
                <Plus width={13} height={13} />
                Create recipient
              </button>
            </div>
          </section>
          <section className="sf-split-right">
            <BillPreview files={files} />
          </section>
        </div>
      </div>
    );
  }

  /* ================================================================
     Create recipient (centered, no preview)
     ================================================================ */
  if (view === "create") {
    return (
      <CreateRecipientOverlay
        onBack={() => (files.length > 0 ? setView("match") : setView("start"))}
        onDone={onClose}
      />
    );
  }

  /* ================================================================
     Default "start" view (original)
     ================================================================ */
  return (
    <div className="sf-overlay" role="dialog" aria-label={copy.heading}>
      <header className="sf-header">
        <div className="sf-brand">
          <Wordmark height={30} />
        </div>
        <button
          type="button"
          className="sf-close"
          aria-label="Close"
          onClick={onClose}
        >
          <Close width={18} height={18} />
        </button>
      </header>

      <div className="sf-scroll">
        <main className="sf-body">
          <h1 className="sf-heading">{copy.heading}</h1>

          <section className="sf-section">
            <h2 className="sf-section-title">Upload a bill</h2>
            <p className="sf-section-sub">{copy.uploadHelper}</p>
            <button
              type="button"
              className={`sf-dropzone ${dragOver ? "is-dragover" : ""}`}
              onClick={() => fileRef.current?.click()}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
            >
              <span className="sf-dz-ico" aria-hidden="true">
                <svg width={28} height={28} viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="16" rx="3" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M12 15V8m0 0-3 3m3-3 3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="sf-dz-text">
                <span className="sf-dz-title">
                  Drag and drop here or click to upload
                </span>
                <span className="sf-dz-sub">
                  Upload images, PDFs, or spreadsheets
                </span>
              </span>
            </button>
            <input
              ref={fileRef}
              type="file"
              multiple
              accept="image/*,.pdf,.csv,.xls,.xlsx"
              hidden
              onChange={onPick}
            />
            {files.length > 0 && (
              <ul className="sf-files">
                {files.map((f, i) => (
                  <li key={`${f.name}-${i}`}>
                    <span className="sf-file-name">{f.name}</span>
                    <span className="sf-file-size">
                      {(f.size / 1024).toFixed(1)} KB
                    </span>
                    <button
                      type="button"
                      className="sf-file-x"
                      aria-label="Remove"
                      onClick={() => removeFile(i)}
                    >
                      <Close width={14} height={14} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <div className="sf-or">
            <span>OR</span>
          </div>

          <section className="sf-section">
            <h2 className="sf-section-title">Select a recipient</h2>
            <div className="sf-search-wrap" ref={searchRef}>
              <label className="sf-search-label" htmlFor="sf-search">
                Search
              </label>
              <div className="sf-search">
                <Search width={16} height={16} />
                <input
                  id="sf-search"
                  type="text"
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setSearchOpen(true);
                  }}
                  onFocus={() => setSearchOpen(true)}
                />
              </div>
              {showSuggestions && (
                <div className="sf-suggest" role="listbox">
                  <button
                    type="button"
                    role="option"
                    className="sf-suggest-item"
                    onClick={() => setSearchOpen(false)}
                  >
                    <Plus width={14} height={14} />
                    Create recipient: <strong>{q}</strong>
                  </button>
                  <button
                    type="button"
                    role="option"
                    className="sf-suggest-item"
                    onClick={() => setSearchOpen(false)}
                  >
                    <MessageSquare width={14} height={14} />
                    Invite recipient: <strong>{q}</strong>
                  </button>
                </div>
              )}
            </div>

            <div className="sf-actions-row">
              <button
                type="button"
                className="sf-action"
                onClick={() => setView("create")}
              >
                <UserPeople width={15} height={15} />
                Create recipient
              </button>
              <button
                type="button"
                className="sf-action"
                onClick={() => modal.open("invite-recipient")}
              >
                <MessageSquare width={15} height={15} />
                Invite recipient
              </button>
            </div>
          </section>

          <section className="sf-section">
            <h3 className="sf-recent-title">Recently paid</h3>
            <ul className="sf-recent-list">
              {filteredRecent.length === 0 ? (
                <li className="sf-recent-empty">No matching recipients</li>
              ) : (
                filteredRecent.map((r) => (
                  <li key={r.id}>
                    <button
                      type="button"
                      className="sf-recent-row"
                      onClick={onClose}
                    >
                      <span className="mono sf-recent-mono">{r.monogram}</span>
                      <span className="sf-recent-info">
                        <span className="sf-recent-name">{r.name}</span>
                        {(r.role || r.email) && (
                          <span className="sf-recent-sub">
                            {[r.role, r.email].filter(Boolean).join(" · ")}
                          </span>
                        )}
                      </span>
                      <ChevronRight width={14} height={14} className="sf-recent-chev" />
                    </button>
                  </li>
                ))
              )}
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
}

/* ====================================================================
   Match panel (no recipient found)
   ==================================================================== */
function MatchPanel({ onCreate }: { onCreate: () => void }) {
  const [q, setQ] = useState("");
  return (
    <div className="sf-match">
      <h1 className="sf-split-title">Recipient match</h1>
      <p className="sf-split-sub">
        We couldn't find a recipient that matches your bill.
      </p>

      <button type="button" className="sf-match-cta" onClick={onCreate}>
        <Plus width={14} height={14} />
        Create recipient
      </button>

      <div className="sf-split-or">
        <span>or</span>
      </div>

      <label className="sf-split-field">
        <span className="sf-split-label">Search for a recipient</span>
        <div className="sf-split-input-wrap">
          <Search width={14} height={14} />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder=""
          />
        </div>
      </label>
    </div>
  );
}

/* ====================================================================
   Create recipient — centered full-page overlay (no preview)
   ==================================================================== */
function CreateRecipientOverlay({
  onBack,
  onDone,
}: {
  onBack: () => void;
  onDone: () => void;
}) {
  const [profile, setProfile] = useState<"person" | "business">("person");
  const [legalName, setLegalName] = useState("");
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [requestTax, setRequestTax] = useState(false);
  const [country, setCountry] = useState("United States");
  const [street, setStreet] = useState("");
  const [apt, setApt] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");

  const canSubmit = legalName.trim().length > 0;

  return (
    <div className="sf-overlay" role="dialog" aria-label="Create recipient">
      <header className="sf-header sf-header-split">
        <div className="sf-brand">
          <Wordmark height={30} />
        </div>
        <button
          type="button"
          className="sf-close"
          aria-label="Close"
          onClick={onDone}
        >
          <Close width={18} height={18} />
        </button>
      </header>

      <div className="sf-center-scroll">
        <main className="sf-center-body">
          <h1 className="sf-center-title">Create recipient</h1>

          <div className="sf-create-section">
            <span className="sf-create-section-label">Profile</span>
            <div className="sf-profile-tabs" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={profile === "person"}
                className={`sf-profile-tab ${profile === "person" ? "is-active" : ""}`}
                onClick={() => setProfile("person")}
              >
                <span className={`sf-radio ${profile === "person" ? "is-on" : ""}`} />
                Person
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={profile === "business"}
                className={`sf-profile-tab ${profile === "business" ? "is-active" : ""}`}
                onClick={() => setProfile("business")}
              >
                <span className={`sf-radio ${profile === "business" ? "is-on" : ""}`} />
                Business
              </button>
            </div>
          </div>

          <label className="sf-split-field">
            <span className="sf-split-label">Legal name</span>
            <input
              className="sf-split-input"
              value={legalName}
              onChange={(e) => setLegalName(e.target.value)}
              autoFocus
            />
          </label>

          <label className="sf-split-field">
            <span className="sf-split-label">Email (optional)</span>
            <input
              className="sf-split-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <span className="sf-split-hint">For payment receipts</span>
          </label>

          <label className="sf-split-field">
            <span className="sf-split-label">Nickname (optional)</span>
            <input
              className="sf-split-input"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            <span className="sf-split-hint">
              For your reference only – not visible to the recipient
            </span>
          </label>

          <button
            type="button"
            className="sf-toggle-row"
            onClick={() => setRequestTax((r) => !r)}
            aria-pressed={requestTax}
          >
            <span
              className={`sf-switch ${requestTax ? "is-on" : ""}`}
              aria-hidden="true"
            >
              <span className="sf-switch-knob" />
            </span>
            Request tax documents
            <span className="sf-info-badge" aria-hidden="true">i</span>
          </button>

          <div className="sf-create-section">
            <span className="sf-create-section-label">Address</span>
            <label className="sf-split-field">
              <span className="sf-split-label">Country</span>
              <select
                className="sf-split-input sf-split-select"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option>United States</option>
                <option>Canada</option>
                <option>United Kingdom</option>
                <option>Other</option>
              </select>
            </label>

            <label className="sf-split-field">
              <span className="sf-split-label">Recipient legal address</span>
              <input
                className="sf-split-input"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
            </label>

            <label className="sf-split-field">
              <span className="sf-split-label">Apartment, suite, floor (optional)</span>
              <input
                className="sf-split-input"
                value={apt}
                onChange={(e) => setApt(e.target.value)}
              />
            </label>

            <label className="sf-split-field">
              <span className="sf-split-label">City</span>
              <input
                className="sf-split-input"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </label>

            <label className="sf-split-field">
              <span className="sf-split-label">State</span>
              <select
                className="sf-split-input sf-split-select"
                value={state}
                onChange={(e) => setState(e.target.value)}
              >
                <option value="">Select a state</option>
                <option>California</option>
                <option>New York</option>
                <option>Texas</option>
                <option>Other</option>
              </select>
            </label>

            <label className="sf-split-field">
              <span className="sf-split-label">Postal / ZIP code</span>
              <input
                className="sf-split-input"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
              />
            </label>
          </div>
        </main>
      </div>

      <div className="sf-split-foot sf-split-foot-center">
        <button type="button" className="sf-btn sf-btn-ghost" onClick={onBack}>
          Go back
        </button>
        <button
          type="button"
          className="sf-btn sf-btn-accent"
          disabled={!canSubmit}
          onClick={onDone}
        >
          Create recipient
        </button>
      </div>
    </div>
  );
}


/* ====================================================================
   Right-column bill preview
   ==================================================================== */
function BillPreview({ files }: { files: File[] }) {
  const file = files[0];
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file || !file.type.startsWith("image/")) {
      setUrl(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setUrl(String(e.target?.result ?? ""));
    reader.readAsDataURL(file);
  }, [file]);

  if (url) {
    return (
      <div className="sf-preview-wrap">
        <img src={url} alt="" className="sf-preview-img" />
      </div>
    );
  }

  return (
    <div className="sf-preview-wrap">
      <div className="sf-invoice">
        <div className="sf-inv-head">
          <div className="sf-inv-title">Invoice</div>
          <div className="sf-inv-brand" aria-hidden="true">TB</div>
        </div>
        <div className="sf-inv-meta">
          <div>
            <div className="sf-inv-k">From</div>
            <div className="sf-inv-v">Tax Bureau Inc.</div>
            <div className="sf-inv-v sf-inv-v-muted">receivables@taxbureau.com</div>
            <div className="sf-inv-v sf-inv-v-muted">3916 24th Street</div>
            <div className="sf-inv-v sf-inv-v-muted">San Francisco, CA 94114</div>
            <div className="sf-inv-v sf-inv-v-muted">United States</div>
          </div>
          <div>
            <div className="sf-inv-k">To</div>
            <div className="sf-inv-v">Juniper Studios Inc.</div>
            <div className="sf-inv-v sf-inv-v-muted">ap@juniper.com</div>
            <div className="sf-inv-v sf-inv-v-muted">77 Maplewood Ave</div>
            <div className="sf-inv-v sf-inv-v-muted">Brooklyn, NY 11217</div>
            <div className="sf-inv-v sf-inv-v-muted">United States</div>
          </div>
          <div>
            <div className="sf-inv-k">Details</div>
            <div className="sf-inv-v">Invoice no.</div>
            <div className="sf-inv-v sf-inv-v-muted">INV-883346</div>
          </div>
        </div>

        <div className="sf-inv-table">
          <div className="sf-inv-table-head">
            <span>Line items</span>
            <span>Quantity</span>
            <span>Amount</span>
          </div>
          <div className="sf-inv-table-row">
            <span>Bookkeeping services</span>
            <span>1</span>
            <span className="tnum">$10,000.00</span>
          </div>
          <div className="sf-inv-table-row">
            <span>P&amp;L statements</span>
            <span>1</span>
            <span className="tnum">$800.00</span>
          </div>
          <div className="sf-inv-table-row">
            <span>Quickbooks consulting fee</span>
            <span>2</span>
            <span className="tnum">$800.00</span>
          </div>
          <div className="sf-inv-table-total">
            <span>Total</span>
            <span />
            <span className="tnum">$11,600.00</span>
          </div>
        </div>

        <div className="sf-inv-foot">
          <div className="sf-inv-foot-col">
            <div className="sf-inv-k">Terms</div>
            <div className="sf-inv-v">Invoice date <span className="sf-inv-v-muted">Jan 16, 2026</span></div>
            <div className="sf-inv-v">Due date <span className="sf-inv-v-muted">Jan 17, 2026</span></div>
            <div className="sf-inv-v">Pay via <span className="sf-inv-v-muted">ACH or Wire</span></div>
          </div>
          <div className="sf-inv-foot-col">
            <div className="sf-inv-k">Memo</div>
            <div className="sf-inv-v-muted">
              For recent outsourced bookkeeping services to help with tax season. Glad we could help close the books with you. Please pay upon receipt!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
