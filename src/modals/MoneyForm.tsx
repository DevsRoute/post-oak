import { useState, type FormEvent } from "react";
import Modal from "../components/Modal";
import { Field, TextInput, Select } from "../components/ui";
import { accounts as accountRows } from "../data";

type Variant = "send" | "transfer" | "deposit" | "request";

const config: Record<Variant, { title: string; cta: string; counterpartyLabel: string; success: string }> = {
  send: { title: "Send money", cta: "Review payment", counterpartyLabel: "Recipient", success: "Payment scheduled" },
  transfer: { title: "Transfer funds", cta: "Review transfer", counterpartyLabel: "To account", success: "Transfer scheduled" },
  deposit: { title: "Deposit", cta: "Continue", counterpartyLabel: "From source", success: "Deposit initiated" },
  request: { title: "Request money", cta: "Send request", counterpartyLabel: "Request from", success: "Request sent" },
};

export default function MoneyForm({ variant, onClose }: { variant: Variant; onClose: () => void }) {
  const cfg = config[variant];
  const [step, setStep] = useState<"form" | "done">("form");
  const [amount, setAmount] = useState("");
  const [from, setFrom] = useState(accountRows[2].name);
  const [counterparty, setCounterparty] = useState("");
  const [memo, setMemo] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!amount) return;
    setStep("done");
  };

  if (step === "done") {
    return (
      <Modal title={cfg.title} onClose={onClose} width={440}>
        <div style={{ textAlign: "center", padding: "12px 0 4px" }}>
          <div
            aria-hidden="true"
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "var(--accent-soft)",
              color: "var(--accent)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              marginBottom: 14,
            }}
          >
            ✓
          </div>
          <h3 style={{ margin: "0 0 6px", fontFamily: "var(--font-display)" }}>{cfg.success}</h3>
          <p className="cell-sub" style={{ margin: "0 0 20px" }}>
            ${amount} {variant === "request" ? "requested from" : "to"} {counterparty || "recipient"}. This is a demo — no money moved.
          </p>
          <button className="btn btn-accent" type="button" onClick={onClose} style={{ width: "100%", justifyContent: "center" }}>
            Done
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title={cfg.title} onClose={onClose} width={440}>
      <form onSubmit={submit}>
        <Field label="Amount">
          <TextInput
            id="mf-amount"
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))}
            autoFocus
          />
        </Field>

        {variant !== "deposit" && (
          <Field label={variant === "transfer" ? "From account" : "Pay from"}>
            <Select id="mf-from" value={from} onChange={(e) => setFrom(e.target.value)}>
              {accountRows.map((a) => (
                <option key={a.id} value={a.name}>
                  {a.name} — ${a.balance.toLocaleString("en-US")}
                </option>
              ))}
            </Select>
          </Field>
        )}

        <Field label={cfg.counterpartyLabel}>
          {variant === "transfer" ? (
            <Select id="mf-cp" value={counterparty} onChange={(e) => setCounterparty(e.target.value)}>
              <option value="">Select account…</option>
              {accountRows.map((a) => (
                <option key={a.id} value={a.name}>
                  {a.name}
                </option>
              ))}
            </Select>
          ) : (
            <TextInput
              id="mf-cp"
              placeholder={variant === "request" ? "name@company.com" : "Recipient name"}
              value={counterparty}
              onChange={(e) => setCounterparty(e.target.value)}
            />
          )}
        </Field>

        <Field label="Memo" hint="Optional — appears on the statement.">
          <TextInput id="mf-memo" placeholder="What's this for?" value={memo} onChange={(e) => setMemo(e.target.value)} />
        </Field>

        <div className="modal-foot" style={{ margin: "8px -20px -20px", paddingBottom: 18 }}>
          <button className="btn" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-accent" type="submit">
            {cfg.cta}
          </button>
        </div>
      </form>
    </Modal>
  );
}
