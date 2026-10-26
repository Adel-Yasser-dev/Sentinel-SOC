"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";

export function SeverityMixChart({ delay = 0.4 }: { delay?: number }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimated(true), 80);
    return () => clearTimeout(timer);
  }, []);

  const segments = useMemo(
    () => [
      { label: "Critical", count: 59, color: "#b83d4d" },
      { label: "High", count: 118, color: "#e7b33c" },
      { label: "Medium", count: 104, color: "#ecd27a" },
      { label: "Low", count: 62, color: "#5cad86" },
      { label: "Info", count: 18, color: "#8fb0e6" },
    ],
    [],
  );

  const total = useMemo(
    () => segments.reduce((acc, curr) => acc + curr.count, 0),
    [segments],
  );

  const radius = 64;
  const circumference = 2 * Math.PI * radius;

  // Pre-calculate exact dash geometry for each segment arc
  const preparedSegments = useMemo(() => {
    let accumulated = 0;
    return segments.map((seg, idx) => {
      const percent = seg.count / total;
      const targetDasharray = `${percent * circumference} ${circumference}`;
      const targetDashoffset = -accumulated * circumference;
      accumulated += percent;
      return {
        ...seg,
        idx,
        percent,
        targetDasharray,
        targetDashoffset,
      };
    });
  }, [segments, total, circumference]);

  const activeSegment =
    hoveredIdx !== null ? preparedSegments[hoveredIdx] : null;

  const renderCircle = (
    seg: (typeof preparedSegments)[0],
    isHovered: boolean,
  ) => {
    const isOtherHovered = hoveredIdx !== null && !isHovered;
    const animDelay = seg.idx * 0.12;

    return (
      <circle
        key={seg.label}
        cx="80"
        cy="80"
        r={radius}
        fill="none"
        stroke={seg.color}
        strokeWidth={isHovered ? 26 : 22}
        strokeDasharray={
          isAnimated ? seg.targetDasharray : `0 ${circumference}`
        }
        strokeDashoffset={isAnimated ? seg.targetDashoffset : 0}
        style={{
          pointerEvents: "stroke",
          opacity: isOtherHovered ? 0.38 : 1,
          filter: isHovered ? `drop-shadow(0 0 6px ${seg.color}99)` : "none",
          transition: isAnimated
            ? "stroke-width 0.2s ease, opacity 0.25s ease, filter 0.25s ease"
            : `stroke-dasharray 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${animDelay}s, stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1) ${animDelay}s, stroke-width 0.2s ease`,
        }}
        className="cursor-pointer transition-all"
        onMouseEnter={() => setHoveredIdx(seg.idx)}
        onMouseLeave={() => setHoveredIdx(null)}
      />
    );
  };

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
      className="p-5 sm:p-6 rounded-2xl border border-border bg-card shadow-sh-sm flex flex-col justify-between space-y-4 h-full hover:border-border/80 hover:shadow-sh-md transition-shadow cursor-default"
    >
      {/* Title */}
      <div>
        <h3 className="text-[17px] font-heading font-extrabold text-foreground">
          Severity Mix
        </h3>
        <p className="text-[12px] text-muted-foreground mt-0.5">
          Proportional breakdown of open incidents
        </p>
      </div>

      {/* Donut Chart Visual with Drawing Animation and Layered Hover */}
      <div className="flex items-center justify-center py-2 relative">
        <svg
          viewBox="0 0 160 160"
          className="w-44 h-44 -rotate-90 overflow-visible"
        >
          {/* 1. Inactive segments drawn first */}
          {preparedSegments
            .filter((s) => s.idx !== hoveredIdx)
            .map((seg) => renderCircle(seg, false))}

          {/* 2. Active hovered segment drawn last (elevated on top) */}
          {activeSegment && renderCircle(activeSegment, true)}
        </svg>

        {/* Center Total / Active Hover Info Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSegment ? activeSegment.label : "total"}
              initial={{ opacity: 0, scale: 0.9, y: 3 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -3 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="flex flex-col items-center justify-center text-center px-2"
            >
              <span
                className="text-[28px] font-heading font-extrabold leading-none tracking-tight"
                style={{
                  color: activeSegment ? activeSegment.color : "inherit",
                }}
              >
                {activeSegment ? activeSegment.count : total}
              </span>
              {!activeSegment && (
                <span className="text-[12px] font-semibold tracking-tight text-foreground mt-1">
                  Total Alerts
                </span>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Legend & Breakdown List with synced hover highlight */}
      <div className="space-y-1.5 pt-2 border-t border-border/50 text-[13px]">
        {preparedSegments.map((seg) => {
          const isHovered = hoveredIdx === seg.idx;
          return (
            <div
              key={seg.label}
              className={`flex items-center justify-between py-1.5 px-2 rounded-lg transition-all cursor-pointer ${
                isHovered ? "bg-muted/70 shadow-sh-sm" : "hover:bg-muted/30"
              }`}
              onMouseEnter={() => setHoveredIdx(seg.idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 transition-all duration-200"
                  style={{
                    backgroundColor: seg.color,
                    transform: isHovered ? "scale(1.4)" : "scale(1)",
                    boxShadow: isHovered ? `0 0 6px ${seg.color}` : "none",
                  }}
                />
                <span
                  className={`transition-colors ${
                    isHovered
                      ? "font-semibold text-foreground"
                      : "font-medium text-foreground"
                  }`}
                >
                  {seg.label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-muted-foreground">
                  {(seg.percent * 100).toFixed(1)}%
                </span>
                <span className="font-mono font-bold text-foreground min-w-7 text-right">
                  {seg.count}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
