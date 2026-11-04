import { useModal } from "./ModalContext";
import MoveMoney from "./MoveMoney";
import MoneyForm from "./MoneyForm";
import CreateAccount from "./CreateAccount";
import CreateCard from "./CreateCard";
import CreateInvoice from "./CreateInvoice";
import CommandPalette from "./CommandPalette";
import Modal from "../components/Modal";
import { Field, TextInput } from "../components/ui";

export default function ModalHost() {
  const { name, close } = useModal();
  if (!name) return null;

  switch (name) {
    case "move-money":
      return <MoveMoney onClose={close} />;
    case "send":
      return <MoneyForm variant="send" onClose={close} />;
    case "transfer":
      return <MoneyForm variant="transfer" onClose={close} />;
    case "deposit":
      return <MoneyForm variant="deposit" onClose={close} />;
    case "request":
      return <MoneyForm variant="request" onClose={close} />;
    case "create-account":
      return <CreateAccount onClose={close} />;
    case "create-card":
      return <CreateCard onClose={close} />;
    case "create-invoice":
      return <CreateInvoice onClose={close} />;
    case "command":
      return <CommandPalette onClose={close} />;
    case "upload-bill":
      return (
        <Modal title="Upload bill" onClose={close} width={440}>
          <Field label="Bill document" hint="PDF or image. In this demo nothing is uploaded.">
            <TextInput id="ub-file" type="file" />
          </Field>
          <Field label="Recipient">
            <TextInput id="ub-recipient" placeholder="Vendor name" />
          </Field>
          <div className="modal-foot" style={{ margin: "8px -20px -20px", paddingBottom: 18 }}>
            <button className="btn" type="button" onClick={close}>Cancel</button>
            <button className="btn btn-accent" type="button" onClick={close}>Add bill</button>
          </div>
        </Modal>
      );
    default:
      return null;
  }
}
