import type { ComponentProps } from "react";

export type TableProps = ComponentProps<"table">;
export type TableHeaderProps = ComponentProps<"thead">;
export type TableBodyProps = ComponentProps<"tbody">;
export type TableRowProps = ComponentProps<"tr">;
export type TableCellProps = ComponentProps<"td"> & {
  as?: "td" | "th";
};

export function Table({ className = "", ...props }: TableProps) {
  return (
    <table
      className={`w-full border-collapse text-left text-[length:var(--ui-font-size-small)] ${className}`}
      {...props}
    />
  );
}

export function TableHeader({ className = "", ...props }: TableHeaderProps) {
  return (
    <thead
      className={`border-b border-[var(--ui-color-border)] ${className}`}
      {...props}
    />
  );
}

export function TableBody({ className = "", ...props }: TableBodyProps) {
  return (
    <tbody
      className={`divide-y divide-[var(--ui-color-border)] ${className}`}
      {...props}
    />
  );
}

export function TableRow({ className = "", ...props }: TableRowProps) {
  return <tr className={`align-middle ${className}`} {...props} />;
}

export function TableCell({
  as: Component = "td",
  className = "",
  ...props
}: TableCellProps) {
  return (
    <Component
      className={`px-[var(--ui-space-4)] py-[var(--ui-space-3)] ${
        Component === "th"
          ? "text-[length:var(--ui-font-size-caption)] font-medium uppercase tracking-[var(--ui-letter-spacing-eyebrow)] text-[var(--ui-color-text-muted)]"
          : "text-[var(--ui-color-text)]"
      } ${className}`}
      {...props}
    />
  );
}
