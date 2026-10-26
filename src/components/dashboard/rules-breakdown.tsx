"use client";

import React from "react";
import { motion } from "motion/react";

export function RulesBreakdown({ delay = 0.54 }: { delay?: number }) {
  const rules = [
    { name: "Security log cleared", count: 8 },
    { name: "Large upload to unknown host", count: 5 },
    { name: "Brute force login attempts", count: 4 },
    { name: "Scheduled task modified", count: 4 },
    { name: "Outbound beacon to rare host", count: 4 },
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
        Most Triggered Rules
      </h3>
      <div className="divide-y divide-border/60 text-[13px]">
        {rules.map((r) => (
          <div
            key={r.name}
            className="py-2.5 flex items-center justify-between first:pt-1 last:pb-1 hover:bg-muted/30 px-1 rounded transition-colors"
          >
            <span className="font-medium text-foreground truncate pr-2">
              {r.name}
            </span>
            <span className="font-mono font-bold text-foreground shrink-0">
              {r.count}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
