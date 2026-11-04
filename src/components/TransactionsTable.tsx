import { useMemo, useState } from "react";
import { transactions, txnTabs } from "../data";
import { money } from "../format";
import type { Transaction } from "../types";
import { ArrowUpRight, Chevron } from "./icons/Icons";
import "./TransactionsTable.css";

type SortKey = "date" | "counterparty" | "amount" | "account";
type SortDir = "asc" | "desc" | null;
type Tab = (typeof txnTabs)[number];

function applyTab(list: Transaction[], tab: Tab): Transaction[] {
  switch (tab) {
    case "Recent":
      return list;
    case "My transactions":
      return list.filter((t) => t.isMine);
    case "Monthly money in":
      return list.filter((t) => t.amount > 0);
    case "Monthly money out":
      return list.filter((t) => t.amount < 0);
    case "Operating expenses":
      return list.filter((t) => t.account === "Ops / Payroll" && t.amount < 0);
  }
}

export default function TransactionsTable() {
  const [tab, setTab] = useState<Tab>(txnTabs[0]);
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);

  const rows = useMemo(() => {
    const filtered = applyTab(transactions, tab);
    if (!sortKey || !sortDir) return filtered;
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "amount") cmp = a.amount - b.amount;
      else cmp = String(a[sortKey]).localeCompare(String(b[sortKey]));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [tab, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else if (sortDir === "asc") setSortDir("desc");
    else {
      setSortKey(null);
      setSortDir(null);
    }
  }

  const arrow = (key: SortKey) =>
    sortKey === key ? (
      <Chevron
        width={12}
        height={12}
        style={{ transform: sortDir === "asc" ? "rotate(180deg)" : "none" }}
      />
    ) : null;

  return (
    <section className="card txns">
      <div className="card-head">
        <h3>Transactions</h3>
        <div className="spacer" />
        <button type="button" className="view-link">
          View all <ArrowUpRight width={13} height={13} />
        </button>
      </div>

      <div className="txn-tabs" role="tablist">
        {txnTabs.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            className={`txn-tab ${tab === t ? "is-active" : ""}`}
            onClick={() => setTab(t)}
            type="button"
          >
            {t}
          </button>
        ))}
      </div>

      <div className="txn-scroll">
        <table className="txn-table">
          <thead>
            <tr>
              <th>
                <button type="button" onClick={() => toggleSort("date")}>
                  Date {arrow("date")}
                </button>
              </th>
              <th>
                <button type="button" onClick={() => toggleSort("counterparty")}>
                  To / From {arrow("counterparty")}
                </button>
              </th>
              <th className="col-amt">
                <button type="button" onClick={() => toggleSort("amount")}>
                  Amount {arrow("amount")}
                </button>
              </th>
              <th>
                <button type="button" onClick={() => toggleSort("account")}>
                  Account {arrow("account")}
                </button>
              </th>
              <th>Method</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="txn-empty">
                  No transactions match this view.
                </td>
              </tr>
            ) : (
              rows.map((t) => (
                <tr key={t.id}>
                  <td className="col-date">{t.date}</td>
                  <td>
                    <div className="cp">
                      <span className="mono cp-mono">{t.monogram}</span>
                      <span className="cp-name">{t.counterparty}</span>
                      {t.status === "failed" && (
                        <span className="tag-failed">Failed</span>
                      )}
                    </div>
                  </td>
                  <td className={`col-amt tnum ${t.amount < 0 ? "" : "pos"}`}>
                    {money(t.amount)}
                  </td>
                  <td className="muted">{t.account}</td>
                  <td className="muted col-method">{t.method}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
