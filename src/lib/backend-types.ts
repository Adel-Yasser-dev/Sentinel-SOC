export type Severity = "critical" | "high" | "medium" | "low";
export type AnalystStatus = "open" | "investigating" | "resolved" | "false_positive";
export type AiStatus =
  | "legacy"
  | "pending"
  | "processing"
  | "report_pending"
  | "completed"
  | "failed";

export interface LogEvent {
  id?: number;
  processid: number;
  threadId: number;
  parentProcessId: number;
  userId: number;
  mountNamespace: number;
  eventId: number;
  argsNum: number;
  returnValue: number;
  sus?: number | null;
  evil?: number | null;
  timestamp?: number | null;
  eventName?: string | null;
  comm?: string | null;
  hostName?: string | null;
  rawEvent?: string | null;
  analystStatus?: AnalystStatus;
  aiStatus?: AiStatus;
  aiResult?: string | null;
}

export interface RuleEvidence {
  tags?: string[];
  level?: string;
  description?: string;
  events?: unknown[];
}

export interface RuleMatch {
  title?: string;
  rule_id?: string;
  evidence?: RuleEvidence;
}

export interface RelatedEvent {
  timestamp?: string;
  process_id?: number;
  relation?: string;
  event_name?: string;
  process_name?: string;
  event_id?: number;
  return_value?: number;
}

export interface Assessment {
  kind?: "benign" | "model_alert" | "rule_alert";
  label?: string;
  reason?: string;
  requires_triage?: boolean;
}

export interface EventAssessment {
  label: string;
  hint: string;
  badgeClass: string;
  requiresTriage: boolean;
}

export interface Analysis {
  status?: string;
  assessment?: Assessment;
  is_alert?: boolean;
  alert?: {
    anomaly_score?: number;
    model?: string;
    timestamp?: string;
  };
  incident_report?: string | null;
  incident_report_error?: string | null;
  related_event_count?: number;
  related_events?: RelatedEvent[];
  rule_matches?: RuleMatch[];
  steps?: Array<{ node: string; finished_at?: string }>;
  error?: string;
}

export interface MitreMapping {
  tactic: string;
  technique: string;
  ruleTitle: string;
  ruleId: string;
}

export interface BackendAlert extends LogEvent {
  alertId: string;
  severity: Severity | null;
  score: number;
  title: string;
  tactic: string;
  technique: string;
  status: AnalystStatus;
  receivedAt: number;
}

export interface LogTimeline {
  total: number;
  timestamped: number;
  minTimestamp: number | null;
  maxTimestamp: number | null;
  buckets: Array<{
    startTimestamp: number;
    count: number;
  }>;
}

export interface TimelineChartData {
  values: number[];
  labels: string[];
  tooltips: string[];
  count: number;
  timestamped: number;
  total: number;
  intervalLabel: string;
}
