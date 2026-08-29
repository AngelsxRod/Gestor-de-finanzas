"use client";

import {
  useEffect,
  useRef,
  type ComponentProps,
  type ReactNode,
} from "react";

export type ModalProps = {
  children: ReactNode;
  className?: string;
  labelledBy: string;
  onClose: () => void;
  open: boolean;
};

export function Modal({
  children,
  className = "",
  labelledBy,
  onClose,
  open,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const previouslyFocusedRef = useRef<Element | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      previouslyFocusedRef.current = document.activeElement;
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    if (!open && previouslyFocusedRef.current instanceof HTMLElement) {
      previouslyFocusedRef.current.focus();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={labelledBy}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      className={`m-auto max-h-[85vh] w-full max-w-lg overflow-auto rounded-[var(--ui-radius-panel)] border-0 bg-[var(--ui-color-surface)] p-0 text-[var(--ui-color-text)] shadow-[var(--ui-shadow-panel)] backdrop:bg-black/60 ${className}`}
    >
      {children}
    </dialog>
  );
}

export type ModalHeaderProps = ComponentProps<"header">;
export type ModalContentProps = ComponentProps<"div">;
export type ModalFooterProps = ComponentProps<"footer">;

export function ModalHeader({ className = "", ...props }: ModalHeaderProps) {
  return (
    <header
      className={`grid gap-[var(--ui-space-2)] p-[var(--ui-space-6)] ${className}`}
      {...props}
    />
  );
}

export function ModalContent({ className = "", ...props }: ModalContentProps) {
  return (
    <div
      className={`px-[var(--ui-space-6)] pb-[var(--ui-space-6)] ${className}`}
      {...props}
    />
  );
}

export function ModalFooter({ className = "", ...props }: ModalFooterProps) {
  return (
    <footer
      className={`flex justify-end gap-[var(--ui-space-3)] px-[var(--ui-space-6)] pb-[var(--ui-space-6)] ${className}`}
      {...props}
    />
  );
}
