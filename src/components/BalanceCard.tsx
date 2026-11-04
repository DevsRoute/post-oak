import { useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent as RMouseEvent, ReactNode } from "react";
import { BRAND, balanceSeries, balanceSummary, totalBalance } from "../data";
import { compact, money } from "../format";
import {
  ArrowUpRight,
  Check,
  Chevron,
  Grid,
  Info,
  LineChart,
  ShieldBadge,
} from "./icons/Icons";
import "./BalanceCard.css";

type View = "graph" | "table";
type PeriodKey =
  | "7d"
  | "30d"
  | "90d"
  | "365d"
  | "wtd"
  | "mtd"
  | "qtd"
  | "ytd";

const PERIODS: { key: PeriodKey; label: string; days: number }[] = [
  { key: "7d", label: "Last 7 days", days: 7 },
  { key: "30d", label: "Last 30 days", days: 30 },
  { key: "90d", label: "Last 90 days", days: 90 },
  { key: "365d", label: "Last 365 days", days: 365 },
  { key: "wtd", label: "Week to date", days: 5 },
  { key: "mtd", label: "Month to date", days: 4 },
  { key: "qtd", label: "Quarter to date", days: 35 },
  { key: "ytd", label: "Year to date", days: balanceSeries.length },
];

const W = 760;
const H = 220;

function Tip({
  children,
  content,
  position = "top-left",
}: {
  children: ReactNode;
  content: ReactNode;
  position?: "top-left" | "top-right";
}) {
  return (
    <span className="tip-wrap" tabIndex={0}>
      {children}
      <span className={`tip tip-${position}`} role="tooltip">
        {content}
      </span>
    </span>
  );
}

export default function BalanceCard() {
  const [view, setView] = useState<View>("graph");
  const [periodKey, setPeriodKey] = useState<PeriodKey>("30d");
  const [periodOpen, setPeriodOpen] = useState(false);
  const [hover, setHover] = useState<number | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);
  const periodRef = useRef<HTMLDivElement>(null);

  const period = PERIODS.find((p) => p.key === periodKey)!;

  useEffect(() => {
    if (!periodOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!periodRef.current?.contains(e.target as Node)) setPeriodOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPeriodOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [periodOpen]);

  useEffect(() => {
    if (view !== "graph") setHover(null);
  }, [view]);

  const sliced = useMemo(() => {
    const n = balanceSeries.length;
    const start = Math.max(0, n - period.days);
    return balanceSeries.slice(start);
  }, [period]);

  const geom = useMemo(() => {
    const n = sliced.length;
    const vals = sliced.map((p) => p.value);
    const max = Math.max(...vals);
    const min = Math.min(...vals);
    const pad = (max - min) * 0.18 || 1;
    const top = max + pad;
    const bot = min - pad;
    const xAt = (i: number) => (n <= 1 ? W / 2 : (i / (n - 1)) * W);
    const yAt = (v: number) => H - ((v - bot) / (top - bot)) * H;
    const line = sliced
      .map(
        (p, i) =>
          `${i === 0 ? "M" : "L"}${xAt(i).toFixed(2)},${yAt(p.value).toFixed(2)}`
      )
      .join(" ");
    const area = `${line} L${W},${H} L0,${H} Z`;
    const idxs =
      n >= 5
        ? [0, Math.round(n / 4), Math.round(n / 2), Math.round((3 * n) / 4), n - 1]
        : sliced.map((_, i) => i);
    const ticks = idxs.map((i) => sliced[i]?.label ?? "");
    return { n, xAt, yAt, line, area, ticks };
  }, [sliced]);

  const summary = useMemo(() => {
    let up = 0;
    let down = 0;
    for (let i = 1; i < sliced.length; i++) {
      const d = sliced[i].value - sliced[i - 1].value;
      if (d > 0) up += d;
      else down += d;
    }
    return { up, down };
  }, [sliced]);

  const lastIdx = Math.max(0, geom.n - 1);
  const activeIdx = hover ?? lastIdx;
  const active = sliced[activeIdx];
  const hoverDelta =
    activeIdx > 0 ? active.value - sliced[activeIdx - 1].value : 0;

  const displayAmount = hover === null ? totalBalance : active.value;

  function handleMove(e: RMouseEvent<SVGSVGElement>) {
    const svg = svgRef.current;
    if (!svg || geom.n < 2) return;
    const rect = svg.getBoundingClientRect();
    const rel = (e.clientX - rect.left) / rect.width;
    const idx = Math.round(rel * (geom.n - 1));
    setHover(Math.max(0, Math.min(geom.n - 1, idx)));
  }

  return (
    <section className="card balance-card">
      <div className="balance-top">
        <div className="balance-meta">
          <div className="balance-label">
            <span>{BRAND.name} balance</span>
            <Tip content={balanceSummary.shieldHint}>
              <span className="shield-badge" aria-label="Protection details">
                <ShieldBadge width={22} height={22} />
              </span>
            </Tip>
          </div>
          <div className="balance-amount tnum">{money(displayAmount)}</div>
        </div>
        <div className="balance-controls">
          <div className="seg icon-seg" role="tablist">
            <button
              className={view === "graph" ? "is-active" : ""}
              onClick={() => setView("graph")}
              type="button"
              aria-label="Graph view"
              aria-pressed={view === "graph"}
            >
              <LineChart width={16} height={16} />
            </button>
            <button
              className={view === "table" ? "is-active" : ""}
              onClick={() => setView("table")}
              type="button"
              aria-label="Table view"
              aria-pressed={view === "table"}
            >
              <Grid width={16} height={16} />
            </button>
          </div>
        </div>
      </div>

      {view === "graph" && (
        <div className="balance-sub-row">
          <div className="balance-sub-left" ref={periodRef}>
            {hover === null ? (
              <button
                type="button"
                className="period-btn"
                aria-haspopup="menu"
                aria-expanded={periodOpen}
                onClick={() => setPeriodOpen((o) => !o)}
              >
                {period.label}
                <Chevron
                  width={14}
                  height={14}
                  style={{
                    transform: periodOpen ? "rotate(180deg)" : "none",
                    transition: "transform 0.15s ease",
                  }}
                />
              </button>
            ) : (
              <span className="balance-date">{active.fullLabel}</span>
            )}
            {periodOpen && (
              <div className="period-menu" role="menu">
                {PERIODS.map((p) => {
                  const selected = p.key === periodKey;
                  return (
                    <button
                      key={p.key}
                      type="button"
                      role="menuitem"
                      className={`period-item ${selected ? "is-active" : ""}`}
                      onClick={() => {
                        setPeriodKey(p.key);
                        setPeriodOpen(false);
                        setHover(null);
                      }}
                    >
                      <span className="period-check">
                        {selected && <Check width={13} height={13} />}
                      </span>
                      {p.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          <div className="balance-sub-right">
            {hover === null ? (
              <>
                <span className="delta pos" title="Total upward movement">
                  <ArrowUpRight width={13} height={13} />
                  {compact(summary.up)}
                </span>
                <span className="delta neg" title="Total downward movement">
                  <ArrowUpRight
                    width={13}
                    height={13}
                    style={{ transform: "rotate(90deg)" }}
                  />
                  {compact(summary.down)}
                </span>
              </>
            ) : (
              <span className={`delta ${hoverDelta >= 0 ? "pos" : "neg"}`}>
                <ArrowUpRight
                  width={13}
                  height={13}
                  style={{
                    transform: hoverDelta < 0 ? "rotate(90deg)" : "none",
                  }}
                />
                {money(hoverDelta)}
              </span>
            )}
          </div>
        </div>
      )}

      {view === "graph" ? (
        <div className="chart-wrap">
          <svg
            ref={svgRef}
            className="chart"
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            onMouseMove={handleMove}
            onMouseLeave={() => setHover(null)}
            role="img"
            aria-label="Account balance over time"
          >
            <defs>
              <linearGradient id="nlArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.28" />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={geom.area} fill="url(#nlArea)" />
            <path
              d={geom.line}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
            {hover !== null && geom.n > 1 && (
              <g pointerEvents="none">
                <line
                  x1={geom.xAt(activeIdx)}
                  x2={geom.xAt(activeIdx)}
                  y1={0}
                  y2={H}
                  stroke="var(--accent)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                  vectorEffect="non-scaling-stroke"
                  opacity="0.55"
                />
                <circle
                  cx={geom.xAt(activeIdx)}
                  cy={geom.yAt(active.value)}
                  r="5"
                  fill="var(--surface)"
                  stroke="var(--accent)"
                  strokeWidth="2.5"
                  vectorEffect="non-scaling-stroke"
                />
              </g>
            )}
          </svg>
          <div className="chart-axis-x">
            {geom.ticks.map((t, i) => (
              <span key={i}>{t}</span>
            ))}
          </div>
        </div>
      ) : (
        <div className="balance-table">
          <div className="bt-row">
            <span className="bt-label">Total current</span>
            <span className="tnum">{money(balanceSummary.totalCurrent)}</span>
          </div>
          <div className="bt-row">
            <span className="bt-label">
              Total available
              <Tip content={balanceSummary.availableHint}>
                <span className="info-icon" aria-label="Info">
                  <Info width={13} height={13} />
                </span>
              </Tip>
            </span>
            <span className="tnum">{money(balanceSummary.totalAvailable)}</span>
          </div>
          <div className="bt-row bt-sub">
            <span className="bt-label">Pending transfers</span>
            <span className="tnum">{money(balanceSummary.pendingTransfers)}</span>
          </div>
          <div className="bt-row">
            <span className="bt-label">Pending deposits</span>
            <span className="tnum">{money(balanceSummary.pendingDeposits)}</span>
          </div>
          <p className="bt-foot">{balanceSummary.description}</p>
        </div>
      )}
    </section>
  );
}
