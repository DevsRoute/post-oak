import { useState } from "react";
import { months } from "../data";
import { compact, money } from "../format";
import { ArrowUpRight, Chevron, ChevronRight, Info } from "./icons/Icons";
import type { MonthlyMovement, PartyStat } from "../types";
import "./MoneyMovement.css";

type Direction = "in" | "out";

function monogram(name: string): string {
  const cleaned = name.replace(/[^A-Za-z\s]/g, "").trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

function BrandAvatar({ name }: { name: string }) {
  if (name.trim().toLowerCase() === "google") {
    return (
      <span className="mm-mono mm-mono-brand">
        <GoogleG />
      </span>
    );
  }
  return <span className="mm-mono">{monogram(name)}</span>;
}

function GoogleG() {
  return (
    <svg width={14} height={14} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.4z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 .9-3.4.9-2.6 0-4.8-1.8-5.6-4.2H3.1v2.6A10 10 0 0 0 12 22z"
        fill="#34A853"
      />
      <path
        d="M6.4 13.8a6 6 0 0 1 0-3.6V7.6H3.1a10 10 0 0 0 0 8.8l3.3-2.6z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 0 0 3.1 7.6l3.3 2.6c.8-2.4 3-4.3 5.6-4.3z"
        fill="#EA4335"
      />
    </svg>
  );
}

function MiniBars({
  all,
  currentKey,
  direction,
  onHover,
}: {
  all: MonthlyMovement[];
  currentKey: string;
  direction: Direction;
  onHover: (m: MonthlyMovement | null) => void;
}) {
  const idx = all.findIndex((m) => m.key === currentKey);
  const end = idx === -1 ? all.length : idx + 1;
  const window = all.slice(Math.max(0, end - 3), end);
  const values = window.map((m) =>
    direction === "in" ? m.inTotal : m.outTotal
  );
  const max = Math.max(...values, 1);
  return (
    <div
      className="mini-bars"
      role="img"
      aria-label="Last 3 months"
      onMouseLeave={() => onHover(null)}
    >
      {window.map((m, i) => {
        const pct = Math.max(10, Math.round((values[i] / max) * 100));
        return (
          <button
            key={m.key}
            type="button"
            className="mini-bar-wrap"
            onMouseEnter={() => onHover(m)}
            onFocus={() => onHover(m)}
            onBlur={() => onHover(null)}
            aria-label={m.label}
          >
            <span className="mini-bar" style={{ height: `${pct}%` }} />
          </button>
        );
      })}
    </div>
  );
}

function SourceRow({
  s,
  negative,
}: {
  s: PartyStat;
  negative?: boolean;
}) {
  return (
    <li>
      <div className="mm-row">
        <BrandAvatar name={s.name} />
        <span className="mm-name">{s.name}</span>
        <span className="mm-amt tnum">
          {money(negative ? -s.amount : s.amount)}
        </span>
      </div>
    </li>
  );
}

function Column({
  direction,
  month,
  allMonths,
}: {
  direction: Direction;
  month: MonthlyMovement;
  allMonths: MonthlyMovement[];
}) {
  const isIn = direction === "in";
  const total = isIn ? month.inTotal : month.outTotal;
  const sources = isIn ? month.inSources : month.outSources;
  const average = isIn ? month.inAvg3mo : month.outAvg3mo;
  const [hoverMonth, setHoverMonth] = useState<MonthlyMovement | null>(null);
  const footLabel = hoverMonth ? hoverMonth.label : "Last 3 months average";
  const footValue = hoverMonth
    ? isIn
      ? hoverMonth.inTotal
      : -hoverMonth.outTotal
    : isIn
      ? average
      : -average;

  return (
    <section className="card mm-card">
      <div className="mm-head">
        <div className="mm-label">
          {isIn ? "Money in" : "Money out"}
          {!isIn && (
            <span className="tip-wrap mm-info">
              <Info width={13} height={13} />
              <span className="tip tip-top-left">
                Includes transactions that move funds out (e.g. payments,
                charges) excluding internal transfers and Credit payments.
              </span>
            </span>
          )}
        </div>
        <div className={`mm-total tnum ${isIn ? "pos" : ""}`}>
          {isIn ? money(total) : money(-total)}
        </div>
      </div>

      <div className="mm-rule" />
      <div className="mm-sub">Top {isIn ? "sources" : "spend"}</div>
      <ul className="mm-list">
        {sources.map((s) => (
          <SourceRow key={s.name} s={s} negative={!isIn} />
        ))}
        <li>
          <button type="button" className="mm-viewall">
            <span className="mm-viewall-ico">
              <ArrowUpRight width={12} height={12} />
            </span>
            View all
          </button>
        </li>
      </ul>

      <div className="mm-rule" />
      <div className="mm-foot">
        <div>
          <div className="mm-avg-label">{footLabel}</div>
          <div className="mm-avg-value tnum">{compact(footValue)}</div>
        </div>
        <MiniBars
          all={allMonths}
          currentKey={month.key}
          direction={direction}
          onHover={setHoverMonth}
        />
      </div>
    </section>
  );
}

export default function MoneyMovement() {
  const [idx, setIdx] = useState(months.length - 1);
  const month = months[idx];
  const prev = () => setIdx((i) => Math.max(0, i - 1));
  const next = () => setIdx((i) => Math.min(months.length - 1, i + 1));

  return (
    <div className="mm-wrap">
      <div className="mm-wrap-head">
        <h3 className="mm-title">Money movement</h3>
        <div className="mm-month-nav">
          <button
            type="button"
            className="mm-nav-btn"
            aria-label="Previous month"
            onClick={prev}
            disabled={idx === 0}
          >
            <Chevron width={14} height={14} style={{ transform: "rotate(90deg)" }} />
          </button>
          <span className="mm-month-label">{month.label}</span>
          <button
            type="button"
            className="mm-nav-btn"
            aria-label="Next month"
            onClick={next}
            disabled={idx === months.length - 1}
          >
            <ChevronRight width={14} height={14} />
          </button>
        </div>
      </div>

      <div className="mm-grid">
        <Column direction="in" month={month} allMonths={months} />
        <Column direction="out" month={month} allMonths={months} />
      </div>
    </div>
  );
}
