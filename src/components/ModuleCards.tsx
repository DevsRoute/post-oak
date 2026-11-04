import { useState } from "react";
import { billPay, creditCard, invoicing } from "../data";
import { money } from "../format";
import { Plus, Dots, Bill, Request, ChevronRight } from "./icons/Icons";
import { useModal } from "../modals/ModalContext";
import "./ModuleCards.css";

function CreditCardProgress() {
  const [hover, setHover] = useState(false);
  const balPct = Math.min(100, (creditCard.balance / creditCard.limit) * 100);
  const pendPct = Math.min(
    100 - balPct,
    (creditCard.pending / creditCard.limit) * 100
  );
  return (
    <div className="progress-wrap">
      <div
        className="progress"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={creditCard.limit}
        aria-valuenow={creditCard.balance + creditCard.pending}
        aria-label={`${money(creditCard.balance)} balance, ${money(creditCard.pending)} pending`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        tabIndex={0}
      >
        <div className="progress-fill" style={{ width: `${balPct}%` }} />
        <div
          className="progress-pend"
          style={{ width: `${pendPct}%`, left: `${balPct}%` }}
        />
        {hover && (
          <div className="progress-tooltip" role="tooltip">
            <div className="tt-row">
              <span className="dot dot-bal" />
              <span>Balance</span>
              <span className="tnum">{money(creditCard.balance)}</span>
            </div>
            <div className="tt-row">
              <span className="dot dot-pend" />
              <span>Pending</span>
              <span className="tnum">{money(creditCard.pending)}</span>
            </div>
            <div className="tt-row">
              <span className="dot dot-avail" />
              <span>Available</span>
              <span className="tnum">{money(creditCard.available)}</span>
            </div>
          </div>
        )}
      </div>
      <div className="progress-legend">
        <span>
          <i className="dot dot-bal" />
          Balance
        </span>
        <span>
          <i className="dot dot-pend" />
          Pending
        </span>
        <span className="muted avail-inline">
          <span className="tnum">{money(creditCard.available, { cents: false })}</span>
          available
        </span>
      </div>
    </div>
  );
}

export function CreditCardModule() {
  const modal = useModal();
  return (
    <section className="card module">
      <div className="card-head">
        <h3>Credit Card</h3>
        <div className="spacer" />
        <button
          className="module-link"
          type="button"
          onClick={() => modal.open("create-card")}
        >
          <Plus width={13} height={13} />
          Create a card
        </button>
        <button className="icon-btn" type="button" aria-label="Module actions">
          <Dots width={18} height={18} />
        </button>
      </div>
      <div className="module-body">
        <CreditCardProgress />
        <div className="module-footer">
          <div className="autopay">
            <span className="muted">Autopay</span>
            <span className="autopay-date">{creditCard.autopayDate}</span>
          </div>
          <button
            className="btn btn-sm btn-accent"
            type="button"
            onClick={() => modal.open("transfer")}
          >
            Pay
          </button>
        </div>
      </div>
    </section>
  );
}

export function BillPayModule() {
  const modal = useModal();
  return (
    <section className="card module">
      <div className="card-head">
        <h3>Bill Pay</h3>
        <div className="spacer" />
        <button
          className="module-link"
          type="button"
          onClick={() => modal.open("upload-bill")}
        >
          <Bill width={13} height={13} />
          Upload bill
        </button>
        <button className="icon-btn" type="button" aria-label="Module actions">
          <Dots width={18} height={18} />
        </button>
      </div>
      <div className="module-body">
        <div className="statline">
          <div className="stat-cell">
            <span className="stat-num tnum">{billPay.outstanding}</span>
            <span className="muted">Outstanding</span>
          </div>
          <div className="stat-cell">
            <span className="stat-num tnum warn">{billPay.overdue}</span>
            <span className="muted">Overdue</span>
          </div>
          <div className="stat-cell">
            <span className="stat-num tnum">{billPay.dueSoon || "–"}</span>
            <span className="muted">Due soon</span>
          </div>
        </div>
        <button
          type="button"
          className="inbox-row"
          onClick={() => modal.open("upload-bill")}
        >
          <span className="inbox-left">
            <strong>Inbox</strong>
            <span className="muted">
              {" "}
              {billPay.inboxItems} items · {billPay.inboxValue}
            </span>
          </span>
          <span className="view-link">
            View <ChevronRight width={13} height={13} />
          </span>
        </button>
      </div>
    </section>
  );
}

export function InvoicingModule() {
  const modal = useModal();
  return (
    <section className="card module">
      <div className="card-head">
        <h3>Invoicing</h3>
        <div className="spacer" />
        <button
          className="module-link"
          type="button"
          onClick={() => modal.open("create-invoice")}
        >
          <Request width={13} height={13} />
          Request money
        </button>
        <button className="icon-btn" type="button" aria-label="Module actions">
          <Dots width={18} height={18} />
        </button>
      </div>
      <div className="module-body">
        <div className="statline">
          <div className="stat-cell">
            <span className="stat-num tnum neg-txt">{invoicing.overdueCount}</span>
            <span className="muted">Overdue · {invoicing.overdueValue}</span>
          </div>
          <div className="stat-cell">
            <span className="stat-num tnum">{invoicing.paidCount}</span>
            <span className="muted">Paid · {invoicing.paidValue}</span>
          </div>
        </div>
        <button
          type="button"
          className="inbox-row"
          onClick={() => modal.open("create-invoice")}
        >
          <span className="inbox-left">
            <strong>Open</strong>
            <span className="muted">
              {" "}
              {invoicing.openCount} items · {invoicing.openValue}
            </span>
          </span>
          <span className="view-link">
            View <ChevronRight width={13} height={13} />
          </span>
        </button>
      </div>
    </section>
  );
}
