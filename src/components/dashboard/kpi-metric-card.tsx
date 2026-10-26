"use client";

import React from "react";
import { type LucideIcon, ArrowUp, ArrowDown } from "lucide-react";
import { motion } from "motion/react";

interface KpiMetricCardProps {
  title: string;
  count: string | number;
  icon: LucideIcon;
  trendPercentage: number;
  trendDirection: "higher" | "lower";
  periodLabel?: string;
  isNegative?: boolean;
  delayIndex?: number;
}

export function KpiMetricCard({
  title,
  count,
  icon: Icon,
  trendPercentage,
  trendDirection,
  periodLabel = "vs previous 6 hours",
  isNegative = false,
  delayIndex = 0,
}: KpiMetricCardProps) {
  const isUp = trendDirection === "higher";
  const badgeStyle = isUp
    ? isNegative
      ? "bg-status-error-100 dark:bg-status-error-500/20 text-status-error-700 dark:text-status-error-100 border-status-error-500/30"
      : "bg-status-success-100 dark:bg-status-success-500/20 text-status-success-700 dark:text-status-success-100 border-status-success-500/30"
    : "bg-status-success-100 dark:bg-status-success-500/20 text-status-success-700 dark:text-status-success-100 border-status-success-500/30";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: delayIndex * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="p-5 sm:p-6 rounded-2xl border border-border bg-card shadow-sh-sm flex flex-col justify-between space-y-4 hover:border-border/80 hover:shadow-sh-md transition-shadow cursor-default"
    >
      {/* Top: Icon + Title */}
      <div className="flex items-center gap-2.5 text-muted-foreground">
        <div className="p-1.5 rounded-lg bg-muted/40 border border-border/40 text-foreground">
          <Icon className="w-4 h-4 shrink-0" />
        </div>
        <span className="text-[14px] font-semibold text-foreground tracking-tight">
          {title}
        </span>
      </div>

      {/* Middle: Big Metric Value */}
      <div className="text-[40px] sm:text-[44px] leading-none font-heading font-extrabold text-foreground tracking-[-0.02em]">
        {count}
      </div>

      {/* Bottom: Trend Badge + Comparison Label */}
      <div className="space-y-1 pt-1">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border transition-colors ${badgeStyle}`}
          >
            {isUp ? (
              <ArrowUp className="w-3 h-3 stroke-[2.5]" />
            ) : (
              <ArrowDown className="w-3 h-3 stroke-[2.5]" />
            )}
            <span>
              {trendPercentage}% {trendDirection}
            </span>
          </span>
        </div>
        <p className="text-[12px] text-muted-foreground font-medium">
          {periodLabel}
        </p>
      </div>
    </motion.div>
  );
}
