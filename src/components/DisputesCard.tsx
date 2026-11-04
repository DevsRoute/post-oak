import { useState } from "react";
import { money } from "../format";
import { Chevron, ChevronRight, Dots } from "./icons/Icons";
import "./DisputesCard.css";

interface Dispute {
  id: string;
  title: string;
  amount: number;
  merchants: number;
  resolvedPct: number;
}

const disputes: Dispute[] = [
  { id: "d1", title: "Dispute request received", amount: 3_444.23, merchants: 3, resolvedPct: 34 },
  { id: "d2", title: "Awaiting merchant response", amount: 1_280.4, merchants: 2, resolvedPct: 62 },
  { id: "d3", title: "Provisional credit issued", amount: 5_117.09, merchants: 4, resolvedPct: 78 },
  { id: "d4", title: "Documentation requested", amount: 812.15, merchants: 1, resolvedPct: 20 },
  { id: "d5", title: "Case under review", amount: 2_045.0, merchants: 2, resolvedPct: 48 },
  { id: "d6", title: "Chargeback filed", amount: 970.5, merchants: 1, resolvedPct: 55 },
  { id: "d7", title: "Merchant refunded", amount: 240.0, merchants: 1, resolvedPct: 100 },
  { id: "d8", title: "Dispute closed", amount: 1_629.88, merchants: 3, resolvedPct: 90 },
  { id: "d9", title: "Follow-up required", amount: 310.0, merchants: 1, resolvedPct: 12 },
];

export default function DisputesCard() {
  const [idx, setIdx] = useState(0);
  const d = disputes[idx];
  const prev = () => setIdx((i) => Math.max(0, i - 1));
  const next = () => setIdx((i) => Math.min(disputes.length - 1, i + 1));

  return (
    <section className="card module disputes-card">
      <div className="card-head">
        <h3>Disputes</h3>
        <div className="spacer" />
        <div className="dispute-pager">
          <button
            type="button"
            className="icon-btn"
            aria-label="Previous dispute"
            onClick={prev}
            disabled={idx === 0}
          >
            <Chevron
              width={14}
              height={14}
              style={{ transform: "rotate(90deg)" }}
            />
          </button>
          <span className="dispute-counter tnum">
            {idx + 1}/{disputes.length}
          </span>
          <button
            type="button"
            className="icon-btn"
            aria-label="Next dispute"
            onClick={next}
            disabled={idx === disputes.length - 1}
          >
            <ChevronRight width={14} height={14} />
          </button>
        </div>
        <button className="icon-btn" type="button" aria-label="More actions">
          <Dots width={18} height={18} />
        </button>
      </div>

      <div className="module-body">
        <div>
          <div className="dispute-title">{d.title}</div>
          <button type="button" className="dispute-detail">
            <span className="tnum">{money(d.amount)}</span>
            <span className="muted"> at {d.merchants} merchant{d.merchants === 1 ? "" : "s"}</span>
            <ChevronRight width={12} height={12} />
          </button>
        </div>

        <div className="dispute-bars" aria-hidden="true">
          <span className="dispute-seg" style={{ width: `${d.resolvedPct}%` }} />
          <span
            className="dispute-seg dispute-seg-pending"
            style={{ width: `${Math.max(8, 100 - d.resolvedPct - 10)}%` }}
          />
        </div>

        <div className="module-footer">
          <div className="autopay">
            <span className="muted">Open disputes</span>
            <span className="tnum" style={{ color: "var(--fg)", fontWeight: 600 }}>
              102 transactions
            </span>
          </div>
          <button type="button" className="view-link">
            View <ChevronRight width={13} height={13} />
          </button>
        </div>
      </div>
    </section>
  );
}
