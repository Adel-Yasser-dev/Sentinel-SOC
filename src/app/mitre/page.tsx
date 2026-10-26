"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { X } from "lucide-react";

interface MitreTactic {
  id: string;
  name: string;
  count: number;
  barColor: string;
  splitBarColor?: string;
  techniques: string[];
  description: string;
}

const mitreTactics: MitreTactic[] = [
  {
    id: "TA0006",
    name: "Credential Access",
    count: 4,
    barColor: "#e7b33c",
    techniques: ["T1110"],
    description:
      "Adversaries attempt to steal credentials like account names and passwords using brute force or dumping.",
  },
  {
    id: "TA0002",
    name: "Execution",
    count: 2,
    barColor: "#b83d4d",
    techniques: ["T1059.001"],
    description:
      "Adversaries run malicious code on a target host using PowerShell or native command interpreters.",
  },
  {
    id: "TA0003",
    name: "Persistence",
    count: 4,
    barColor: "#5cad86",
    techniques: ["T1053"],
    description:
      "Adversaries maintain access across system reboots or credential rotations via scheduled tasks.",
  },
  {
    id: "TA0007",
    name: "Discovery",
    count: 6,
    barColor: "#ecd27a",
    techniques: ["T1046", "T1595"],
    description:
      "Adversaries observe the environment to orient themselves and determine system configuration.",
  },
  {
    id: "TA0011",
    name: "Command and Control",
    count: 8,
    barColor: "#b83d4d",
    splitBarColor: "#5cad86",
    techniques: ["T1071", "T1071.004"],
    description:
      "Adversaries communicate with systems under their control using standard protocols and encrypted tunnels.",
  },
  {
    id: "TA0010",
    name: "Exfiltration",
    count: 5,
    barColor: "#e7b33c",
    techniques: ["T1048"],
    description:
      "Adversaries steal sensitive internal documents and telemetry to external command hosts.",
  },
  {
    id: "TA0001",
    name: "Initial Access",
    count: 4,
    barColor: "#ecd27a",
    techniques: ["T1566"],
    description:
      "Adversaries gain an entry foothold through phishing, external proxies, or valid compromised accounts.",
  },
  {
    id: "TA0008",
    name: "Lateral Movement",
    count: 3,
    barColor: "#e7b33c",
    techniques: ["T1021.001"],
    description:
      "Adversaries pivot and extend access across additional network assets using remote desktop or SSH.",
  },
  {
    id: "TA0005",
    name: "Defense Evasion",
    count: 8,
    barColor: "#b83d4d",
    techniques: ["T1070"],
    description:
      "Adversaries modify or clear forensic security event logs to prevent detection.",
  },
  {
    id: "TA0004",
    name: "Privilege Escalation",
    count: 4,
    barColor: "#e7b33c",
    techniques: ["T1078"],
    description:
      "Adversaries exploit system misconfigurations or tokens to elevate permissions to root or domain admin.",
  },
];

export default function MitrePage() {
  const [selectedTactic, setSelectedTactic] = useState<MitreTactic | null>(
    null,
  );

  return (
    <DashboardShell title="Miter ATTA&CK">
      <div className="space-y-6">
        {/* Page Title & Subtitle Banner */}
        <div className="space-y-1">
          <h1 className="text-[28px] sm:text-[32px] font-heading font-extrabold text-brand-ink dark:text-brand-paper tracking-[-0.02em]">
            Miter ATTA&CK
          </h1>
          <p className="text-[14px] text-muted-foreground">
            Where alerts land along the attack chain. Select a tactic to see its
            alerts.
          </p>
        </div>

        {/* 10 Tactics Grid with Staggered Card Entrance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {mitreTactics.map((item, idx) => (
            <motion.div
              key={item.id}
              onClick={() => setSelectedTactic(item)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                delay: idx * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="p-5 sm:p-6 rounded-2xl border border-border bg-card shadow-sh-sm flex flex-col justify-between space-y-4 hover:border-border/80 hover:shadow-sh-md transition-shadow cursor-pointer group"
            >
              {/* Top: Name */}
              <div>
                <span className="text-[14px] font-semibold text-foreground group-hover:text-primary transition-colors">
                  {item.name}
                </span>
                <div className="text-[36px] font-heading font-extrabold text-foreground leading-none mt-2">
                  {item.count}
                </div>
              </div>

              {/* Progress Bar Indicator */}
              <div className="space-y-2">
                <div className="w-full h-2 rounded-full bg-muted/60 overflow-hidden flex">
                  {item.splitBarColor ? (
                    <>
                      <div
                        className="h-full rounded-l-full"
                        style={{
                          width: "50%",
                          backgroundColor: item.barColor,
                        }}
                      />
                      <div
                        className="h-full rounded-r-full"
                        style={{
                          width: "50%",
                          backgroundColor: item.splitBarColor,
                        }}
                      />
                    </>
                  ) : (
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, item.count * 12)}%`,
                        backgroundColor: item.barColor,
                      }}
                    />
                  )}
                </div>

                {/* Technique Pills */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {item.techniques.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-[6px] border border-border/80 bg-muted/40 font-mono text-[11px] font-medium text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Slide-over Tactic Detail Modal with AnimatePresence */}
      <AnimatePresence>
        {selectedTactic && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setSelectedTactic(null)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="relative z-50 w-full max-w-md bg-card border-l border-border h-full shadow-sh-lg flex flex-col justify-between p-6 sm:p-8 overflow-y-auto"
            >
            <div className="space-y-6">
              <div className="flex items-start justify-between border-b border-border/60 pb-4">
                <div className="space-y-1">
                  <div className="text-[12px] font-mono text-muted-foreground">
                    {selectedTactic.id}
                  </div>
                  <h3 className="text-[20px] font-heading font-extrabold text-foreground">
                    {selectedTactic.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedTactic(null)}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-[13px]">
                <div className="p-4 rounded-md bg-muted/40 border border-border/60 space-y-2">
                  <div className="text-muted-foreground">
                    Active Correlated Incidents
                  </div>
                  <div className="text-[32px] font-heading font-extrabold text-foreground">
                    {selectedTactic.count}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[14px] font-semibold text-foreground">
                    Tactic Overview
                  </h4>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">
                    {selectedTactic.description}
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <h4 className="text-[14px] font-semibold text-foreground">
                    Observed Techniques
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTactic.techniques.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-sm border border-border bg-background font-mono text-[12px] font-medium text-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border/60">
              <button
                type="button"
                onClick={() => setSelectedTactic(null)}
                className="w-full h-10 rounded-[10px] text-[13px] font-semibold bg-brand-ink text-brand-paper dark:bg-brand-paper dark:text-brand-ink hover:opacity-90 transition-all shadow-sh-sm"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  </DashboardShell>
  );
}
