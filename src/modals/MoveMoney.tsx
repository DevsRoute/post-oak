import Modal from "../components/Modal";
import { Send, Transfer, Deposit, Request, Bill, ChevronRight } from "../components/icons/Icons";
import { useModal, type ModalName } from "./ModalContext";

const options: { name: ModalName; label: string; desc: string; Icon: typeof Send }[] = [
  { name: "send", label: "Send", desc: "Pay a recipient by ACH or wire", Icon: Send },
  { name: "transfer", label: "Transfer", desc: "Move money between your accounts", Icon: Transfer },
  { name: "deposit", label: "Deposit", desc: "Add funds from a linked source", Icon: Deposit },
  { name: "request", label: "Request", desc: "Request a payment or invoice", Icon: Request },
  { name: "upload-bill", label: "Upload bill", desc: "Pay a bill from a document", Icon: Bill },
];

export default function MoveMoney({ onClose }: { onClose: () => void }) {
  const modal = useModal();
  return (
    <Modal title="Move money" onClose={onClose} width={440}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, margin: "-4px 0" }}>
        {options.map(({ name, label, desc, Icon }) => (
          <button
            key={name}
            type="button"
            className="move-option"
            onClick={() => modal.open(name)}
          >
            <span className="move-option-ico">
              <Icon width={18} height={18} />
            </span>
            <span className="two-line" style={{ flex: 1, textAlign: "left" }}>
              <strong>{label}</strong>
              <span className="cell-sub">{desc}</span>
            </span>
            <ChevronRight width={16} height={16} style={{ color: "var(--fg-faint)" }} />
          </button>
        ))}
      </div>
    </Modal>
  );
}
