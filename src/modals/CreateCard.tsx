import { useState } from "react";
import Modal from "../components/Modal";
import { Field, TextInput, Select } from "../components/ui";
import { accounts as accountRows } from "../data";

export default function CreateCard({ onClose }: { onClose: () => void }) {
  const [label, setLabel] = useState("");
  const [type, setType] = useState("Virtual");
  const [account, setAccount] = useState(accountRows[0].name);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <Modal title="Create card" onClose={onClose} width={420}>
        <p style={{ margin: "4px 0 18px" }}>
          A {type.toLowerCase()} card <strong>{label || "Untitled"}</strong> on {account} has been created. This is a demo card.
        </p>
        <button className="btn btn-accent" type="button" onClick={onClose} style={{ width: "100%", justifyContent: "center" }}>
          Done
        </button>
      </Modal>
    );
  }

  return (
    <Modal title="Create card" onClose={onClose} width={420}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setDone(true);
        }}
      >
        <Field label="Card label">
          <TextInput id="cc-label" placeholder="e.g. Ad spend" value={label} onChange={(e) => setLabel(e.target.value)} autoFocus />
        </Field>
        <Field label="Card type">
          <Select id="cc-type" value={type} onChange={(e) => setType(e.target.value)}>
            <option>Virtual</option>
            <option>Physical</option>
            <option>Single-use</option>
          </Select>
        </Field>
        <Field label="Funding account">
          <Select id="cc-acct" value={account} onChange={(e) => setAccount(e.target.value)}>
            {accountRows.map((a) => (
              <option key={a.id}>{a.name}</option>
            ))}
          </Select>
        </Field>
        <div className="modal-foot" style={{ margin: "8px -20px -20px", paddingBottom: 18 }}>
          <button className="btn" type="button" onClick={onClose}>Cancel</button>
          <button className="btn btn-accent" type="submit">Create card</button>
        </div>
      </form>
    </Modal>
  );
}
