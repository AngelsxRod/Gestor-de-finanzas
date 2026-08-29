"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type TransactionModalContextValue = {
  close: () => void;
  isOpen: boolean;
  open: () => void;
};

const TransactionModalContext =
  createContext<TransactionModalContextValue | null>(null);

export function TransactionModalProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const value = useMemo<TransactionModalContextValue>(
    () => ({
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }),
    [isOpen],
  );

  return (
    <TransactionModalContext.Provider value={value}>
      {children}
    </TransactionModalContext.Provider>
  );
}

export function useTransactionModal(): TransactionModalContextValue {
  const context = useContext(TransactionModalContext);

  if (!context) {
    throw new Error(
      "useTransactionModal debe usarse dentro de su Provider",
    );
  }

  return context;
}
