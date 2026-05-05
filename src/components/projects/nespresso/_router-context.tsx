"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type Page = "home" | "coffee";

type RouterCtx = {
  page: Page;
  navigate: (page: Page) => void;
};

const Ctx = createContext<RouterCtx>({
  page: "home",
  navigate: () => {},
});

export function useRouter() {
  return useContext(Ctx);
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<Page>("home");
  const navigate = useCallback((p: Page) => setPage(p), []);
  const value = useMemo(() => ({ page, navigate }), [page, navigate]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
