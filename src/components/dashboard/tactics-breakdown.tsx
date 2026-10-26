"use client";

import React from "react";
import { motion } from "motion/react";

export function TacticsBreakdown({ delay = 0.48 }: { delay?: number }) {
  const tactics = [
    { name: "Defense Evasion", count: 8, max: 10 },
    { name: "Command and Control", count: 8, max: 10 },
    { name: "Discovery", count: 6, max: 10 },
    { name: "Exfiltration", count: 5, max: 10 },
    { name: "Credential Access", count: 4, max: 10 },
    { name: "Persistence", count: 4, max: 10 },
  ];

  return (
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
      <h3 className="text-[17px] font-heading font-extrabold text-foreground">
        Busiest MITRE Tactics
      </h3>
      <div className="space-y-3.5 pt-1">
        {tactics.map((t, idx) => (
          <div key={t.name} className="flex items-center gap-3 text-[13px] group">
            <span className="w-36 font-medium text-foreground truncate shrink-0 group-hover:text-brand-rose transition-colors">
              {t.name}
            </span>
            <div className="flex-1 h-2 rounded-full bg-muted/60 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(t.count / t.max) * 100}%` }}
                transition={{
                  duration: 0.7,
                  delay: delay + 0.12 + idx * 0.04,
                  ease: "easeOut",
                }}
                className="h-full bg-brand-plum dark:bg-brand-rose rounded-full"
              />
            </div>
            <span className="w-4 font-mono font-bold text-foreground text-right shrink-0">
              {t.count}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
