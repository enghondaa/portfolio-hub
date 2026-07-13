import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export interface TableColumn<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  /** Right-align numeric columns. */
  align?: "left" | "right";
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  getRowId: (row: T) => string;
  caption?: string;
  emptyMessage?: string;
  className?: string;
}

/**
 * Semantic, responsive data table. Scrolls horizontally on narrow viewports
 * instead of overflowing the page, and uses <caption>/scope attributes for
 * screen-reader table navigation.
 */
export function Table<T>({
  columns,
  data,
  getRowId,
  caption,
  emptyMessage = "No data to show.",
  className,
}: TableProps<T>) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
        {caption && (
          <caption className="mb-2 text-left text-sm text-[var(--color-neutral-600)]">
            {caption}
          </caption>
        )}
        <thead>
          <tr className="border-b border-[var(--color-neutral-200)]">
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={cn(
                  "whitespace-nowrap px-3 py-2 font-medium text-[var(--color-neutral-600)]",
                  column.align === "right" && "text-right"
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-3 py-6 text-center text-[var(--color-neutral-600)]">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={getRowId(row)} className="border-b border-[var(--color-neutral-100)]">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      "whitespace-nowrap px-3 py-2 text-[var(--color-neutral-800)]",
                      column.align === "right" && "text-right font-[var(--font-mono)]"
                    )}
                  >
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
