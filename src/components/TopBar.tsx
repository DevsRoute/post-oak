import { useEffect, useRef, useState } from "react";
import { BRAND } from "../data";
import {
  ArrowLeft,
  ArrowSwap,
  Bell,
  Bill,
  Check,
  ChevronRight,
  Deposit,
  ExternalLink,
  Eye,
  EyeOff,
  Gear,
  Menu,
  MessageSquare,
  Monitor,
  Moon,
  Request,
  Search,
  Send,
  Sun,
  Transfer,
} from "./icons/Icons";
import type { Theme, ThemeChoice } from "../useTheme";
import { useModal, type ModalName } from "../modals/ModalContext";
import "./TopBar.css";

interface Props {
  themeChoice: ThemeChoice;
  onChangeTheme: (c: ThemeChoice) => void;
  privateMode: boolean;
  onTogglePrivate: () => void;
  onOpenSidebar: () => void;
}

const MOVE_ACTIONS: { label: string; Icon: typeof Send; modal: ModalName }[] = [
  { label: "Send", Icon: Send, modal: "send" },
  { label: "Transfer", Icon: Transfer, modal: "transfer" },
  { label: "Deposit", Icon: Deposit, modal: "deposit" },
  { label: "Request", Icon: Request, modal: "request" },
  { label: "Upload bill", Icon: Bill, modal: "upload-bill" },
];

function useOutside<T extends HTMLElement>(
  open: boolean,
  close: () => void
): React.RefObject<T> {
  const ref = useRef<T>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);
  return ref;
}

export default function TopBar({
  themeChoice,
  onChangeTheme,
  privateMode,
  onTogglePrivate,
  onOpenSidebar,
}: Props) {
  const modal = useModal();
  const [moveOpen, setMoveOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [userView, setUserView] = useState<"main" | "appearance">("main");

  const moveRef = useOutside<HTMLDivElement>(moveOpen, () => setMoveOpen(false));
  const bellRef = useOutside<HTMLDivElement>(bellOpen, () => setBellOpen(false));
  const userRef = useOutside<HTMLDivElement>(userOpen, () => {
    setUserOpen(false);
    setUserView("main");
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        modal.open("command");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modal]);

  return (
    <header className="topbar">
      <button
        type="button"
        className="icon-btn tb-menu-trigger"
        aria-label="Open menu"
        onClick={onOpenSidebar}
      >
        <Menu width={20} height={20} />
      </button>
      <span className="tip-wrap">
        <button
          className="search"
          type="button"
          onClick={() => modal.open("command")}
        >
          <Search width={15} height={15} />
          <span>Search for anything</span>
        </button>
        <span className="tip tip-bottom-left">
          Search everywhere <kbd className="tip-kbd">⌘K</kbd>
        </span>
      </span>

      <div className="topbar-actions">
        {/* Move money */}
        <div className="tb-anchor" ref={moveRef}>
          <button
            className="tb-text-btn"
            type="button"
            onClick={() => setMoveOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={moveOpen}
          >
            <ArrowSwap width={15} height={15} />
            Move money
          </button>
          {moveOpen && (
            <div className="tb-menu tb-menu-right" role="menu">
              {MOVE_ACTIONS.map(({ label, Icon, modal: name }) => (
                <button
                  key={label}
                  type="button"
                  role="menuitem"
                  className="tb-menu-item"
                  onClick={() => {
                    setMoveOpen(false);
                    modal.open(name);
                  }}
                >
                  <Icon width={15} height={15} />
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Private mode */}
        <span className="tip-wrap">
          <button
            className="icon-btn"
            type="button"
            aria-label={privateMode ? "Show dollar amounts" : "Hide dollar amounts"}
            aria-pressed={privateMode}
            onClick={onTogglePrivate}
          >
            {privateMode ? (
              <EyeOff width={18} height={18} />
            ) : (
              <Eye width={18} height={18} />
            )}
          </button>
          <span className="tip tip-bottom-center">
            {privateMode ? "Show" : "Hide"} dollar amounts
          </span>
        </span>

        {/* Settings */}
        <span className="tip-wrap">
          <button className="icon-btn" type="button" aria-label="Settings">
            <Gear width={18} height={18} />
          </button>
          <span className="tip tip-bottom-center">Settings</span>
        </span>

        {/* Updates */}
        <div className="tb-anchor" ref={bellRef}>
          <span className="tip-wrap">
            <button
              className="icon-btn"
              type="button"
              aria-label="Updates"
              aria-expanded={bellOpen}
              onClick={() => setBellOpen((o) => !o)}
            >
              <Bell width={18} height={18} />
            </button>
            {!bellOpen && <span className="tip tip-bottom-center">Updates</span>}
          </span>
          {bellOpen && (
            <div className="tb-menu tb-updates" role="menu">
              <div className="tb-updates-head">
                <span className="tb-updates-title">Updates</span>
                <button
                  type="button"
                  className="icon-btn"
                  aria-label="Mark all read"
                >
                  <Check width={14} height={14} />
                </button>
              </div>
              <div className="tb-updates-empty">No updates</div>
            </div>
          )}
        </div>

        {/* User avatar + menu */}
        <div className="tb-anchor" ref={userRef}>
          <button
            className="user"
            type="button"
            aria-expanded={userOpen}
            onClick={() => {
              setUserOpen((o) => !o);
              setUserView("main");
            }}
          >
            <span className="user-avatar">{BRAND.userName.charAt(0)}</span>
          </button>
          {userOpen && (
            <div className="tb-menu tb-user-menu" role="menu">
              {userView === "main" ? (
                <>
                  <div className="tb-user-card">
                    <span className="user-avatar user-avatar-lg">
                      {BRAND.userName.charAt(0)}
                    </span>
                    <div className="tb-user-info">
                      <div className="tb-user-name">{BRAND.userName}</div>
                      <div className="tb-user-email">{BRAND.userEmail}</div>
                    </div>
                  </div>
                  <div className="tb-menu-sep" />
                  <button type="button" role="menuitem" className="tb-menu-item">
                    Profile
                  </button>
                  <button type="button" role="menuitem" className="tb-menu-item">
                    Notifications
                  </button>
                  <button type="button" role="menuitem" className="tb-menu-item">
                    Security
                  </button>
                  <button type="button" role="menuitem" className="tb-menu-item">
                    Privacy
                    <ExternalLink width={13} height={13} className="tb-trailing-ico" />
                  </button>
                  <button type="button" role="menuitem" className="tb-menu-item">
                    Perks
                    <ExternalLink width={13} height={13} className="tb-trailing-ico" />
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    className="tb-menu-item tb-menu-item-deep"
                    onClick={() => setUserView("appearance")}
                  >
                    <span className="tb-menu-text">
                      <span>Appearance</span>
                      <span className="tb-menu-sub">
                        {themeChoice === "system"
                          ? "System default"
                          : themeChoice === "dark"
                            ? "Dark mode"
                            : "Light mode"}
                      </span>
                    </span>
                    <ChevronRight
                      width={14}
                      height={14}
                      className="tb-trailing-ico"
                    />
                  </button>
                  <div className="tb-menu-sep" />
                  <button
                    type="button"
                    role="menuitem"
                    className="tb-menu-item"
                    onClick={() => {
                      setUserOpen(false);
                      modal.open("upload-bill");
                    }}
                  >
                    <MessageSquare width={14} height={14} />
                    Help
                  </button>
                  <button type="button" role="menuitem" className="tb-menu-item">
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="tb-menu-back"
                    onClick={() => setUserView("main")}
                  >
                    <ArrowLeft width={14} height={14} />
                    Appearance
                  </button>
                  <div className="tb-menu-sep" />
                  <ThemeOption
                    icon={<Monitor width={14} height={14} />}
                    label="System default"
                    sub="We'll match your system preferences"
                    selected={themeChoice === "system"}
                    onClick={() => onChangeTheme("system")}
                  />
                  <ThemeOption
                    icon={<Moon width={14} height={14} />}
                    label="Dark mode"
                    selected={themeChoice === "dark"}
                    onClick={() => onChangeTheme("dark")}
                  />
                  <ThemeOption
                    icon={<Sun width={14} height={14} />}
                    label="Light mode"
                    selected={themeChoice === "light"}
                    onClick={() => onChangeTheme("light")}
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function ThemeOption({
  icon,
  label,
  sub,
  selected,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  sub?: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      className={`tb-menu-item ${selected ? "is-selected" : ""}`}
      onClick={onClick}
    >
      {selected ? <Check width={14} height={14} /> : <span className="tb-menu-ico-slot">{icon}</span>}
      <span className="tb-menu-text">
        <span>{label}</span>
        {sub && <span className="tb-menu-sub">{sub}</span>}
      </span>
    </button>
  );
}

// Re-export for TS prop compatibility
export type { Theme };
