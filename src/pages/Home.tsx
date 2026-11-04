import { useState } from "react";
import DashboardHeader from "../components/DashboardHeader";
import BalanceCard from "../components/BalanceCard";
import AccountsCard from "../components/AccountsCard";
import DisputesCard from "../components/DisputesCard";
import {
  BillPayModule,
  CreditCardModule,
  InvoicingModule,
} from "../components/ModuleCards";
import MoneyMovement from "../components/MoneyMovement";
import TransactionsTable from "../components/TransactionsTable";
import FeedbackDialog from "../components/FeedbackDialog";

export type SectionKey = "disputes" | "credit" | "bill-pay" | "invoicing";

export default function Home() {
  const [hidden, setHidden] = useState<Set<SectionKey>>(new Set());
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const toggleHidden = (key: SectionKey) =>
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const modules = [
    { key: "disputes" as const, node: <DisputesCard /> },
    { key: "credit" as const, node: <CreditCardModule /> },
    { key: "bill-pay" as const, node: <BillPayModule /> },
    { key: "invoicing" as const, node: <InvoicingModule /> },
  ].filter((m) => !hidden.has(m.key));

  return (
    <>
      <DashboardHeader
        hidden={hidden}
        onToggle={toggleHidden}
        onRequestFeature={() => setFeedbackOpen(true)}
      />
      <div className="stack">
        <div className="row">
          <div className="row-col" style={{ flex: "1 1 60%", minWidth: 0 }}>
            <BalanceCard />
          </div>
          <div className="row-col" style={{ flex: "1 1 40%", minWidth: 0 }}>
            <AccountsCard />
          </div>
        </div>
        {modules.length > 0 && (
          <div className="module-grid">{modules.map((m) => (
            <div key={m.key} className="module-cell">{m.node}</div>
          ))}</div>
        )}
        <MoneyMovement />
        <TransactionsTable />
      </div>
      {feedbackOpen && <FeedbackDialog onClose={() => setFeedbackOpen(false)} />}
    </>
  );
}
