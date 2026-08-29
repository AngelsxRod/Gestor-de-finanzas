"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ModalState<T> = { mode: "create" } | { mode: "edit"; item: T } | null;

export type ModalContextValue<T> = {
  close: () => void;
  openCreate: () => void;
  openEdit: (item: T) => void;
  state: ModalState<T>;
};

export function createModalContext<T>() {
  const Context = createContext<ModalContextValue<T> | null>(null);

  function Provider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<ModalState<T>>(null);

    const value = useMemo<ModalContextValue<T>>(
      () => ({
        state,
        openCreate: () => setState({ mode: "create" }),
        openEdit: (item: T) => setState({ mode: "edit", item }),
        close: () => setState(null),
      }),
      [state],
    );

    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  function useModalContext(): ModalContextValue<T> {
    const context = useContext(Context);
    if (!context) {
      throw new Error("useModalContext debe usarse dentro de su Provider");
    }
    return context;
  }

  return { Provider, useModalContext };
}
