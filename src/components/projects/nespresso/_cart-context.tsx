"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Cart = Record<number, number>; // capsule id → sleeve count

type CartCtx = {
  cart: Cart;
  totalItems: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  toggle: () => void;
  add: (id: number, qty?: number) => void;
  setQty: (id: number, qty: number) => void;
  remove: (id: number) => void;
  clear: () => void;
};

const STORAGE_KEY = "nespresso-cart";

const Ctx = createContext<CartCtx>({
  cart: {},
  totalItems: 0,
  open: false,
  setOpen: () => {},
  toggle: () => {},
  add: () => {},
  setQty: () => {},
  remove: () => {},
  clear: () => {},
});

export function useCart() {
  return useContext(Ctx);
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>({});
  const [open, setOpen] = useState(false);

  // Hydrate from localStorage on mount.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setCart(JSON.parse(saved));
    } catch {
      /* malformed JSON or storage disabled */
    }
  }, []);

  // Persist on change.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      /* storage full / disabled */
    }
  }, [cart]);

  // Cross-tab + cross-iframe sync: listen for storage events.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setCart(JSON.parse(e.newValue));
        } catch {
          /* ignore */
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const add = useCallback((id: number, qty = 1) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + qty }));
  }, []);

  const setQty = useCallback((id: number, qty: number) => {
    setCart((prev) => {
      if (qty <= 0) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: qty };
    });
  }, []);

  const remove = useCallback((id: number) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const clear = useCallback(() => setCart({}), []);

  const toggle = useCallback(() => setOpen((v) => !v), []);

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);

  const value = useMemo<CartCtx>(
    () => ({ cart, totalItems, open, setOpen, toggle, add, setQty, remove, clear }),
    [cart, totalItems, open, toggle, add, setQty, remove, clear]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
