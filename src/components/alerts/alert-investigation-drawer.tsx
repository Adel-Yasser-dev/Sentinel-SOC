"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { StatusPill } from "@/components/ui/status-pill";
import { X, Laptop, Tag, ShieldAlert, Clock } from "lucide-react";

export interface AlertInvestigationData {
  id: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  alert: string;
  status: "Open" | "Resolved" | "False positive";
  technique: string;
  host: string;
  detected: string;
  tactic?: string;
  telemetryAnalysis?: string;
}

interface AlertInvestigationDrawerProps {
  alert: AlertInvestigationData | null;
  onClose: () => void;
  onResolve?: (alertId: string) => void;
}

export function AlertInvestigationDrawer({
  alert,
  onClose,
  onResolve,
}: AlertInvestigationDrawerProps) {
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
            className="relative z-50 w-full max-w-lg bg-card border-l border-border h-full shadow-sh-lg flex flex-col justify-between overflow-y-auto p-6 sm:p-8 rounded-tl-4xl "
          >
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-start justify-between border-b border-border/60 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-mono text-muted-foreground">
                      {alert.id}
                    </span>
                    <SeverityBadge severity={alert.severity} />
                    <StatusPill status={alert.status} />
                  </div>
                  <h3 className="text-[20px] font-heading font-extrabold text-foreground">
                    {alert.alert}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Detail Items */}
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

                <div className="space-y-2">
                  <h4 className="text-[14px] font-semibold text-foreground">
                    Telemetry Analysis
                  </h4>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    {alert.telemetryAnalysis || (
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
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t border-border/60 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (onResolve) {
                    onResolve(alert.id);
                  }
                  onClose();
                }}
                className="flex-1 h-10 px-4 rounded-[10px] text-[13px] font-semibold bg-brand-ink text-brand-paper dark:bg-brand-paper dark:text-brand-ink hover:opacity-90 transition-all shadow-sh-sm"
              >
                Mark Resolved
              </button>
              <button
                type="button"
                onClick={onClose}
                className="h-10 px-4 rounded-[10px] text-[13px] font-semibold border border-border bg-card hover:bg-muted text-foreground transition-all"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
