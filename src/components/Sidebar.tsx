import { useState } from "react";
import { bookmarks, navItems } from "../data";
import { compact } from "../format";
import { iconMap, Chevron, Close, Grip } from "./icons/Icons";
import Wordmark from "./Wordmark";
import "./Sidebar.css";

const productTabs = ["Banking", "Payroll", "Books"];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: Props) {
  const [activeTab, setActiveTab] = useState("Banking");
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  return (
    <aside className={`sidebar ${open ? "is-open" : ""}`}>
      <button
        type="button"
        className="sidebar-close"
        aria-label="Close menu"
        onClick={onClose}
      >
        <Close width={18} height={18} />
      </button>
      <button className="workspace" type="button">
        <Wordmark width={160} />
        <Chevron width={15} height={15} className="workspace-caret" />
      </button>

      <div className="product-switcher" role="group" aria-label="Product switcher">
        {productTabs.map((t) => (
          <button
            key={t}
            type="button"
            className={`product-tab ${activeTab === t ? "is-active" : ""}`}
            onClick={() => setActiveTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <nav className="nav">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon];
          const isOpen = openGroup === item.label;
          const hasChildren = Boolean(item.children && item.children.length);
          return (
            <div key={item.label} className="nav-group">
              <button
                type="button"
                className={`nav-item ${item.active ? "is-active" : ""}`}
                onClick={() => {
                  if (hasChildren) {
                    setOpenGroup((g) => (g === item.label ? null : item.label));
                  }
                }}
                aria-expanded={hasChildren ? isOpen : undefined}
              >
                <span className="nav-ico">{Icon ? <Icon width={17} height={17} /> : null}</span>
                <span className="nav-label">{item.label}</span>
                {item.badge && <span className="nav-badge">{item.badge}</span>}
                {item.tag && <span className="nav-tag">{item.tag}</span>}
                {hasChildren && (
                  <Chevron
                    width={13}
                    height={13}
                    className="nav-caret"
                    style={{ transform: isOpen ? "rotate(180deg)" : "none" }}
                  />
                )}
              </button>
              {hasChildren && isOpen && (
                <div className="nav-children">
                  {item.children!.map((c) => (
                    <button key={c.label} type="button" className="nav-child">
                      {c.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="bookmarks">
        <div className="bookmarks-head">Bookmarks</div>
        <ul className="bookmark-list">
          {bookmarks.map((b) => (
            <li key={b.label} className="bookmark">
              <Grip width={14} height={14} className="bookmark-grip" />
              <button type="button" className="bookmark-link">
                <span>{b.label}</span>
                {b.amount != null && (
                  <span className="bookmark-amt tnum">{compact(b.amount)}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
