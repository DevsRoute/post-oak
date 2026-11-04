import {
  useState,
  type ReactNode,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
} from "react";
import "./ui.css";

/* ---------- Page header ---------- */
export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  );
}

/* ---------- Local (state) tabs ---------- */
export function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: string[];
  active: string;
  onChange: (t: string) => void;
}) {
  return (
    <div className="pill-tabs" role="tablist">
      {tabs.map((t) => (
        <button
          key={t}
          type="button"
          role="tab"
          aria-selected={active === t}
          className={`pill-tab ${active === t ? "is-active" : ""}`}
          onClick={() => onChange(t)}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

/* ---------- Stat tile ---------- */
export function StatTile({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: ReactNode;
  sub?: string;
  tone?: "pos" | "neg" | "warn";
}) {
  return (
    <div className="stat-tile">
      <span className="stat-tile-label">{label}</span>
      <span className={`stat-tile-value tnum ${tone ?? ""}`}>{value}</span>
      {sub && <span className="stat-tile-sub">{sub}</span>}
    </div>
  );
}

/* ---------- Badge ---------- */
export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "pos" | "neg" | "warn" | "accent";
}) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

/* ---------- Empty state ---------- */
export function EmptyState({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <div className="empty-mark" aria-hidden="true" />
      <h3>{title}</h3>
      <p>{message}</p>
      {action}
    </div>
  );
}

/* ---------- Form fields ---------- */
export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className="input" {...props} />;
}

export function Select({
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  return (
    <select className="input select" {...props}>
      {children}
    </select>
  );
}

/* ---------- Monogram avatar ---------- */
export function Mono({ text, size = 32 }: { text: string; size?: number }) {
  return (
    <span
      className="mono"
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      aria-hidden="true"
    >
      {text}
    </span>
  );
}

/* ---------- Toast (self-dismissing) ---------- */
export function useToast() {
  const [msg, setMsg] = useState<string | null>(null);
  const toast = (m: string) => {
    setMsg(m);
    window.setTimeout(() => setMsg(null), 2600);
  };
  const node = msg ? <div className="toast">{msg}</div> : null;
  return { toast, node };
}
