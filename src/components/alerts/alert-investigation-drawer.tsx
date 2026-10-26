"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { StatusPill } from "@/components/ui/status-pill";
import {
  X,
  Laptop,
  Tag,
  ShieldAlert,
  Clock,
  Terminal,
  Cpu,
  ChevronDown,
  ChevronUp,
  FileCode,
} from "lucide-react";
import type { AnalystStatus } from "@/lib/backend-types";

export interface AlertInvestigationData {
  id: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  alert: string;
  status: "Open" | "Resolved" | "False positive" | "Investigating";
  technique: string;
  host: string;
  detected: string;
  tactic?: string;
  telemetryAnalysis?: string;
  processid?: number;
  parentProcessId?: number;
  userId?: number;
  mountNamespace?: number;
  eventName?: string;
  comm?: string;
  rawEvent?: string;
  aiResult?: string;
}

interface AlertInvestigationDrawerProps {
  alert: AlertInvestigationData | null;
  onClose: () => void;
  onResolve?: (alertId: string) => void;
  onUpdateStatus?: (alertId: string, status: AnalystStatus) => void;
}

export function AlertInvestigationDrawer({
  alert,
  onClose,
  onResolve,
  onUpdateStatus,
}: AlertInvestigationDrawerProps) {
  const [showRawEvidence, setShowRawEvidence] = useState(false);

  // Parse raw JSON evidence safely if present
  let parsedRaw: Record<string, unknown> | string | null = null;
  if (alert?.rawEvent) {
    try {
      parsedRaw = JSON.parse(alert.rawEvent) as Record<string, unknown>;
    } catch {
      parsedRaw = alert.rawEvent;
    }
  }

  // Parse AI reasoning result safely if present
  let parsedAi: {
    incident_report?: string;
    alert?: { anomaly_score?: number; model?: string };
    rule_matches?: Array<{ title?: string; rule_id?: string; evidence?: { level?: string; tags?: string[] } }>;
  } | null = null;
  if (alert?.aiResult) {
    try {
      parsedAi = JSON.parse(alert.aiResult);
    } catch {
      parsedAi = null;
    }
  }

  const handleStatusChange = (newStatus: AnalystStatus) => {
    if (!alert) return;
    if (onUpdateStatus) {
      onUpdateStatus(alert.id, newStatus);
    }
    if (newStatus === "resolved" && onResolve) {
      onResolve(alert.id);
    }
  };

  return (
    <AnimatePresence>
      {alert && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Slide-over Drawer Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="relative z-50 w-full max-w-lg bg-card border-l border-border h-full shadow-sh-lg flex flex-col justify-between overflow-y-auto p-6 sm:p-8 rounded-tl-4xl"
          >
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-start justify-between border-b border-border/60 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[12px] font-mono text-muted-foreground">
                      {alert.id}
                    </span>
                    <SeverityBadge severity={alert.severity} />
                    <StatusPill status={alert.status === "Investigating" ? "Open" : alert.status} />
                    {parsedAi?.alert?.anomaly_score !== undefined && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-rose/15 text-brand-rose border border-brand-rose/30">
                        Score: {Math.round(parsedAi.alert.anomaly_score * 100)}%
                      </span>
                    )}
                  </div>
                  <h3 className="text-[20px] font-heading font-extrabold text-foreground">
                    {alert.alert}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  aria-label="Close drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Core Telemetry Properties */}
              <div className="space-y-4 text-[13px]">
                <div className="p-4 rounded-xl bg-muted/40 border border-border/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Laptop className="w-4 h-4" /> Host
                    </span>
                    <span className="font-mono font-bold text-foreground">
                      {alert.host}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Tag className="w-4 h-4" /> MITRE Technique
                    </span>
                    <span className="font-mono font-bold text-foreground">
                      {alert.technique}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4" /> MITRE Tactic
                    </span>
                    <span className="font-semibold text-foreground">
                      {alert.tactic || "Credential Access"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Clock className="w-4 h-4" /> First Detected
                    </span>
                    <span className="text-foreground">{alert.detected}</span>
                  </div>
                </div>

                {/* Process Tree & Kernel Telemetry (Tracee) */}
                {(alert.processid !== undefined || alert.comm) && (
                  <div className="p-4 rounded-xl bg-muted/30 border border-border/50 space-y-2.5">
                    <div className="flex items-center gap-1.5 font-semibold text-foreground text-[12px] uppercase tracking-wider">
                      <Terminal className="w-3.5 h-3.5 text-brand-rose" />
                      <span>Tracee Kernel Process Evidence</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                      <div>
                        <span className="text-muted-foreground">Process: </span>
                        <span className="font-semibold text-foreground">{alert.comm || "unknown"}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">PID: </span>
                        <span className="font-semibold text-foreground">{alert.processid ?? "—"}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Parent PID: </span>
                        <span className="font-semibold text-foreground">{alert.parentProcessId ?? "—"}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">UID: </span>
                        <span className="font-semibold text-foreground">{alert.userId ?? "—"}</span>
                      </div>
                      {alert.mountNamespace && (
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Namespace: </span>
                          <span className="font-semibold text-foreground">{alert.mountNamespace}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* AI Reasoning Summary */}
                <div className="space-y-2">
                  <h4 className="text-[14px] font-semibold text-foreground flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-brand-rose" />
                    <span>Autonomous AI Correlation</span>
                  </h4>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    {alert.telemetryAnalysis || parsedAi?.incident_report || (
                      <>
                        Incident correlation detected anomalous heuristic
                        behavior from endpoint{" "}
                        <span className="font-mono font-semibold text-foreground">
                          {alert.host}
                        </span>
                        . The telemetry sensor flagged recurring pattern
                        signature matching{" "}
                        <span className="font-mono font-semibold text-foreground">
                          {alert.technique}
                        </span>
                        .
                      </>
                    )}
                  </p>
                </div>

                {/* Expandable Raw Tracee Event Evidence */}
                {Boolean(parsedRaw) && (
                  <div className="border border-border/60 rounded-xl overflow-hidden bg-card/50">
                    <button
                      type="button"
                      onClick={() => setShowRawEvidence((prev) => !prev)}
                      className="w-full p-3 flex items-center justify-between text-[12px] font-semibold text-foreground hover:bg-muted/40 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <FileCode className="w-3.5 h-3.5 text-brand-mauve" />
                        <span>Raw Event Payload (JSON)</span>
                      </span>
                      {showRawEvidence ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                    {showRawEvidence && (
                      <div className="p-3 bg-muted/20 border-t border-border/40 max-h-48 overflow-y-auto">
                        <pre className="text-[10px] font-mono text-muted-foreground whitespace-pre-wrap break-all">
                          {JSON.stringify(parsedRaw, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Actions: Full 4-State Triage Controls */}
            <div className="pt-6 border-t border-border/60 space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleStatusChange("investigating")}
                  className="h-10 px-3 rounded-[10px] text-[12px] font-semibold border border-status-warning-500/50 bg-status-warning-500/10 text-status-warning-700 dark:text-status-warning-500 hover:bg-status-warning-500/20 transition-all cursor-pointer"
                >
                  Mark Investigating
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange("resolved")}
                  className="h-10 px-3 rounded-[10px] text-[12px] font-semibold bg-brand-ink text-brand-paper dark:bg-brand-paper dark:text-brand-ink hover:opacity-90 transition-all shadow-sh-sm cursor-pointer"
                >
                  Resolve Incident
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange("false_positive")}
                  className="h-9 px-3 rounded-[10px] text-[12px] font-semibold border border-border bg-card hover:bg-muted text-muted-foreground transition-all cursor-pointer"
                >
                  False Positive
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange("open")}
                  className="h-9 px-3 rounded-[10px] text-[12px] font-semibold border border-border bg-card hover:bg-muted text-muted-foreground transition-all cursor-pointer"
                >
                  Reopen Alert
                </button>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full h-9 rounded-[10px] text-[12px] font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                Close Drawer
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
