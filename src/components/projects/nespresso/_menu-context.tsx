"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type MenuCtx = {
  open: boolean;
  toggle: () => void;
  setOpen: (v: boolean) => void;
};

const Ctx = createContext<MenuCtx>({
  open: false,
  toggle: () => {},
  setOpen: () => {},
});

export function useMenu() {
  return useContext(Ctx);
}

export function MenuProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const toggle = useCallback(() => setOpen((v) => !v), []);
  const value = useMemo(() => ({ open, toggle, setOpen }), [open, toggle]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
