import { createContext, useContext, useState, type ReactNode } from "react";

export type ModalName =
  | "move-money"
  | "send"
  | "transfer"
  | "deposit"
  | "request"
  | "upload-bill"
  | "create-account"
  | "create-card"
  | "create-invoice"
  | "command";

interface ModalState {
  name: ModalName | null;
  open: (name: ModalName) => void;
  close: () => void;
}

const Ctx = createContext<ModalState | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [name, setName] = useState<ModalName | null>(null);
  const open = (n: ModalName) => setName(n);
  const close = () => setName(null);
  return <Ctx.Provider value={{ name, open, close }}>{children}</Ctx.Provider>;
}

export function useModal(): ModalState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useModal must be used within ModalProvider");
  return ctx;
}
