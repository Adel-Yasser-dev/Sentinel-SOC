"use client";

import React, { useState } from "react";
import { Sparkles, Terminal, ChevronDown, ChevronUp } from "lucide-react";
import type { SeverityLevel } from "@/lib/realtime-ai-types";

interface CustomAlertInputProps {
  onSubmit: (data: {
    text: string;
    severity: SeverityLevel;
    host: string;
  }) => void;
  isAnalyzing?: boolean;
}

const PRESET_TELEMETRY = [
  {
    title: "Encoded PowerShell Execution",
    sev: "critical" as SeverityLevel,
    host: "DC-01",
    payload:
      "powershell.exe -NoP -NonI -W Hidden -Enc SQBFAFgAIAAoAE4AZQB3AC0ATwBiAGoAZQBjAHQAIABOAGUAdAAuAFcAZQBiAEMAbABpAGUAbgB0ACkALgBEAG8AdwBuAGwAbwBhAGQAUwB0AHIAaQBuAGcAKAA...",
  },
  {
    title: "Kerberoasting Ticket Extraction",
    sev: "high" as SeverityLevel,
    host: "DB-02",
    payload:
      "EventID: 4769 - A Kerberos service ticket was requested with encryption type 0x17 (RC4-HMAC) for MSSQLSvc/db02.corp.internal by user svc_backup.",
  },
  {
    title: "Outbound C2 Tunnel on Port 443",
    sev: "critical" as SeverityLevel,
    host: "FIN-PC-07",
    payload:
      "Traffic spike: 185.220.101.4:443 beacon interval jitter 4.2s. Protocol mismatch: TLS handshake payload contains raw encrypted binary buffer.",
  },
  {
    title: "Suspicious Shadow Copy Deletion",
    sev: "critical" as SeverityLevel,
    host: "FILE-SRV-01",
    payload:
      "vssadmin.exe delete shadows /all /quiet && wbadmin delete catalog -quiet",
  },
];

export function CustomAlertInput({
  onSubmit,
  isAnalyzing = false,
}: CustomAlertInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const [severity, setSeverity] = useState<SeverityLevel>("high");
  const [host, setHost] = useState("HR-LAPTOP-14");

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim()) return;

    onSubmit({
      text: text.trim(),
      severity,
      host: host.trim() || "HOST-ENDPOINT",
    });

    setText("");
    setIsOpen(false);
  };

  const handleApplyPreset = (preset: (typeof PRESET_TELEMETRY)[0]) => {
    setText(preset.payload);
    setSeverity(preset.sev);
    setHost(preset.host);
  };

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sh-sm overflow-hidden transition-all">
      {/* Collapsed Header / Toggle Bar */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-brand-plum/10 dark:bg-brand-plum/20 text-brand-plum dark:text-brand-rose border border-border/50">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-heading font-extrabold text-foreground">
                Feed Custom Telemetry to AI Analyst
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-brand-plum/15 text-brand-plum dark:text-brand-rose">
                Backend Injector
              </span>
            </div>
            <p className="text-[12px] text-muted-foreground">
              Enter raw logs, command lines, or simulated alerts to watch the AI
              stream live analysis.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground text-[12px] font-medium">
          <span>{isOpen ? "Collapse" : "Open Input"}</span>
          {isOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </button>

      {/* Expandable Form Body */}
      {isOpen && (
        <div className="p-5 pt-0 border-t border-border/50 space-y-4 mt-1">
          {/* Preset Buttons */}
          <div className="space-y-1.5 pt-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Quick Telemetry Presets:
            </span>
            <div className="flex flex-wrap gap-2">
              {PRESET_TELEMETRY.map((p) => (
                <button
                  key={p.title}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="px-2.5 py-1 text-[11px] font-medium rounded-lg border border-border bg-muted/30 hover:bg-muted text-foreground transition-all"
                >
                  {p.title}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Meta Row: Host + Severity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
              <div>
                <label className="block text-[12px] font-semibold text-muted-foreground mb-1">
                  Target Host Endpoint
                </label>
                <input
                  type="text"
                  value={host}
                  onChange={(e) => setHost(e.target.value)}
                  placeholder="e.g. DC-01, WEB-SERVER, FIN-PC-07"
                  className="w-full h-9 px-3 rounded-xl border border-border bg-background text-foreground font-mono text-[12px] focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-muted-foreground mb-1">
                  Initial Severity Tag
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as SeverityLevel)}
                  className="w-full h-9 px-3 rounded-xl border border-border bg-background text-foreground text-[13px] focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                  <option value="info">Info</option>
                </select>
              </div>
            </div>

            {/* Main Log/Payload Textarea */}
            <div>
              <label className="block text-[12px] font-semibold text-muted-foreground mb-1">
                Raw Log Payload / Threat Description
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste telemetry logs, command lines, or incident description here..."
                rows={3}
                onKeyDown={(e) => {
                  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                    handleSubmit();
                  }
                }}
                className="w-full p-3 rounded-xl border border-border bg-background font-mono text-[12px] text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y min-h-20"
              />
            </div>

            {/* Submit Action */}
            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-muted-foreground">
                Press{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">
                  Ctrl+Enter
                </kbd>{" "}
                to analyze
              </span>

              <button
                type="submit"
                disabled={!text.trim() || isAnalyzing}
                className="inline-flex items-center gap-2 h-9 px-4 rounded-xl text-[13px] font-semibold bg-brand-ink text-brand-paper dark:bg-brand-paper dark:text-brand-ink hover:opacity-90 disabled:opacity-50 transition-all shadow-sh-sm cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Inject & Analyze with AI</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
