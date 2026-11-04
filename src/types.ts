export interface Account {
  id: string;
  name: string;
  balance: number;
  kind?: "depository" | "treasury" | "credit";
  pendingIn: number;
  pendingOut: number;
  available: number;
}

export interface NavChild {
  label: string;
  badge?: string;
}

export interface NavItem {
  label: string;
  icon: string;
  badge?: string;
  tag?: string;
  active?: boolean;
  children?: NavChild[];
}

export interface PartyStat {
  name: string;
  amount: number;
}

export interface Bookmark {
  label: string;
  amount?: number;
}

export type TxnStatus = "settled" | "pending" | "failed";

export interface Transaction {
  id: string;
  date: string;
  counterparty: string;
  monogram: string;
  amount: number;
  account: string;
  method: string;
  status: TxnStatus;
  isMine?: boolean;
}

export interface ChartPoint {
  label: string;
  fullLabel: string;
  iso: string;
  value: number;
}

export interface MonthlyMovement {
  key: string;
  label: string;
  inTotal: number;
  outTotal: number;
  inAvg3mo: number;
  outAvg3mo: number;
  inSources: PartyStat[];
  outSources: PartyStat[];
}
