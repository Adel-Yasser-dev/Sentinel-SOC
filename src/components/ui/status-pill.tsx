import React from "react";

export type StatusType =
  | "Open"
  | "Resolved"
  | "False positive"
  | "Investigating";

export function StatusPill({
  status,
  className = "",
}: {
  status: StatusType | string;
  className?: string;
}) {
  const s = status.toLowerCase();

  if (s === "open") {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-status-warning-500/60 bg-status-warning-100 text-status-warning-700 dark:bg-status-warning-500/15 dark:text-status-warning-100 ${className}`}
      >
        Open
      </span>
    );
  }

  if (s === "resolved") {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-status-success-500/60 bg-status-success-100 text-status-success-700 dark:bg-status-success-500/15 dark:text-status-success-100 ${className}`}
      >
        Resolved
      </span>
    );
  }

  if (s === "false positive" || s === "falsepositive") {
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-status-error-500/60 bg-status-error-100 text-status-error-700 dark:bg-status-error-500/15 dark:text-status-error-100 ${className}`}
      >
        False positive
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-status-info-500/60 bg-status-info-100 text-status-info-700 dark:bg-status-info-500/15 dark:text-status-info-100 ${className}`}
    >
      {status}
    </span>
  );
}
