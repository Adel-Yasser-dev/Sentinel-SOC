"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { AiOrb } from "@/components/realtime/ai-orb";
import { CustomAlertInput } from "@/components/realtime/custom-alert-input";
import {
  type RealtimeAlert,
  type SeverityLevel,
  getAlertSteps,
  getAlertVerdict,
  generateIncidentReport,
} from "@/lib/realtime-ai-types";
import {
  Copy,
  Download,
  Play,
  Pause,
  Check,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const SEED_RULES = [
  { title: "Brute force login attempts", sev: "high" as SeverityLevel, tactic: "Credential Access", tech: "T1110" },
  { title: "Encoded PowerShell command", sev: "critical" as SeverityLevel, tactic: "Execution", tech: "T1059.001" },
  { title: "New admin account created", sev: "high" as SeverityLevel, tactic: "Persistence", tech: "T1136" },
  { title: "Port scan from external IP", sev: "medium" as SeverityLevel, tactic: "Discovery", tech: "T1046" },
  { title: "Outbound beacon to rare host", sev: "critical" as SeverityLevel, tactic: "Command and Control", tech: "T1071" },
  { title: "Large upload to unknown host", sev: "high" as SeverityLevel, tactic: "Exfiltration", tech: "T1048" },
  { title: "Phishing link clicked", sev: "medium" as SeverityLevel, tactic: "Initial Access", tech: "T1566" },
  { title: "Scheduled task modified", sev: "low" as SeverityLevel, tactic: "Persistence", tech: "T1053" },
  { title: "RDP login from new country", sev: "high" as SeverityLevel, tactic: "Lateral Movement", tech: "T1021.001" },
  { title: "Security log cleared", sev: "critical" as SeverityLevel, tactic: "Defense Evasion", tech: "T1070" },
  { title: "DNS query to rare domain", sev: "low" as SeverityLevel, tactic: "Command and Control", tech: "T1071.004" },
  { title: "Scheduled vulnerability scan", sev: "info" as SeverityLevel, tactic: "Discovery", tech: "T1595" },
];

const HOSTS = ["WEB-01", "DB-02", "HR-LAPTOP-14", "DC-01", "FIN-PC-07", "VPN-GW"];
const COUNTRIES = ["Russia", "China", "Brazil", "Germany", "United States", "Iran"];
const BASE_SCORES = { critical: 88, high: 72, medium: 50, low: 28, info: 10 };

const randomInt = (max: number) => Math.floor(Math.random() * max);
const generateIp = () =>
  `${[10, 172, 185, 45][randomInt(4)]}.${randomInt(250)}.${randomInt(250)}.${1 + randomInt(250)}`;

let alertSequence = 3148;

function getNextAlertId(existing?: RealtimeAlert[]): string {
  alertSequence += 1;
  let candidate = `ALT-${alertSequence}`;
  if (existing && existing.length > 0) {
    while (existing.some((a) => a.id === candidate)) {
      alertSequence += 1;
      candidate = `ALT-${alertSequence}`;
    }
  }
  return candidate;
}

function createAlert(
  customData?: { text: string; severity: SeverityLevel; host: string },
  existing?: RealtimeAlert[]
): RealtimeAlert {
  const alertId = getNextAlertId(existing);

  if (customData) {
    const sev = customData.severity;
    const score = Math.min(99, BASE_SCORES[sev] + randomInt(10));
    return {
      id: alertId,
      title: customData.text.length > 40 ? `${customData.text.slice(0, 37)}...` : customData.text,
      sev,
      tactic: sev === "critical" ? "Execution" : sev === "high" ? "Credential Access" : "Discovery",
      tech: sev === "critical" ? "T1059.001" : sev === "high" ? "T1110" : "T1046",
      host: customData.host,
      src: generateIp(),
      dst: generateIp(),
      port: 443,
      ctry: COUNTRIES[randomInt(COUNTRIES.length)],
      score,
      conf: 85 + randomInt(14),
      rel: 1 + randomInt(6),
      feeds: 1 + randomInt(4),
      state: "queued",
      prog: 0,
      txt: [],
      customLog: customData.text,
    };
  }

  const rule = SEED_RULES[randomInt(SEED_RULES.length)];
  const sev = rule.sev;
  const score = Math.min(99, BASE_SCORES[sev] + randomInt(10));
  return {
    id: alertId,
    title: rule.title,
    sev,
    tactic: rule.tactic,
    tech: rule.tech,
    host: HOSTS[randomInt(HOSTS.length)],
    src: generateIp(),
    dst: generateIp(),
    port: [22, 443, 3389, 445, 53, 8080][randomInt(6)],
    ctry: COUNTRIES[randomInt(COUNTRIES.length)],
    score,
    conf: 82 + randomInt(16),
    rel: 1 + randomInt(7),
    feeds: 1 + randomInt(5),
    state: "queued",
    prog: 0,
    txt: [],
  };
}

const INITIAL_SEED_ALERTS: RealtimeAlert[] = [
  {
    id: "ALT-3144",
    title: "Brute force login attempts",
    sev: "high",
    tactic: "Credential Access",
    tech: "T1110",
    host: "DC-01",
    src: "185.220.101.44",
    dst: "10.0.4.12:445",
    port: 445,
    ctry: "Russia",
    score: 78,
    conf: 91,
    rel: 6,
    feeds: 4,
    state: "done",
    prog: 5,
    txt: [
      "185.220.101.44 → 10.0.4.12:445 on DC-01",
      "185.220.101.44 (Russia) flagged in 4 threat feeds",
      "6 related alerts on DC-01 in the last 24 h",
      "T1110 · Credential Access",
      "risk 78/100, confidence 91%",
    ],
  },
  {
    id: "ALT-3145",
    title: "Encoded PowerShell command",
    sev: "critical",
    tactic: "Execution",
    tech: "T1059.001",
    host: "DB-02",
    src: "45.154.255.89",
    dst: "10.0.2.8:8080",
    port: 8080,
    ctry: "China",
    score: 94,
    conf: 96,
    rel: 8,
    feeds: 5,
    state: "done",
    prog: 5,
    txt: [
      "45.154.255.89 → 10.0.2.8:8080 on DB-02",
      "45.154.255.89 (China) flagged in 5 threat feeds",
      "8 related alerts on DB-02 in the last 24 h",
      "T1059.001 · Execution",
      "risk 94/100, confidence 96%",
    ],
  },
  {
    id: "ALT-3146",
    title: "Outbound beacon to rare host",
    sev: "critical",
    tactic: "Command and Control",
    tech: "T1071",
    host: "FIN-PC-07",
    src: "172.16.50.21",
    dst: "194.26.29.112:443",
    port: 443,
    ctry: "Brazil",
    score: 89,
    conf: 93,
    rel: 4,
    feeds: 3,
    state: "done",
    prog: 5,
    txt: [
      "172.16.50.21 → 194.26.29.112:443 on FIN-PC-07",
      "194.26.29.112 (Brazil) flagged in 3 threat feeds",
      "4 related alerts on FIN-PC-07 in the last 24 h",
      "T1071 · Command and Control",
      "risk 89/100, confidence 93%",
    ],
  },
  {
    id: "ALT-3147",
    title: "Port scan from external IP",
    sev: "medium",
    tactic: "Discovery",
    tech: "T1046",
    host: "WEB-01",
    src: "89.248.165.12",
    dst: "10.0.1.5:22",
    port: 22,
    ctry: "Germany",
    score: 54,
    conf: 85,
    rel: 3,
    feeds: 2,
    state: "done",
    prog: 5,
    txt: [
      "89.248.165.12 → 10.0.1.5:22 on WEB-01",
      "89.248.165.12 (Germany) flagged in 2 threat feeds",
      "3 related alerts on WEB-01 in the last 24 h",
      "T1046 · Discovery",
      "risk 54/100, confidence 85%",
    ],
  },
];

export default function RealtimeAiPage() {
  const [alerts, setAlerts] = useState<RealtimeAlert[]>(INITIAL_SEED_ALERTS);
  const [activeAlertId, setActiveAlertId] = useState<string | null>(
    INITIAL_SEED_ALERTS[0]?.id || null
  );
  const [isLive, setIsLive] = useState(true);
  const [isBusy, setIsBusy] = useState(false);
  const [analyzedCount, setAnalyzedCount] = useState(INITIAL_SEED_ALERTS.length);
  const [escalatedCount, setEscalatedCount] = useState(
    INITIAL_SEED_ALERTS.filter((s) => s.score >= 65).length
  );
  const [queuedCount, setQueuedCount] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Queues and execution references
  const queueRef = useRef<RealtimeAlert[]>([]);
  const alertsRef = useRef<RealtimeAlert[]>([]);
  const activeAlertIdRef = useRef<string | null>(null);
  const isBusyRef = useRef(false);
  const isLiveRef = useRef(true);
  const processAlertRef = useRef<((a: RealtimeAlert) => Promise<void>) | null>(null);
  const initialArrivedRef = useRef(false);

  // Keep refs in sync with state
  useEffect(() => {
    alertsRef.current = alerts;
  }, [alerts]);

  useEffect(() => {
    activeAlertIdRef.current = activeAlertId;
  }, [activeAlertId]);

  useEffect(() => {
    isLiveRef.current = isLive;
  }, [isLive]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2800);
  }, []);

  const checkNextInQueue = useCallback(() => {
    if (isBusyRef.current || queueRef.current.length === 0) return;
    const nextAlert = queueRef.current.shift();
    setQueuedCount(queueRef.current.length);
    if (nextAlert && processAlertRef.current) {
      processAlertRef.current(nextAlert);
    }
  }, []);

  // Worker pipeline function for typewriter AI reasoning stream
  const processAlert = useCallback(async (alertToProcess: RealtimeAlert) => {
    isBusyRef.current = true;
    setIsBusy(true);

    alertToProcess.state = "analyzing";
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertToProcess.id ? { ...a, state: "analyzing" } : a))
    );

    const steps = getAlertSteps(alertToProcess);

    for (let i = 0; i < steps.length; i++) {
      const fullEvidence = steps[i][1];
      alertToProcess.prog = i;

      // Typewriter progressive character stream
      for (let charIdx = 1; charIdx <= fullEvidence.length; charIdx++) {
        alertToProcess.txt[i] = fullEvidence.slice(0, charIdx);

        // Update active alert text in state
        setAlerts((prev) =>
          prev.map((a) => {
            if (a.id === alertToProcess.id) {
              const newTxt = [...a.txt];
              newTxt[i] = alertToProcess.txt[i];
              return { ...a, prog: i, txt: newTxt };
            }
            return a;
          })
        );

        // Natural typing pause
        await new Promise((r) => setTimeout(r, 14 + randomInt(12)));
      }

      await new Promise((r) => setTimeout(r, 240));
      alertToProcess.prog = i + 1;
      setAlerts((prev) =>
        prev.map((a) => (a.id === alertToProcess.id ? { ...a, prog: i + 1 } : a))
      );
    }

    // Complete analysis
    alertToProcess.state = "done";
    setAnalyzedCount((c) => c + 1);
    if (alertToProcess.score >= 65) {
      setEscalatedCount((c) => c + 1);
    }

    if (alertToProcess.score >= 85) {
      showToast(`Critical Threat Confirmed: ${alertToProcess.title}`);
    }

    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertToProcess.id ? { ...a, state: "done", prog: 5 } : a
      )
    );

    isBusyRef.current = false;
    setIsBusy(false);

    // Process next item in queue
    await new Promise((r) => setTimeout(r, 400));
    checkNextInQueue();
  }, [showToast, checkNextInQueue]);

  useEffect(() => {
    processAlertRef.current = processAlert;
  }, [processAlert]);

  const injectAlert = useCallback(
    (newAlert: RealtimeAlert, selectImmediately = false) => {
      setAlerts((prev) => {
        // Prevent duplicate keys
        if (prev.some((a) => a.id === newAlert.id)) {
          return prev;
        }
        return [newAlert, ...prev.slice(0, 24)];
      });

      // Prevent duplicate queue entries
      if (!queueRef.current.some((q) => q.id === newAlert.id)) {
        queueRef.current.push(newAlert);
        setQueuedCount(queueRef.current.length);
      }

      if (selectImmediately || !activeAlertIdRef.current) {
        setActiveAlertId(newAlert.id);
      }

      checkNextInQueue();
    },
    [checkNextInQueue]
  );

  // Initial arriving live event on mount (guarded against double-invocation)
  useEffect(() => {
    if (initialArrivedRef.current) return;
    initialArrivedRef.current = true;

    const firstArrival = setTimeout(() => {
      const liveAlert = createAlert(undefined, alertsRef.current);
      injectAlert(liveAlert, true);
    }, 900);

    return () => clearTimeout(firstArrival);
  }, [injectAlert]);

  // Recurring live arrivals timer
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      if (queueRef.current.length >= 8) return;
      const incoming = createAlert(undefined, alertsRef.current);
      injectAlert(incoming, false);
    }, 5500);

    return () => clearInterval(interval);
  }, [isLive, injectAlert]);

  // Handle custom alert injected by user
  const handleCustomAlertSubmit = (data: {
    text: string;
    severity: SeverityLevel;
    host: string;
  }) => {
    const customAlert = createAlert(data, alertsRef.current);
    injectAlert(customAlert, true);
    showToast(`Injected custom alert: ${customAlert.id}`);
  };

  const activeAlert = alerts.find((a) => a.id === activeAlertId) || alerts[0];
  const steps = activeAlert ? getAlertSteps(activeAlert) : [];
  const verdict = activeAlert ? getAlertVerdict(activeAlert) : ["", ""];
  const isAnalyzing = activeAlert?.state === "analyzing";
  const isDone = activeAlert?.state === "done";
  const reportMarkdown = activeAlert ? generateIncidentReport(activeAlert) : "";

  const handleCopyReport = () => {
    if (!reportMarkdown) return;
    navigator.clipboard.writeText(reportMarkdown);
    setCopied(true);
    showToast("Report copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReport = () => {
    if (!activeAlert || !reportMarkdown) return;
    const blob = new Blob([reportMarkdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeAlert.id}-report.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${activeAlert.id}-report.md`);
  };

  return (
    <DashboardShell title="Realtime AI">
      <div className="space-y-6">
        {/* Top Header: Title, Controls, Counters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-[28px] sm:text-[34px] font-heading font-extrabold text-foreground tracking-[-0.02em]">
                Realtime
              </h1>
              <span className="text-[11px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-status-error-500 text-white">
                LIVE AI
              </span>
            </div>
            <p className="text-[13px] sm:text-[14px] text-muted-foreground max-w-xl">
              Queued alerts are analyzed in the background. The panel updates when you select an alert.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Live Toggle Pill */}
            <button
              type="button"
              onClick={() => setIsLive(!isLive)}
              className={`flex items-center gap-2 h-10 px-4 rounded-full border text-[13px] font-semibold transition-all shadow-sh-sm cursor-pointer ${
                isLive
                  ? "border-status-error-500/50 bg-status-error-500/10 text-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  isLive ? "bg-status-error-500 animate-live-pulse" : "bg-muted-foreground"
                }`}
              />
              <span>{isLive ? "Live Stream" : "Stream Paused"}</span>
              {isLive ? <Pause className="w-3.5 h-3.5 ml-1" /> : <Play className="w-3.5 h-3.5 ml-1" />}
            </button>

            {/* Metric Counters */}
            <div className="flex items-center gap-2">
              <div className="bg-card border border-border rounded-xl px-4 py-2 min-w-22 shadow-sh-sm">
                <span className="block text-[22px] font-heading font-extrabold leading-none text-foreground">
                  {analyzedCount}
                </span>
                <span className="text-[11px] font-semibold text-muted-foreground">Analyzed</span>
              </div>
              <div className="bg-card border border-border rounded-xl px-4 py-2 min-w-22 shadow-sh-sm">
                <span className="block text-[22px] font-heading font-extrabold leading-none text-status-warning-600 dark:text-status-warning-400">
                  {escalatedCount}
                </span>
                <span className="text-[11px] font-semibold text-muted-foreground">Escalated</span>
              </div>
              <div className="bg-card border border-border rounded-xl px-4 py-2 min-w-22 shadow-sh-sm">
                <span className="block text-[22px] font-heading font-extrabold leading-none text-brand-plum dark:text-brand-rose">
                  {queuedCount}
                </span>
                <span className="text-[11px] font-semibold text-muted-foreground">Queued</span>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Alert Injector */}
        <CustomAlertInput onSubmit={handleCustomAlertSubmit} isAnalyzing={isBusy} />

        {/* Main 2-Column Split: Stream (Left) vs AI Investigation Panel (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Incoming Stream */}
          <section className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-[15px] font-heading font-extrabold text-foreground">
                Incoming stream
              </h2>
              <span className="text-[12px] font-mono text-muted-foreground">
                {alerts.length} events
              </span>
            </div>

            <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
              <AnimatePresence initial={false}>
                {alerts.map((a) => {
                  const isSelected = activeAlertId === a.id;
                  const isCardAnalyzing = a.state === "analyzing";

                  return (
                    <motion.button
                      key={a.id}
                      type="button"
                      initial={{ opacity: 0, y: -16, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      onClick={() => setActiveAlertId(a.id)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all relative overflow-hidden flex flex-col gap-1.5 cursor-pointer shadow-sh-sm ${
                        isSelected
                          ? "border-brand-rose dark:border-brand-rose bg-card shadow-sh-md ring-1 ring-brand-rose/40"
                          : "border-border bg-card/80 hover:bg-card hover:border-border/80 hover:translate-x-1"
                      } ${isCardAnalyzing ? "animate-card-shimmer" : ""}`}
                    >
                      {/* Top: Severity Badge + Title + Tag */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <SeverityBadge severity={a.sev} />
                          <span className="font-semibold text-[13px] text-foreground truncate">
                            {a.title}
                          </span>
                        </div>

                        {/* Status Tag */}
                        <div>
                          {a.state === "analyzing" ? (
                            <span className="text-[11px] font-mono font-semibold text-brand-rose animate-pulse whitespace-nowrap">
                              analyzing…
                            </span>
                          ) : a.state === "queued" ? (
                            <span className="text-[11px] font-mono text-muted-foreground whitespace-nowrap">
                              queued
                            </span>
                          ) : (
                            <span className="text-[11px] font-semibold text-foreground whitespace-nowrap">
                              {getAlertVerdict(a)[0]}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Subtitle Details: ID · Host · Technique */}
                      <div className="text-[11px] font-mono text-muted-foreground flex items-center gap-1.5">
                        <span>{a.id}</span>
                        <span>·</span>
                        <span>{a.host}</span>
                        <span>·</span>
                        <span className="text-foreground">{a.tech}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          </section>

          {/* Right Column: AI Analysis Panel */}
          <section className="lg:col-span-7">
            {activeAlert ? (
              <div className="rounded-3xl border border-border bg-card shadow-sh-md p-6 sm:p-7 space-y-6 sticky top-4 overflow-hidden">
                {/* Panel Header: Orb + Title + Status Line */}
                <div className="flex items-center gap-4 border-b border-border/50 pb-5">
                  <AiOrb isThinking={isAnalyzing} />

                  <div className="space-y-1 min-w-0">
                    <h3 className="text-[20px] sm:text-[22px] font-heading font-extrabold text-foreground tracking-tight truncate">
                      {activeAlert.title}
                    </h3>
                    <div className="text-[13px] font-medium text-muted-foreground flex items-center gap-1.5">
                      {isAnalyzing ? (
                        <span className="animate-text-shimmer font-semibold flex items-center gap-1">
                          <span>AI analyst is reasoning</span>
                          <span className="inline-flex gap-0.5">
                            <span className="animate-bounce">.</span>
                            <span className="animate-bounce [animation-delay:0.15s]">.</span>
                            <span className="animate-bounce [animation-delay:0.3s]">.</span>
                          </span>
                        </span>
                      ) : isDone ? (
                        <span className="text-status-success-600 dark:text-status-success-400 font-semibold flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Analysis complete</span>
                        </span>
                      ) : (
                        <span>Waiting in triage queue</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Event Chips */}
                <div className="flex flex-wrap items-center gap-2">
                  <SeverityBadge severity={activeAlert.sev} />
                  <span className="text-[12px] font-mono font-medium px-2.5 py-0.5 rounded-full border border-border bg-muted/30 text-foreground">
                    {activeAlert.id}
                  </span>
                  <span className="text-[12px] font-mono font-medium px-2.5 py-0.5 rounded-full border border-border bg-muted/30 text-foreground">
                    {activeAlert.host}
                  </span>
                  <span className="text-[12px] font-mono font-medium px-2.5 py-0.5 rounded-full border border-border bg-muted/30 text-foreground">
                    {activeAlert.tech}
                  </span>
                </div>

                {/* 5-Step Reasoning Pipeline */}
                <ol className="space-y-3 font-sans">
                  {steps.map(([stepTitle], i) => {
                    const isStepComplete = i < activeAlert.prog;
                    const isStepActive = i === activeAlert.prog && isAnalyzing;
                    const evidenceText = activeAlert.txt[i] || "";

                    return (
                      <li
                        key={stepTitle}
                        className={`flex items-start gap-3.5 transition-opacity duration-300 ${
                          isStepComplete || isStepActive ? "opacity-100" : "opacity-35"
                        }`}
                      >
                        {/* Step Marker */}
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 text-[11px] font-bold transition-all ${
                            isStepComplete
                              ? "bg-status-success-500 border-status-success-500 text-white"
                              : isStepActive
                              ? "border-brand-rose border-t-transparent animate-spin text-transparent"
                              : "border-border text-muted-foreground"
                          }`}
                        >
                          {isStepComplete && <Check className="w-3.5 h-3.5 stroke-3" />}
                        </div>

                        {/* Step Content */}
                        <div className="space-y-0.5 flex-1 min-w-0">
                          <b className="text-[13px] font-semibold text-foreground block">
                            {stepTitle}
                          </b>
                          <small className="block font-mono text-[12px] text-muted-foreground leading-relaxed break-all">
                            {evidenceText}
                            {isStepActive && (
                              <span className="text-brand-rose animate-cursor-blink ml-0.5">
                                ▍
                              </span>
                            )}
                          </small>
                        </div>
                      </li>
                    );
                  })}
                </ol>

                {/* Verdict Card (Displays when Done) */}
                {isDone && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="p-5 rounded-2xl bg-brand-ink text-brand-paper dark:bg-brand-paper dark:text-brand-ink space-y-3.5 shadow-sh-md"
                  >
                    <div>
                      <div className="text-[20px] font-heading font-extrabold tracking-tight">
                        {verdict[0]}
                      </div>
                      <p className="text-[13px] text-brand-rose dark:text-brand-plum mt-1">
                        {verdict[1]}
                      </p>
                    </div>

                    {/* Risk Progress Bar */}
                    <div className="space-y-1">
                      <div className="w-full h-2 rounded-full bg-white/20 dark:bg-black/15 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${activeAlert.score}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="h-full bg-current rounded-full"
                        />
                      </div>
                      <div className="flex justify-between text-[11px] font-mono opacity-80 pt-0.5">
                        <span>Risk {activeAlert.score}/100</span>
                        <span>Confidence {activeAlert.conf}%</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => showToast(`Executing: ${verdict[0]}`)}
                        className="px-4 py-2 rounded-xl text-[12px] font-semibold border-2 border-current bg-transparent hover:opacity-80 transition-all cursor-pointer"
                      >
                        {verdict[0]}
                      </button>
                      <button
                        type="button"
                        onClick={() => showToast(`Dismissed alert ${activeAlert.id}`)}
                        className="px-4 py-2 rounded-xl text-[12px] font-semibold opacity-70 hover:opacity-100 transition-all cursor-pointer"
                      >
                        Dismiss
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Markdown Telemetry Incident Report */}
                {isDone && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="space-y-2 pt-2 border-t border-border/50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[13px] font-heading font-extrabold text-foreground">
                        Incident Report (Markdown)
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleCopyReport}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-muted/40 hover:bg-muted text-[12px] font-semibold text-foreground transition-all cursor-pointer"
                        >
                          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copied ? "Copied" : "Copy"}</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleDownloadReport}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-muted/40 hover:bg-muted text-[12px] font-semibold text-foreground transition-all cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download .md</span>
                        </button>
                      </div>
                    </div>

                    <pre className="p-4 rounded-xl border border-border bg-muted/30 font-mono text-[11px] leading-relaxed text-foreground overflow-x-auto max-h-60 select-all whitespace-pre-wrap">
                      {reportMarkdown}
                    </pre>
                  </motion.div>
                )}

                {/* Footer Status */}
                <div className="pt-2 text-[12px] text-muted-foreground flex items-center justify-between border-t border-border/40">
                  <span>
                    {isBusy || queuedCount > 0
                      ? `Analyzing other alerts in background · ${queuedCount} queued`
                      : "All incoming alerts analyzed"}
                  </span>
                  <span className="font-mono text-[11px]">Sentinel Neural v3</span>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center rounded-3xl border border-dashed border-border bg-card text-muted-foreground">
                Select an alert from the stream to begin AI investigation.
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-full bg-brand-ink text-brand-paper dark:bg-brand-paper dark:text-brand-ink font-semibold text-[13px] shadow-sh-lg border border-border/30 flex items-center gap-2 pointer-events-none"
          >
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardShell>
  );
}
