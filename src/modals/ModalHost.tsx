import { useModal } from "./ModalContext";
import MoveMoney from "./MoveMoney";
import CreateAccount from "./CreateAccount";
import CreateCard from "./CreateCard";
import CreateInvoice from "./CreateInvoice";
import CommandPalette from "./CommandPalette";
import BillPayFlow from "./BillPayFlow";
import CheckDepositFlow from "./CheckDepositFlow";
import DepositFlow from "./DepositFlow";
import InviteRecipientFlow from "./InviteRecipientFlow";
import RequestFlow from "./RequestFlow";
import StartFlow from "./StartFlow";
import TransferFlow from "./TransferFlow";

export default function ModalHost() {
  const { name, close } = useModal();
  if (!name) return null;

  switch (name) {
    case "move-money":
      return <MoveMoney onClose={close} />;
    case "send":
      return <StartFlow variant="send" onClose={close} />;
    case "transfer":
      return <TransferFlow onClose={close} />;
    case "deposit":
      return <DepositFlow onClose={close} />;
    case "check-deposit":
      return <CheckDepositFlow onClose={close} />;
    case "request":
      return <RequestFlow onClose={close} />;
    case "upload-bill":
      return <BillPayFlow onClose={close} />;
    case "invite-recipient":
      return <InviteRecipientFlow onClose={close} />;
    case "create-account":
      return <CreateAccount onClose={close} />;
    case "create-card":
      return <CreateCard onClose={close} />;
    case "create-invoice":
      return <CreateInvoice onClose={close} />;
    case "command":
      return <CommandPalette onClose={close} />;
    default:
      return null;
  }
}
