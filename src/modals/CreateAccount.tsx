import { useState } from "react";
import Modal from "../components/Modal";
import "./CreateAccount.css";

type AcctType = "checking" | "savings";

export default function CreateAccount({ onClose }: { onClose: () => void }) {
  const [type, setType] = useState<AcctType>("checking");
  const [nickname, setNickname] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <Modal title="Create account" onClose={onClose} width={480}>
        <p className="ca-subtitle">
          <strong>{nickname || "New account"}</strong> ({type}) is ready. This
          is a demo, so nothing was opened at a bank.
        </p>
        <div className="ca-foot">
          <button
            className="btn btn-accent ca-submit"
            type="button"
            onClick={onClose}
          >
            Done
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title="Create account" onClose={onClose} width={480}>
      <p className="ca-subtitle">
        This will create a new account with its own account number.
      </p>

      <div className="ca-section-label">Type</div>
      <div className="ca-type-grid">
        {(["checking", "savings"] as const).map((t) => {
          const selected = type === t;
          return (
            <button
              key={t}
              type="button"
              className={`ca-type-card ${selected ? "is-selected" : ""}`}
              onClick={() => setType(t)}
              aria-pressed={selected}
            >
              <span className={`ca-radio ${selected ? "is-selected" : ""}`} />
              <span className="ca-type-label">
                {t === "checking" ? "Checking" : "Savings"}
              </span>
            </button>
          );
        })}
      </div>

      <p className="ca-apply">
        Need a new business or personal account instead?{" "}
        <button type="button" className="ca-link">
          Apply here.
        </button>
      </p>

      <label className="ca-field">
        <span className="ca-field-label">Nickname (optional)</span>
        <input
          className="ca-input"
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          autoFocus
        />
        <span className="ca-field-hint">
          E.g., Operating Expenses, Taxes, Team Budget
        </span>
      </label>

      <div className="ca-foot">
        <button className="btn btn-ghost" type="button" onClick={onClose}>
          Cancel
        </button>
        <button
          className="btn btn-accent ca-submit"
          type="button"
          onClick={() => setDone(true)}
        >
          Create account
        </button>
      </div>
    </Modal>
  );
}
