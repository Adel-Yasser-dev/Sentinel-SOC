export type SeverityLevel = "critical" | "high" | "medium" | "low" | "info";

export type AlertAnalysisState = "queued" | "analyzing" | "done";

export interface RealtimeAlert {
  id: string;
  title: string;
  sev: SeverityLevel;
  tactic: string;
  tech: string;
  host: string;
  src: string;
  dst: string;
  port: number;
  ctry: string;
  score: number;
  conf: number;
  rel: number;
  feeds: number;
  state: AlertAnalysisState;
  prog: number;
  txt: string[];
  md?: string;
  customLog?: string;
  timestamp?: string;
}

export interface AnalysisStep {
  title: string;
  evidence: string;
}

export function getAlertSteps(a: RealtimeAlert): [string, string][] {
  if (a.customLog) {
    return [
      ["Ingesting custom telemetry", `Payload received: "${a.customLog.slice(0, 60)}${a.customLog.length > 60 ? "..." : ""}"`],
      ["Parsing indicator entities", `${a.src} → ${a.dst}:${a.port} mapped to host ${a.host}`],
      ["Querying threat intelligence", `${a.src} (${a.ctry}) verified across ${a.feeds} global threat feeds`],
      ["Correlating MITRE technique", `${a.tech} · ${a.tactic} pattern confirmed in audit logs`],
      ["AI risk model inference", `Calculated risk score ${a.score}/100, model confidence ${a.conf}%`],
    ];
  }

  return [
    ["Parsing event", `${a.src} → ${a.dst}:${a.port} on ${a.host}`],
    ["Enriching indicators", `${a.src} (${a.ctry}) flagged in ${a.feeds} threat feed${a.feeds > 1 ? "s" : ""}`],
    ["Correlating activity", `${a.rel} related alert${a.rel > 1 ? "s" : ""} on ${a.host} in the last 24 h`],
    ["Mapping to MITRE ATT&CK", `${a.tech} · ${a.tactic}`],
    ["Scoring risk", `risk ${a.score}/100, confidence ${a.conf}%`],
  ];
}

export function getAlertVerdict(a: RealtimeAlert): [string, string] {
  const s = a.score;
  if (s >= 85) {
    return ["Contain host now", `Isolate ${a.host} immediately and block IP ${a.src}.`];
  }
  if (s >= 65) {
    return ["Escalate to Tier 2", `Strong heuristic match with ${a.tech}. Analyst review required.`];
  }
  if (s >= 40) {
    return ["Keep investigating", `Suspicious indicator anomaly. Retain telemetry logs for 48h.`];
  }
  return ["Auto-close", "Benign telemetry spike consistent with baseline operational traffic."];
}

export function generateIncidentReport(a: RealtimeAlert): string {
  if (a.md) return a.md;
  const v = getAlertVerdict(a);
  const st = getAlertSteps(a);
  const nextActions =
    a.score >= 85
      ? [
          `Isolate ${a.host} from the network`,
          `Block ${a.src} at perimeter firewall`,
          `Revoke active authentication tokens on ${a.host}`,
          `Dispatch automated P1 incident triage alert to response team`,
        ]
      : a.score >= 65
      ? [
          `Assign to Tier 2 SOC analyst`,
          `Extract last 24h event logs for ${a.host}`,
          `Verify reputation of external source ${a.src}`,
        ]
      : a.score >= 40
      ? [
          `Retain endpoint telemetry buffer for ${a.host}`,
          `Monitor for secondary beacon triggers`,
        ]
      : [
          `Close ticket as expected operational activity`,
          `Refine behavioral detection rule to suppress false positives`,
        ];

  return `# Incident Report: ${a.id}

**${a.title}** · ${a.sev.toUpperCase()} Severity

_Autonomous Analysis completed by Sentinel AI on ${a.timestamp || "2026-10-26 12:00:00 UTC"}_

---

## Executive Verdict

**${v[0]}**: ${v[1]}

- **Calculated Threat Risk**: ${a.score} / 100
- **AI Neural Confidence**: ${a.conf}%
- **Host Endpoint**: \`${a.host}\`
- **Originating Vector**: \`${a.src}\` (${a.ctry})

---

## Telemetry Evidence

| Telemetry Dimension | Sensor Value |
| :--- | :--- |
| **Alert Identifier** | \`${a.id}\` |
| **Target Host** | \`${a.host}\` |
| **Source IP** | \`${a.src}\` (${a.ctry}) |
| **Destination** | \`${a.dst}:${a.port}\` |
| **MITRE Tactic** | ${a.tactic} |
| **MITRE Technique** | \`${a.tech}\` |
| **Active Threat Feeds** | ${a.feeds} Feeds Flagged |
| **Correlated Events (24h)** | ${a.rel} Incidents |
${a.customLog ? `| **Ingested User Telemetry** | \`${a.customLog}\` |\n` : ""}

---

## AI Analysis Execution Pipeline

${st.map((s, i) => `${i + 1}. **${s[0]}**: \`${s[1]}\``).join("\n")}

---

## Recommended SOC Containment Playbook

${nextActions.map((x) => `- [ ] ${x}`).join("\n")}
`;
}
