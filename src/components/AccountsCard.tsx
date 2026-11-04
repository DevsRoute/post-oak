import { useEffect, useRef, useState } from "react";
import { accounts, extraAccountCount } from "../data";
import { money } from "../format";
import AccountMark from "./icons/AccountMark";
import { ArrowSwap, Dots, FileText, Plus } from "./icons/Icons";
import { useModal } from "../modals/ModalContext";
import "./AccountsCard.css";

export default function AccountsCard() {
  const modal = useModal();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <section className="card accounts-card">
      <div className="card-head">
        <h3>Accounts</h3>
        <div className="spacer" />
        <span className="tip-wrap">
          <button
            type="button"
            className="chip-btn"
            aria-label="Create account"
            onClick={() => modal.open("create-account")}
          >
            <Plus width={16} height={16} />
          </button>
          <span className="tip tip-top-center">Create account</span>
        </span>
        <div className="menu-anchor" ref={menuRef}>
          <button
            type="button"
            className="chip-btn"
            aria-label="More actions"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <Dots width={16} height={16} />
          </button>
          {menuOpen && (
            <div className="acct-menu" role="menu">
              <button type="button" role="menuitem" className="acct-menu-item">
                <FileText width={15} height={15} />
                Statements
              </button>
              <button type="button" role="menuitem" className="acct-menu-item">
                <ArrowSwap width={15} height={15} />
                Auto transfer rules
              </button>
            </div>
          )}
        </div>
      </div>

      <ul className="account-list">
        {accounts.map((a) => (
          <li key={a.id}>
            <button type="button" className="account-row">
              <span className="account-mark">
                <AccountMark width={26} height={26} />
              </span>
              <span className="account-name">{a.name}</span>
              <span className="account-balance tnum">{money(a.balance)}</span>
              <span className="acct-row-tip" role="tooltip">
                <span className="art-row">
                  <span>Pending in</span>
                  <span className="tnum">{money(a.pendingIn)}</span>
                </span>
                <span className="art-row">
                  <span>Pending out</span>
                  <span className="tnum">{money(a.pendingOut)}</span>
                </span>
                <span className="art-sep" />
                <span className="art-row">
                  <span>Available</span>
                  <span className="tnum">{money(a.available)}</span>
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <button type="button" className="accounts-footer">
        <span className="accounts-extra-chip">+{extraAccountCount}</span>
        <span>View all accounts</span>
      </button>
    </section>
  );
}
