import { useEffect, useRef, useState } from "react";
import { BRAND } from "../data";
import {
  Bill,
  Deposit,
  Eye,
  EyeOff,
  MessageSquare,
  Request,
  Send,
  Sliders,
  Transfer,
} from "./icons/Icons";
import { useModal, type ModalName } from "../modals/ModalContext";
import type { SectionKey } from "../pages/Home";
import "./DashboardHeader.css";

const actions: { label: string; Icon: typeof Send; modal: ModalName }[] = [
  { label: "Send", Icon: Send, modal: "send" },
  { label: "Transfer", Icon: Transfer, modal: "transfer" },
  { label: "Deposit", Icon: Deposit, modal: "deposit" },
  { label: "Request", Icon: Request, modal: "request" },
  { label: "Upload bill", Icon: Bill, modal: "upload-bill" },
];

const CUSTOMIZE: { key: SectionKey; label: string }[] = [
  { key: "disputes", label: "Dispute Status" },
  { key: "credit", label: "Credit Card" },
  { key: "bill-pay", label: "Bill Pay" },
  { key: "invoicing", label: "Invoicing" },
];

interface Props {
  hidden: Set<SectionKey>;
  onToggle: (key: SectionKey) => void;
  onRequestFeature: () => void;
}

export default function DashboardHeader({ hidden, onToggle, onRequestFeature }: Props) {
  const modal = useModal();
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

  return (
    <div className="dash-header">
      <h1>Welcome, {BRAND.userFirst}</h1>
      <div className="quick-actions">
        {actions.map(({ label, Icon, modal: name }) => (
          <button
            key={label}
            className="quick-action"
            type="button"
            onClick={() => modal.open(name)}
          >
            <span className="quick-action-ico">
              <Icon width={17} height={17} />
            </span>
            {label}
          </button>
        ))}
        <div className="customize-wrap" ref={wrapRef}>
          <button
            className="btn btn-ghost customize"
            type="button"
            aria-haspopup="menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <Sliders width={16} height={16} />
            Customize
          </button>
          {open && (
            <div className="customize-menu" role="menu">
              {CUSTOMIZE.map((item) => {
                const isHidden = hidden.has(item.key);
                const Icon = isHidden ? Eye : EyeOff;
                return (
                  <button
                    key={item.key}
                    type="button"
                    role="menuitem"
                    className="customize-item"
                    onClick={() => onToggle(item.key)}
                  >
                    <Icon width={15} height={15} className="customize-ico" />
                    {isHidden ? "Show" : "Hide"} {item.label}
                  </button>
                );
              })}
              <div className="customize-sep" />
              <button
                type="button"
                role="menuitem"
                className="customize-item customize-request"
                onClick={() => {
                  setOpen(false);
                  onRequestFeature();
                }}
              >
                <MessageSquare width={15} height={15} className="customize-ico" />
                Request feature
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
