import React from "react";
import { AlertCircle, AlertTriangle, ShieldCheck, Info } from "lucide-react";

export type SeverityType = "Critical" | "High" | "Medium" | "Low" | "Info";

export function SeverityBadge({
  severity,
  className = "",
}: {
  severity: SeverityType | string;
  className?: string;
}) {
  const norm = severity.charAt(0).toUpperCase() + severity.slice(1).toLowerCase();

  switch (norm) {
    case "Critical":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-status-error-500 text-white shadow-sm ${className}`}
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Critical</span>
        </span>
      );
    case "High":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-status-warning-500 text-status-warning-700 shadow-sm ${className}`}
        >
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>High</span>
        </span>
      );
    case "Medium":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-[#ecd27a] text-status-warning-700 shadow-sm ${className}`}
        >
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>Medium</span>
        </span>
      );
    case "Low":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-status-success-500 text-white shadow-sm ${className}`}
        >
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span>Low</span>
        </span>
      );
    case "Info":
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-status-info-500 text-brand-ink shadow-sm ${className}`}
        >
          <Info className="w-3.5 h-3.5 shrink-0" />
          <span>{norm}</span>
        </span>
      );
  }
}
