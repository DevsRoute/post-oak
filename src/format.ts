export function money(n: number, opts: { cents?: boolean; sign?: boolean } = {}): string {
  const { cents = true, sign = false } = opts;
  const abs = Math.abs(n);
  const str = abs.toLocaleString("en-US", {
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  });
  const prefix = n < 0 ? "−" : sign ? "+" : "";
  return `${prefix}$${str}`;
}

export function compact(n: number): string {
  const abs = Math.abs(n);
  const prefix = n < 0 ? "−$" : "$";
  if (abs >= 1_000_000) return `${prefix}${(abs / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (abs >= 1_000) return `${prefix}${Math.round(abs / 1_000)}K`;
  return `${prefix}${abs}`;
}
