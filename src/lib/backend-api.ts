import * as signalR from "@microsoft/signalr";
import type {
  LogEvent,
  BackendAlert,
  Analysis,
  EventAssessment,
  MitreMapping,
  LogTimeline,
  AnalystStatus,
  Severity,
} from "./backend-types";

export const tacticNames: Record<string, string> = {
  command_and_control: "Command and Control",
  credential_access: "Credential Access",
  defense_evasion: "Defense Evasion",
  discovery: "Discovery",
  execution: "Execution",
  exfiltration: "Exfiltration",
  initial_access: "Initial Access",
  lateral_movement: "Lateral Movement",
  persistence: "Persistence",
  privilege_escalation: "Privilege Escalation",
};

export function getBackendUrl(): string {
  return (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/$/, "");
}

export function isBackendConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_BACKEND_URL && process.env.NEXT_PUBLIC_BACKEND_URL.trim().length > 0);
}

export function readAnalysis(log: LogEvent): Analysis | null {
  if (!log.aiResult) return null;
  try {
    return JSON.parse(log.aiResult) as Analysis;
  } catch {
    return null;
  }
}

export function timestampMs(timestamp?: number | string | null): number | null {
  if (timestamp === null || timestamp === undefined || timestamp === "") return null;
  const numeric = Number(timestamp);
  if (!Number.isFinite(numeric) || numeric <= 0) return null;
  const ms =
    numeric >= 1e17
      ? numeric / 1e6
      : numeric >= 1e14
      ? numeric / 1e3
      : numeric >= 1e11
      ? numeric
      : numeric * 1000;
  return Number.isFinite(ms) && Math.abs(ms) <= 8.64e15 ? ms : null;
}

export function formatTime(timestamp?: number | string | null): string {
  const ms = timestampMs(timestamp);
  if (ms === null) return "time unavailable";
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date(ms));
}

export function getMappings(analysis: Analysis | null): MitreMapping[] {
  const mappings: MitreMapping[] = [];
  for (const rule of analysis?.rule_matches ?? []) {
    const tags = rule.evidence?.tags ?? [];
    const tacticTag = tags.find(
      (tag) => /^attack\.[a-z_]+$/i.test(tag) && !/^attack\.t\d/i.test(tag)
    );
    const techniqueTag = tags.find((tag) => /^attack\.t\d/i.test(tag));
    if (!tacticTag && !techniqueTag) continue;

    const tacticKey = tacticTag?.slice("attack.".length).toLowerCase() ?? "";
    const technique =
      techniqueTag?.slice("attack.".length).toUpperCase() ?? "Unmapped technique";

    mappings.push({
      tactic:
        tacticNames[tacticKey] ??
        (tacticKey
          ? tacticKey
              .replaceAll("_", " ")
              .replace(/\b\w/g, (letter) => letter.toUpperCase())
          : "Unmapped tactic"),
      technique,
      ruleTitle: rule.title ?? "Detection rule",
      ruleId: rule.rule_id ?? "unknown",
    });
  }

  return mappings.filter(
    (item, index) =>
      mappings.findIndex(
        (other) =>
          other.tactic === item.tactic && other.technique === item.technique
      ) === index
  );
}

export function getEventAssessment(
  log: BackendAlert,
  analysis: Analysis | null
): EventAssessment {
  const hasAlertResult = analysis?.is_alert === true;
  if (log.aiStatus !== "completed" && !hasAlertResult) {
    return {
      label: `AI ${log.aiStatus ?? "pending"}`,
      hint: "The analysis workflow has not completed yet.",
      badgeClass: "neutral",
      requiresTriage: false,
    };
  }

  const reportRetryHint =
    log.aiStatus === "report_pending"
      ? " The alert remains visible while incident report generation retries automatically."
      : "";

  if (!analysis) {
    return {
      label: "Result unavailable",
      hint: "The backend returned no readable analysis result.",
      badgeClass: "neutral",
      requiresTriage: false,
    };
  }

  if (!analysis.is_alert) {
    return {
      label: analysis.assessment?.label ?? "No anomaly",
      hint:
        analysis.assessment?.reason ??
        "The anomaly model classified this event as benign.",
      badgeClass: "neutral",
      requiresTriage: false,
    };
  }

  if (log.severity) {
    return {
      label: log.severity,
      hint: `Sigma assigned ${log.severity} severity to the matched alert.${reportRetryHint}`,
      badgeClass: log.severity,
      requiresTriage: true,
    };
  }

  if (analysis.assessment?.kind === "rule_alert") {
    return {
      label: analysis.assessment.label ?? "Rule-backed alert",
      hint:
        analysis.assessment.reason ??
        "A Sigma rule matched, but it did not provide a supported severity level.",
      badgeClass: "model-alert",
      requiresTriage: true,
    };
  }

  return {
    label: analysis.assessment?.label ?? "AI alert",
    hint: `${
      analysis.assessment?.reason ??
      "The anomaly model raised an alert, but no configured Sigma rule matched the investigation evidence."
    }${reportRetryHint}`,
    badgeClass: "model-alert",
    requiresTriage: true,
  };
}

export function toBackendAlert(log: LogEvent): BackendAlert {
  const analysis = readAnalysis(log);
  const rawScore = analysis?.alert?.anomaly_score;
  const score =
    typeof rawScore === "number" && Number.isFinite(rawScore)
      ? Math.round(rawScore * 100)
      : 0;

  const level = analysis?.rule_matches
    ?.map((rule) => rule.evidence?.level?.toLowerCase())
    .find((value): value is string =>
      ["critical", "high", "medium", "low"].includes(value ?? "")
    );

  const severity: Severity | null = level ? (level as Severity) : null;
  const mapping = getMappings(analysis)[0];
  const firstRule = analysis?.rule_matches?.[0];

  return {
    ...log,
    alertId: `EVT-${log.id ?? `${log.processid}-${log.timestamp ?? 1761480000000}`}`,
    score,
    severity,
    title:
      firstRule?.title ??
      (log.eventName ? `${log.eventName} process event` : "Linux process event"),
    tactic: mapping?.tactic ?? "Unmapped",
    technique: mapping?.technique ?? "—",
    status: log.analystStatus ?? "open",
    receivedAt: log.timestamp ?? 1761480000000,
  };
}

export function mergeHistory(
  current: BackendAlert[],
  incoming: LogEvent[]
): BackendAlert[] {
  const rank = {
    legacy: 0,
    pending: 1,
    processing: 2,
    failed: 2,
    report_pending: 3,
    completed: 4,
  } as const;

  const byId = new Map<number | string, BackendAlert>();
  for (const item of current) {
    if (item.id !== undefined) byId.set(item.id, item);
  }

  for (const log of incoming) {
    const mapped = toBackendAlert(log);
    const previous = log.id === undefined ? undefined : byId.get(log.id);
    const prevRank = previous?.aiStatus ? rank[previous.aiStatus] : -1;
    const nextRank = mapped.aiStatus ? rank[mapped.aiStatus] : -1;

    const recoversMissingReport =
      previous?.aiStatus === "completed" &&
      mapped.aiStatus === "report_pending" &&
      readAnalysis(previous)?.is_alert === true &&
      !readAnalysis(previous)?.incident_report;

    if (log.id !== undefined) {
      byId.set(
        log.id,
        previous && prevRank > nextRank && !recoversMissingReport
          ? previous
          : mapped
      );
    } else {
      byId.set(mapped.alertId, mapped);
    }
  }

  return [...byId.values()]
    .sort(
      (a, b) =>
        (b.id ?? 0) - (a.id ?? 0) ||
        (timestampMs(b.timestamp) ?? 0) - (timestampMs(a.timestamp) ?? 0)
    )
    .slice(0, 300);
}

// ---------------- REST API CALLS ----------------
 
export async function fetchHistory(limit = 300): Promise<LogEvent[]> {
  const base = getBackendUrl();
  const url = base ? `${base}/api/logs?limit=${limit}` : `/api/logs?limit=${limit}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Log history returned HTTP ${response.status}`);
  }
  return response.json() as Promise<LogEvent[]>;
}

export async function fetchTimeline(buckets = 12): Promise<LogTimeline> {
  const base = getBackendUrl();
  const url = base
    ? `${base}/api/logs/timeline?buckets=${buckets}`
    : `/api/logs/timeline?buckets=${buckets}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Log timeline returned HTTP ${response.status}`);
  }
  return response.json() as Promise<LogTimeline>;
}

export async function fetchLogDetail(id: number): Promise<LogEvent> {
  const base = getBackendUrl();
  const url = base ? `${base}/api/logs/${id}` : `/api/logs/${id}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Log detail for ID ${id} returned HTTP ${response.status}`);
  }
  return response.json() as Promise<LogEvent>;
}

export async function updateLogStatus(
  id: number,
  status: AnalystStatus
): Promise<LogEvent> {
  const base = getBackendUrl();
  const url = base ? `${base}/api/logs/${id}/status` : `/api/logs/${id}/status`;
  const response = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    throw new Error(`Status update returned HTTP ${response.status}`);
  }
  return response.json() as Promise<LogEvent>;
}

// ---------------- SIGNALR CONNECTION ----------------

export interface SignalROptions {
  onNewLog?: (log: LogEvent) => void;
  onLogAnalyzed?: (log: LogEvent) => void;
  onLogUpdated?: (log: LogEvent) => void;
  onConnectionChange?: (connected: boolean) => void;
}

export function createSignalRConnection(options: SignalROptions): signalR.HubConnection {
  const base = getBackendUrl();
  const hubUrl = base ? `${base}/logs` : "/logs";

  const hub = new signalR.HubConnectionBuilder()
    .withUrl(hubUrl)
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.None)
    .build();

  if (options.onNewLog) {
    hub.on("newLog", options.onNewLog);
  }
  if (options.onLogAnalyzed) {
    hub.on("logAnalyzed", options.onLogAnalyzed);
  }
  if (options.onLogUpdated) {
    hub.on("logUpdated", options.onLogUpdated);
  }

  hub.onreconnecting(() => options.onConnectionChange?.(false));
  hub.onreconnected(() => options.onConnectionChange?.(true));
  hub.onclose(() => options.onConnectionChange?.(false));

  return hub;
}
