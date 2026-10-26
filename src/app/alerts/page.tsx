"use client";

import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { StatusPill } from "@/components/ui/status-pill";
import { AlertInvestigationDrawer } from "@/components/alerts/alert-investigation-drawer";
import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { useTelemetry } from "@/lib/telemetry-context";
import { formatTime } from "@/lib/backend-api";

interface AlertRecord {
  id: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  alert: string;
  status: "Open" | "Resolved" | "False positive";
  technique: string;
  tactic: string;
  host: string;
  detected: string;
  processid?: number;
  parentProcessId?: number;
  userId?: number;
  mountNamespace?: number;
  eventName?: string;
  comm?: string;
  rawEvent?: string;
  aiResult?: string;
}

const allAlertsData: AlertRecord[] = [
  {
    id: "ALT-201",
    severity: "Critical",
    alert: "Brute force login attempts",
    status: "Open",
    technique: "T1110",
    tactic: "Credential Access",
    host: "HR-LAPTOP-14",
    detected: "11 h ago",
  },
  {
    id: "ALT-202",
    severity: "High",
    alert: "Large upload to unknown host",
    status: "Resolved",
    technique: "T1048",
    tactic: "Exfiltration",
    host: "VPN-GW",
    detected: "11 h ago",
  },
  {
    id: "ALT-203",
    severity: "Low",
    alert: "Large upload to unknown host",
    status: "False positive",
    technique: "T1053",
    tactic: "Credential Access",
    host: "FIN-PC-07",
    detected: "11 h ago",
  },
  {
    id: "ALT-204",
    severity: "Critical",
    alert: "Brute force login attempts",
    status: "Open",
    technique: "T1110",
    tactic: "Credential Access",
    host: "HR-LAPTOP-14",
    detected: "11 h ago",
  },
  {
    id: "ALT-205",
    severity: "High",
    alert: "Unauthorized PowerShell script execution",
    status: "Resolved",
    technique: "T1059",
    tactic: "Execution",
    host: "Endpoint",
    detected: "2 h ago",
  },
  {
    id: "ALT-206",
    severity: "Low",
    alert: "Large upload to unknown host",
    status: "False positive",
    technique: "T1053",
    tactic: "Credential Access",
    host: "FIN-PC-07",
    detected: "11 h ago",
  },
  {
    id: "ALT-207",
    severity: "Low",
    alert: "Large upload to unknown host",
    status: "False positive",
    technique: "T1053",
    tactic: "Credential Access",
    host: "FIN-PC-07",
    detected: "11 h ago",
  },
  {
    id: "ALT-208",
    severity: "Critical",
    alert: "Brute force login attempts",
    status: "Open",
    technique: "T1110",
    tactic: "Credential Access",
    host: "HR-LAPTOP-14",
    detected: "11 h ago",
  },
  {
    id: "ALT-209",
    severity: "Critical",
    alert: "Brute force login attempts",
    status: "Open",
    technique: "T1110",
    tactic: "Credential Access",
    host: "HR-LAPTOP-14",
    detected: "11 h ago",
  },
  {
    id: "ALT-210",
    severity: "High",
    alert: "Multiple failed login attempts detected",
    status: "Resolved",
    technique: "T1110",
    tactic: "Credential Access",
    host: "Web-Server",
    detected: "3 h ago",
  },
  {
    id: "ALT-211",
    severity: "High",
    alert: "Anomalous DNS request pattern observed",
    status: "Resolved",
    technique: "T1071",
    tactic: "Command and Control",
    host: "DNS-Server",
    detected: "1 h ago",
  },
  {
    id: "ALT-212",
    severity: "High",
    alert: "Ransomware detected on host",
    status: "Resolved",
    technique: "T1486",
    tactic: "Impact",
    host: "File-Server",
    detected: "30 min ago",
  },
  {
    id: "ALT-213",
    severity: "High",
    alert: "Large upload to unknown host",
    status: "Resolved",
    technique: "T1048",
    tactic: "Credential Access",
    host: "VPN-GW",
    detected: "11 h ago",
  },
];

export default function AlertsPage() {
  const { events, updateStatus } = useTelemetry();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedTactic, setSelectedTactic] = useState("All");
  const [page, setPage] = useState(1);
  const [investigatingAlert, setInvestigatingAlert] =
    useState<AlertRecord | null>(null);

  const sourceAlerts = useMemo(() => {
    if (!events || events.length === 0) return allAlertsData;
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
    return events.map((evt) => ({
      id: evt.alertId || `ALT-${evt.id}`,
      severity: severityMap[evt.severity || "medium"] || "Medium",
      alert: evt.title,
      status: statusMap[evt.status] || "Open",
      technique: evt.technique,
      tactic: evt.tactic,
      host: evt.hostName || "Unknown host",
      detected: evt.timestamp ? formatTime(evt.timestamp) : "Recently",
      processid: evt.processid,
      parentProcessId: evt.parentProcessId,
      userId: evt.userId,
      mountNamespace: evt.mountNamespace,
      eventName: evt.eventName ?? undefined,
      comm: evt.comm ?? undefined,
      rawEvent: evt.rawEvent ?? undefined,
      aiResult: evt.aiResult ?? undefined,
    }));
  }, [events]);

  // Filter logic
  const filteredAlerts = useMemo(() => {
    return sourceAlerts.filter((item) => {
      if (selectedSeverity !== "All" && item.severity !== selectedSeverity)
        return false;
      if (selectedStatus !== "All" && item.status !== selectedStatus)
        return false;
      if (selectedTactic !== "All" && item.tactic !== selectedTactic)
        return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          item.alert.toLowerCase().includes(q) ||
          item.host.toLowerCase().includes(q) ||
          item.technique.toLowerCase().includes(q) ||
          item.tactic.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [sourceAlerts, searchQuery, selectedSeverity, selectedStatus, selectedTactic]);

  const totalAlertsCount = 48; // Canonical number from Figma screen

  return (
    <DashboardShell title="Alerts">
      <div className="space-y-6">
        {/* Page Title & Subtitle Banner */}
        <div className="space-y-1">
          <h1 className="text-[28px] sm:text-[32px] font-heading font-extrabold text-brand-ink dark:text-brand-paper tracking-[-0.02em]">
            Alerts
          </h1>
          <p className="text-[14px] text-muted-foreground">
            {filteredAlerts.length} of {totalAlertsCount} alerts shown. Select a
            row to investigate.
          </p>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Severity Filter */}
            <div className="relative">
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="h-9 pl-3.5 pr-8 rounded-sm border border-border bg-card text-[13px] font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none shadow-sh-sm cursor-pointer"
              >
                <option value="All">All severities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Low">Low</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="h-9 pl-3.5 pr-8 rounded-sm border border-border bg-card text-[13px] font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none shadow-sh-sm cursor-pointer"
              >
                <option value="All">All statuses</option>
                <option value="Open">Open</option>
                <option value="Resolved">Resolved</option>
                <option value="False positive">False positive</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>

            {/* Tactic Filter */}
            <div className="relative">
              <select
                value={selectedTactic}
                onChange={(e) => setSelectedTactic(e.target.value)}
                className="h-9 pl-3.5 pr-8 rounded-sm border border-border bg-card text-[13px] font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none shadow-sh-sm cursor-pointer"
              >
                <option value="All">All tactics</option>
                <option value="Credential Access">Credential Access</option>
                <option value="Execution">Execution</option>
                <option value="Command and Control">Command and Control</option>
                <option value="Impact">Impact</option>
                <option value="Exfiltration">Exfiltration</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search alert, host or technique"
              className="w-full h-9 pl-9 pr-3 rounded-sm border border-border bg-card text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring shadow-sh-sm transition-all"
            />
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Alerts Table Card with Hide-Then-Show Entrance */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl border border-border bg-card shadow-sh-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-border/70 text-muted-foreground font-semibold bg-muted/20">
                  <th className="py-3.5 pl-6 pr-4">Severity</th>
                  <th className="py-3.5 px-4">Alert</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Technique</th>
                  <th className="py-3.5 px-4">Tactic</th>
                  <th className="py-3.5 px-4">Host</th>
                  <th className="py-3.5 pl-4 pr-6 text-right">Detected</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {filteredAlerts.length > 0 ? (
                  filteredAlerts.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() => setInvestigatingAlert(row)}
                      className="hover:bg-muted/40 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 pl-6 pr-4">
                        <SeverityBadge severity={row.severity} />
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-foreground group-hover:text-primary transition-colors">
                        {row.alert}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusPill status={row.status} />
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[12px] text-muted-foreground">
                        {row.technique}
                      </td>
                      <td className="py-3.5 px-4 text-foreground">
                        {row.tactic}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[12px] text-foreground font-medium">
                        {row.host}
                      </td>
                      <td className="py-3.5 pl-4 pr-6 text-[12px] text-muted-foreground text-right">
                        {row.detected}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-12 text-center text-muted-foreground"
                    >
                      No matching alerts found for the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination (Matching Figma) */}
          <div className="p-4 border-t border-border/70 flex items-center justify-center gap-1.5 text-[13px] font-semibold text-foreground select-none">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              className="p-1.5 rounded-[6px] hover:bg-muted text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {[1, 2, 3, 4, 5].map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-7 h-7 rounded-full text-[12px] font-semibold flex items-center justify-center transition-all ${
                  page === p
                    ? "bg-brand-ink text-brand-paper dark:bg-brand-paper dark:text-brand-ink"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {p}
              </button>
            ))}

            <span className="px-1 text-muted-foreground">...</span>

            <button
              onClick={() => setPage(10)}
              className={`w-7 h-7 rounded-full text-[12px] font-semibold flex items-center justify-center transition-all ${
                page === 10
                  ? "bg-brand-ink text-brand-paper dark:bg-brand-paper dark:text-brand-ink"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              10
            </button>

            <button
              onClick={() => setPage(Math.min(10, page + 1))}
              className="p-1.5 rounded-[6px] hover:bg-muted text-muted-foreground hover:text-foreground"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Slide-over Investigation Drawer */}
      <AlertInvestigationDrawer
        alert={investigatingAlert}
        onClose={() => setInvestigatingAlert(null)}
        onResolve={(id) => {
          updateStatus(id, "resolved");
          setInvestigatingAlert((prev) =>
            prev && prev.id === id ? { ...prev, status: "Resolved" } : prev
          );
        }}
        onUpdateStatus={(id, status) => {
          updateStatus(id, status);
        }}
      />
    </DashboardShell>
  );
}
