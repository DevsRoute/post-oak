import { useState } from "react";
import Modal from "../components/Modal";
import { Field, TextInput, Select } from "../components/ui";

export default function CreateInvoice({ onClose }: { onClose: () => void }) {
  const [customer, setCustomer] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("One time");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <Modal title="Request money" onClose={onClose} width={440}>
        <p style={{ margin: "4px 0 18px" }}>
          A {type.toLowerCase()} invoice for <strong>${amount || "0.00"}</strong> to {customer || "customer"} has been created as a draft.
        </p>
        <button className="btn btn-accent" type="button" onClick={onClose} style={{ width: "100%", justifyContent: "center" }}>
          Done
        </button>
      </Modal>
    );
  }

  return (
    <Modal title="Request money" onClose={onClose} width={440}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setDone(true);
        }}
      >
        <Field label="Customer">
          <TextInput id="ci-cust" placeholder="Customer name or email" value={customer} onChange={(e) => setCustomer(e.target.value)} autoFocus />
        </Field>
        <Field label="Amount">
          <TextInput id="ci-amount" inputMode="decimal" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ""))} />
        </Field>
        <Field label="Frequency">
          <Select id="ci-type" value={type} onChange={(e) => setType(e.target.value)}>
            <option>One time</option>
            <option>Monthly</option>
            <option>Quarterly</option>
          </Select>
        </Field>
        <div className="modal-foot" style={{ margin: "8px -20px -20px", paddingBottom: 18 }}>
          <button className="btn" type="button" onClick={onClose}>Cancel</button>
          <button className="btn btn-accent" type="submit">Create invoice</button>
        </div>
      </form>
    </Modal>
  );
}
