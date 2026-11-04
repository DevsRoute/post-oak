import { useEffect, useState } from "react";
import { Plus, Request, Chevron } from "./icons/Icons";
import "./FeedbackDialog.css";

export default function FeedbackDialog({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function share() {
    if (!text.trim()) return;
    setSent(true);
    setTimeout(onClose, 1200);
  }

  return (
    <div className="feedback-dialog" role="dialog" aria-label="Provide feedback">
      <div className="feedback-head">
        <strong className="feedback-title">Provide feedback</strong>
        <div className="feedback-actions">
          <button className="icon-btn feedback-icon" type="button" aria-label="Add attachment">
            <Plus width={14} height={14} />
          </button>
          <button className="icon-btn feedback-icon" type="button" aria-label="Help">
            <Request width={14} height={14} />
          </button>
          <button
            className="icon-btn feedback-icon"
            type="button"
            aria-label="Close"
            onClick={onClose}
          >
            <Chevron width={14} height={14} style={{ transform: "rotate(45deg)" }} />
          </button>
        </div>
      </div>

      {sent ? (
        <div className="feedback-body">
          <p className="feedback-sent">Thanks — feedback received.</p>
        </div>
      ) : (
        <>
          <div className="feedback-body">
            <p className="feedback-copy">
              We'd love to hear from you. Please provide your feedback for Dashboard Home below.
            </p>
            <textarea
              className="feedback-textarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder=""
              autoFocus
              rows={4}
            />
          </div>
          <div className="feedback-foot">
            <button className="btn btn-ghost" type="button" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn feedback-share"
              type="button"
              onClick={share}
              disabled={!text.trim()}
            >
              Share feedback
            </button>
          </div>
        </>
      )}
    </div>
  );
}
