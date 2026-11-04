import { useEffect, type ReactNode } from "react";
import "./Modal.css";

interface ModalProps {
  title?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  width?: number;
  align?: "center" | "top";
}

export default function Modal({ title, onClose, children, footer, width = 480, align = "center" }: ModalProps) {
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

  return (
    <div className={`modal-overlay align-${align}`} onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        style={{ width }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="modal-head">
            <h2>{title}</h2>
            <button className="modal-close" onClick={onClose} type="button" aria-label="Close">
              <span aria-hidden="true">✕</span>
            </button>
          </div>
        )}
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}
