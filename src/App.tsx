import { useEffect, useState } from "react";
import { BRAND } from "./data";
import { useTheme } from "./useTheme";
import { ModalProvider } from "./modals/ModalContext";
import ModalHost from "./modals/ModalHost";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import Home from "./pages/Home";

export default function App() {
  const { choice, theme, setChoice } = useTheme();
  const [privateMode, setPrivateMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.title = BRAND.name;
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <ModalProvider>
      <div
        className={`app ${privateMode ? "is-private" : ""} ${sidebarOpen ? "sidebar-open" : ""}`}
        data-resolved-theme={theme}
      >
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div
          className="sidebar-scrim"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
        <div className="main">
          <TopBar
            themeChoice={choice}
            onChangeTheme={setChoice}
            privateMode={privateMode}
            onTogglePrivate={() => setPrivateMode((p) => !p)}
            onOpenSidebar={() => setSidebarOpen(true)}
          />
          <main className="content">
            <Home />
          </main>
        </div>
        <ModalHost />
      </div>
    </ModalProvider>
  );
}
