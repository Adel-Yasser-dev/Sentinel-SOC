"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import type { HubConnection } from "@microsoft/signalr";
import type {
  BackendAlert,
  LogEvent,
  LogTimeline,
  AnalystStatus,
  Severity,
} from "./backend-types";
import {
  isBackendConfigured,
  fetchHistory,
  fetchTimeline,
  updateLogStatus,
  createSignalRConnection,
  mergeHistory,
  toBackendAlert,
  readAnalysis,
} from "./backend-api";
import { sampleLatestAlerts } from "@/components/dashboard/latest-alerts-table";

const DETERMINISTIC_TIMESTAMP = 1761480000000;

// Convert existing sample data into BackendAlert format as the fallback dataset
function createInitialFallbackAlerts(): BackendAlert[] {
  return sampleLatestAlerts.map((item, idx) => {
    const numericId = 1000 + idx;
    const severityMap: Record<string, Severity> = {
      Critical: "critical",
      High: "high",
      Medium: "medium",
      low: "low",
    };
    const statusMap: Record<string, AnalystStatus> = {
      Open: "open",
      Resolved: "resolved",
      "False positive": "false_positive",
    };

    const itemTime = DETERMINISTIC_TIMESTAMP - idx * 3600 * 1000;

    return {
      id: numericId,
      alertId: item.id,
      processid: 1200 + idx * 4,
      threadId: 1200 + idx * 4 + 1,
      parentProcessId: 1000,
      userId: 1000,
      mountNamespace: 4026531840,
      eventId: 100 + idx,
      argsNum: 3,
      returnValue: 0,
      sus: 1,
      evil: item.severity === "Critical" ? 1 : 0,
      timestamp: itemTime,
      eventName: "security_socket_connect",
      comm: item.alert.toLowerCase().includes("brute") ? "sshd" : "curl",
      hostName: item.host,
      rawEvent: JSON.stringify({
        event: item.alert,
        technique: item.technique,
        host: item.host,
      }),
      analystStatus: statusMap[item.status] ?? "open",
      aiStatus: "completed",
      aiResult: JSON.stringify({
        is_alert: true,
        alert: {
          anomaly_score: item.severity === "Critical" ? 0.96 : 0.82,
          model: "Tracee-Isolation-v2",
          timestamp: "2026-10-26T12:00:00Z",
        },
        assessment: {
          kind: "rule_alert",
          label: item.alert,
          reason: `Adversary technique ${item.technique} detected on ${item.host}.`,
          requires_triage: true,
        },
        rule_matches: [
          {
            title: item.alert,
            rule_id: `SIGMA-${item.technique}`,
            evidence: {
              level: severityMap[item.severity] ?? "high",
              tags: [
                `attack.${(item.tactic || "credential_access").toLowerCase().replace(/\s+/g, "_")}`,
                `attack.${item.technique.toLowerCase()}`,
              ],
            },
          },
        ],
      }),
      severity: severityMap[item.severity] ?? "high",
      score: item.severity === "Critical" ? 96 : 82,
      title: item.alert,
      tactic: item.tactic || "Credential Access",
      technique: item.technique,
      status: statusMap[item.status] ?? "open",
      receivedAt: itemTime,
    };
  });
}

interface TelemetryContextType {
  events: BackendAlert[];
  alertEvents: BackendAlert[];
  timeline: LogTimeline | null;
  connected: boolean;
  liveEnabled: boolean;
  isBackendAvailable: boolean;
  toggleLive: () => void;
  refresh: () => Promise<void>;
  updateStatus: (id: number | string, status: AnalystStatus) => Promise<void>;
  selectedAlert: BackendAlert | null;
  setSelectedAlert: (alert: BackendAlert | null) => void;
}

const TelemetryContext = createContext<TelemetryContextType | null>(null);

export function TelemetryProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<BackendAlert[]>(createInitialFallbackAlerts);
  const [timeline, setTimeline] = useState<LogTimeline | null>(null);
  const [connected, setConnected] = useState(false);
  const [isBackendAvailable, setIsBackendAvailable] = useState(false);
  const [liveEnabled, setLiveEnabled] = useState(true);
  const liveRef = useRef(true);
  const [selectedAlert, setSelectedAlert] = useState<BackendAlert | null>(null);

  const hubRef = useRef<HubConnection | null>(null);

  // Reload history and timeline from REST API
  const reloadHistory = useCallback(async () => {
    if (!isBackendConfigured()) return;
    try {
      const logs = await fetchHistory(300);
      setEvents((current) => mergeHistory(current, logs));
      setIsBackendAvailable(true);
    } catch {
      // Keep existing stream / fallback data
      setIsBackendAvailable(false);
    }

    try {
      const tl = await fetchTimeline(12);
      setTimeline(tl);
    } catch {
      // Keep previous timeline
    }
  }, []);

  useEffect(() => {
    if (!isBackendConfigured()) {
      return;
    }

    let disposed = false;
    let timelineRefreshTimer: ReturnType<typeof setTimeout> | undefined;

    const queueTimelineRefresh = () => {
      if (timelineRefreshTimer) clearTimeout(timelineRefreshTimer);
      timelineRefreshTimer = setTimeout(() => {
        if (!disposed) {
          fetchTimeline()
            .then((data) => {
              if (!disposed) setTimeline(data);
            })
            .catch(() => undefined);
        }
      }, 1200);
    };

    // Load initial history when backend is configured
    void fetchHistory(300)
      .then((logs) => {
        if (!disposed && logs.length > 0) {
          setEvents((current) => mergeHistory(current, logs));
          setIsBackendAvailable(true);
        }
      })
      .catch(() => undefined);

    void fetchTimeline(12)
      .then((tl) => {
        if (!disposed) setTimeline(tl);
      })
      .catch(() => undefined);

    // SignalR real-time hub connection
    const hub = createSignalRConnection({
      onNewLog: (log: LogEvent) => {
        if (!liveRef.current) return;
        setEvents((current) => {
          const next = toBackendAlert(log);
          const index = current.findIndex((item) => item.id === log.id);
          if (index < 0) return [next, ...current].slice(0, 300);
          const updated = [...current];
          updated[index] = next;
          return updated;
        });
        queueTimelineRefresh();
      },
      onLogAnalyzed: (log: LogEvent) => {
        if (!liveRef.current) return;
        setEvents((current) => {
          const next = toBackendAlert(log);
          const index = current.findIndex((item) => item.id === log.id);
          if (index < 0) return [next, ...current].slice(0, 300);
          const updated = [...current];
          updated[index] = next;
          return updated;
        });
      },
      onLogUpdated: (log: LogEvent) => {
        setEvents((current) => {
          const next = toBackendAlert(log);
          const index = current.findIndex((item) => item.id === log.id);
          if (index < 0) return current;
          const updated = [...current];
          updated[index] = next;
          return updated;
        });
      },
      onConnectionChange: (isConnected: boolean) => {
        if (!disposed) {
          setConnected(isConnected);
          if (isConnected) setIsBackendAvailable(true);
        }
      },
    });

    hubRef.current = hub;

    hub
      .start()
      .then(() => {
        if (!disposed) {
          setConnected(true);
          setIsBackendAvailable(true);
          void reloadHistory();
        }
      })
      .catch(() => {
        if (!disposed) {
          setConnected(false);
        }
      });

    return () => {
      disposed = true;
      if (timelineRefreshTimer) clearTimeout(timelineRefreshTimer);
      hub.stop().catch(() => undefined);
    };
  }, [reloadHistory]);

  const toggleLive = useCallback(() => {
    const next = !liveEnabled;
    liveRef.current = next;
    setLiveEnabled(next);
    if (next) {
      void reloadHistory();
    }
  }, [liveEnabled, reloadHistory]);

  const updateStatus = useCallback(
    async (id: number | string, status: AnalystStatus) => {
      const numericId = typeof id === "number" ? id : parseInt(String(id).replace(/\D/g, ""), 10);

      // Optimistic update
      setEvents((items) =>
        items.map((item) =>
          item.id === numericId || item.alertId === String(id)
            ? { ...item, status, analystStatus: status }
            : item
        )
      );

      // If backend is active, persist via REST
      if (Number.isFinite(numericId) && numericId > 0 && isBackendAvailable) {
        try {
          const updatedLog = await updateLogStatus(numericId, status);
          const updatedAlert = toBackendAlert(updatedLog);
          setEvents((items) =>
            items.map((item) => (item.id === numericId ? updatedAlert : item))
          );
        } catch (err) {
          console.warn("Failed to save status to backend:", err);
        }
      }
    },
    [isBackendAvailable]
  );

  const alertEvents = useMemo(
    () => events.filter((item) => readAnalysis(item)?.is_alert === true),
    [events]
  );

  const value = useMemo(
    () => ({
      events,
      alertEvents,
      timeline,
      connected,
      liveEnabled,
      isBackendAvailable,
      toggleLive,
      refresh: reloadHistory,
      updateStatus,
      selectedAlert,
      setSelectedAlert,
    }),
    [
      events,
      alertEvents,
      timeline,
      connected,
      liveEnabled,
      isBackendAvailable,
      toggleLive,
      reloadHistory,
      updateStatus,
      selectedAlert,
    ]
  );

  return (
    <TelemetryContext.Provider value={value}>
      {children}
    </TelemetryContext.Provider>
  );
}

export function useTelemetry(): TelemetryContextType {
  const context = useContext(TelemetryContext);
  if (!context) {
    throw new Error("useTelemetry must be used within a TelemetryProvider");
  }
  return context;
}
