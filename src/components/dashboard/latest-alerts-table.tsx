"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { StatusPill } from "@/components/ui/status-pill";
import { ChevronRight } from "lucide-react";
import { AlertInvestigationDrawer } from "@/components/alerts/alert-investigation-drawer";

import { useTelemetry } from "@/lib/telemetry-context";
import { formatTime } from "@/lib/backend-api";

export interface AlertItem {
  id: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  alert: string;
  status: "Open" | "Resolved" | "False positive";
  technique: string;
  host: string;
  detected: string;
  tactic?: string;
  processid?: number;
  parentProcessId?: number;
  userId?: number;
  mountNamespace?: number;
  eventName?: string;
  comm?: string;
  rawEvent?: string;
  aiResult?: string;
}

export const sampleLatestAlerts: AlertItem[] = [
  {
    id: "ALT-101",
    severity: "Critical",
    alert: "Brute force login attempts",
    status: "Open",
    technique: "T1110",
    host: "HR-LAPTOP-14",
    detected: "11 h ago",
    tactic: "Credential Access",
  },
  {
    id: "ALT-102",
    severity: "High",
    alert: "Large upload to unknown host",
    status: "Resolved",
    technique: "T1048",
    host: "VPN-GW",
    detected: "11 h ago",
    tactic: "Exfiltration",
  },
  {
    id: "ALT-103",
    severity: "Low",
    alert: "Large upload to unknown host",
    status: "False positive",
    technique: "T1053",
    host: "FIN-PC-07",
    detected: "11 h ago",
    tactic: "Credential Access",
  },
  {
    id: "ALT-104",
    severity: "Critical",
    alert: "Brute force login attempts",
    status: "Open",
    technique: "T1110",
    host: "HR-LAPTOP-14",
    detected: "11 h ago",
    tactic: "Credential Access",
  },
  {
    id: "ALT-105",
    severity: "High",
    alert: "Large upload to unknown host",
    status: "Resolved",
    technique: "T1048",
    host: "VPN-GW",
    detected: "11 h ago",
    tactic: "Exfiltration",
  },
  {
    id: "ALT-106",
    severity: "Low",
    alert: "Large upload to unknown host",
    status: "False positive",
    technique: "T1053",
    host: "FIN-PC-07",
    detected: "11 h ago",
    tactic: "Credential Access",
  },
  {
    id: "ALT-107",
    severity: "Critical",
    alert: "Brute force login attempts",
    status: "Open",
    technique: "T1110",
    host: "HR-LAPTOP-14",
    detected: "11 h ago",
    tactic: "Credential Access",
  },
  {
    id: "ALT-108",
    severity: "High",
    alert: "Large upload to unknown host",
    status: "Resolved",
    technique: "T1048",
    host: "VPN-GW",
    detected: "11 h ago",
    tactic: "Exfiltration",
  },
];

export function LatestAlertsTable({ delay = 0.66 }: { delay?: number }) {
  const { events, updateStatus } = useTelemetry();
  const [investigatingAlert, setInvestigatingAlert] =
    useState<AlertItem | null>(null);

  const alerts: AlertItem[] = React.useMemo(() => {
    return events.slice(0, 8).map((evt) => {
      const severityMap: Record<string, "Critical" | "High" | "Medium" | "Low"> = {
        critical: "Critical",
        high: "High",
        medium: "Medium",
        low: "Low",
      };

      const statusMap: Record<string, "Open" | "Resolved" | "False positive"> = {
        open: "Open",
        investigating: "Open",
        resolved: "Resolved",
        false_positive: "False positive",
      };

      return {
        id: evt.alertId || `ALT-${evt.id}`,
        severity: severityMap[evt.severity || "medium"] || "Medium",
        alert: evt.title,
        status: statusMap[evt.status] || "Open",
        technique: evt.technique,
        host: evt.hostName || "Unknown host",
        detected: evt.timestamp ? formatTime(evt.timestamp) : "Recently",
        tactic: evt.tactic,
        processid: evt.processid,
        parentProcessId: evt.parentProcessId,
        userId: evt.userId,
        mountNamespace: evt.mountNamespace,
        eventName: evt.eventName ?? undefined,
        comm: evt.comm ?? undefined,
        rawEvent: evt.rawEvent ?? undefined,
        aiResult: evt.aiResult ?? undefined,
      };
    });
  }, [events]);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.45,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
        whileHover={{ y: -3, transition: { duration: 0.2 } }}
        className="p-5 sm:p-6 rounded-2xl border border-border bg-card shadow-sh-sm space-y-4 hover:border-border/80 hover:shadow-sh-md transition-shadow cursor-default"
      >
        {/* Title */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-[17px] font-heading font-extrabold text-foreground">
              Latest Alerts
            </h3>
            <p className="text-[12px] text-muted-foreground">
              Select any incident to inspect telemetry and triage
            </p>
          </div>
          <Link
            href="/alerts"
            className="text-[12px] font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            <span>View all alerts</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-[13px]">
            <thead>
              <tr className="border-b border-border/70 text-muted-foreground font-semibold">
                <th className="py-3 pr-4">Severity</th>
                <th className="py-3 px-4">Alert</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Technique</th>
                <th className="py-3 px-4">Host</th>
                <th className="py-3 pl-4 text-right">Detected</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {alerts.map((row, idx) => (
                <tr
                  key={`${row.id}-${idx}`}
                  onClick={() => setInvestigatingAlert(row)}
                  className="hover:bg-muted/40 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 pr-4">
                    <SeverityBadge severity={row.severity} />
                  </td>
                  <td className="py-3.5 px-4 font-medium text-foreground group-hover:text-primary transition-colors">
                    {row.alert}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusPill status={row.status} />
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[12px] text-muted-foreground">
                    {row.technique}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[12px] text-foreground font-medium">
                    {row.host}
                  </td>
                  <td className="py-3.5 pl-4 text-[12px] text-muted-foreground text-right">
                    {row.detected}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Slide-over Investigation Drawer */}
      <AlertInvestigationDrawer
        alert={investigatingAlert}
        onClose={() => setInvestigatingAlert(null)}
        onResolve={(id) => {
          updateStatus(id, "resolved");
        }}
        onUpdateStatus={(id, status) => {
          updateStatus(id, status);
        }}
      />
    </>
  );
}
