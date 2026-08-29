"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const DESKTOP_MEDIA_QUERY = "(min-width: 1024px)";

type ShellContextValue = {
  closeMobileNav: () => void;
  isMobileNavOpen: boolean;
  openMobileNav: () => void;
  toggleMobileNav: () => void;
};

const ShellContext = createContext<ShellContextValue | null>(null);

export function ShellProvider({ children }: { children: ReactNode }) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    const desktopQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
    function handleChange(event: MediaQueryListEvent) {
      if (event.matches) setIsMobileNavOpen(false);
    }
    desktopQuery.addEventListener("change", handleChange);
    return () => desktopQuery.removeEventListener("change", handleChange);
  }, []);

  const value = useMemo<ShellContextValue>(
    () => ({
      isMobileNavOpen,
      openMobileNav: () => setIsMobileNavOpen(true),
      closeMobileNav: () => setIsMobileNavOpen(false),
      toggleMobileNav: () => setIsMobileNavOpen((open) => !open),
    }),
    [isMobileNavOpen],
  );

  return (
    <ShellContext.Provider value={value}>{children}</ShellContext.Provider>
  );
}

export function useShell(): ShellContextValue {
  const context = useContext(ShellContext);
  if (!context) {
    throw new Error("useShell debe usarse dentro de ShellProvider");
  }
  return context;
}
