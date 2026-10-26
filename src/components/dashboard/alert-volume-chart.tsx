"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export function AlertVolumeChart({ delay = 0.32 }: { delay?: number }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimated(true), 60);
    return () => clearTimeout(timer);
  }, []);

  const data = [
    { time: "11h ago", all: 30, critical: 4 },
    { time: "10h ago", all: 26, critical: 3 },
    { time: "9h ago", all: 22, critical: 3 },
    { time: "8h ago", all: 20, critical: 2 },
    { time: "7h ago", all: 24, critical: 3 },
    { time: "6h ago", all: 28, critical: 4 },
    { time: "5h ago", all: 31, critical: 4 },
    { time: "4h ago", all: 35, critical: 5 },
    { time: "3h ago", all: 34, critical: 4 },
    { time: "2h ago", all: 39, critical: 6 },
    { time: "1h ago", all: 37, critical: 5 },
    { time: "Now", all: 33, critical: 4 },
  ];

  // SVG coordinate calculations (balanced view to match donut card height)
  const width = 760;
  const height = 280;
  const paddingX = 48;
  const paddingY = 28;

  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;
  const maxVal = 40;
  const colWidth = chartW / (data.length - 1);

  const getX = (index: number) =>
    paddingX + (index / (data.length - 1)) * chartW;
  const getY = (val: number) =>
    height - paddingY - (val / maxVal) * chartH;

  // Build SVG path strings
  const allPoints = data.map((d, i) => `${getX(i)},${getY(d.all)}`).join(" ");
  const criticalPoints = data
    .map((d, i) => `${getX(i)},${getY(d.critical)}`)
    .join(" ");

  const allAreaPath = `${allPoints} L${getX(data.length - 1)},${
    height - paddingY
  } L${getX(0)},${height - paddingY} Z`;

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
      className="p-5 sm:p-6 rounded-2xl border border-border bg-card shadow-sh-sm flex flex-col justify-between h-full space-y-4 w-full hover:border-border/80 hover:shadow-sh-md transition-shadow cursor-default"
    >
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
        <div>
          <h3 className="text-[17px] font-heading font-extrabold text-foreground">
            Alert Volume Per Hour
          </h3>
          <p className="text-[12px] text-muted-foreground mt-0.5">
            Continuous threat telemetry across all network endpoints
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[12px] font-medium text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-ink dark:bg-brand-paper" />
            <span>All alerts</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-status-error-500" />
            <span>Critical</span>
          </div>
        </div>
      </div>

      {/* SVG Chart Container: fills the remaining vertical height */}
      <div className="w-full flex-1 flex flex-col justify-center min-h-62.5 overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height + 25}`}
          className="w-full h-full select-none overflow-visible"
        >
          {/* Gradients and Filters for Premium Visuals */}
          <defs>
            <filter
              id="chart-tooltip-shadow"
              x="-20%"
              y="-20%"
              width="140%"
              height="140%"
            >
              <feDropShadow
                dx="0"
                dy="6"
                stdDeviation="8"
                floodColor="#000000"
                floodOpacity="0.45"
              />
            </filter>
            <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor="var(--accent, #c9ada7)"
                stopOpacity="0.28"
              />
              <stop
                offset="100%"
                stopColor="var(--accent, #c9ada7)"
                stopOpacity="0.02"
              />
            </linearGradient>
          </defs>

          {/* Horizontal Gridlines & Y-axis labels with readable font size */}
          {[0, 10, 20, 30, 40].map((val) => {
            const y = getY(val);
            return (
              <g key={val}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="currentColor"
                  strokeOpacity="0.12"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 12}
                  y={y + 4.5}
                  textAnchor="end"
                  fontSize="13"
                  className="font-mono font-medium fill-muted-foreground"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* All Alerts Shaded Area (Fade in with intro animation) */}
          <polygon
            points={allAreaPath}
            fill="url(#area-gradient)"
            style={{
              opacity: isAnimated ? 1 : 0,
              transition: "opacity 1.2s ease-out 0.4s",
            }}
          />

          {/* All Alerts Polyline (Self-drawing intro animation) */}
          <polyline
            points={allPoints}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength="100"
            strokeDasharray="100"
            strokeDashoffset={isAnimated ? "0" : "100"}
            style={{
              transition:
                "stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            className="text-brand-ink dark:text-brand-paper"
          />

          {/* Critical Alerts Polyline (Self-drawing intro animation) */}
          <polyline
            points={criticalPoints}
            fill="none"
            stroke="#ff6a4d"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength="100"
            strokeDasharray="100"
            strokeDashoffset={isAnimated ? "0" : "100"}
            style={{
              transition:
                "stroke-dashoffset 1.4s cubic-bezier(0.16, 1, 0.3, 1) 0.15s",
            }}
          />

          {/* Hover Column Highlights and Vertical Guides */}
          {hoveredIndex !== null && (() => {
            const hx = getX(hoveredIndex);
            return (
              <g className="pointer-events-none">
                {/* Subtle luminous column illumination */}
                <rect
                  x={hx - colWidth / 2}
                  y={paddingY}
                  width={colWidth}
                  height={chartH}
                  fill="currentColor"
                  className="text-accent/8 dark:text-accent/10"
                />
                {/* Glowing vertical guideline */}
                <line
                  x1={hx}
                  y1={paddingY - 6}
                  x2={hx}
                  y2={height - paddingY + 6}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                  className="text-accent/70 dark:text-accent/60"
                />
              </g>
            );
          })()}

          {/* Dots and interactive hover triggers */}
          {data.map((d, i) => {
            const x = getX(i);
            const yAll = getY(d.all);
            const yCrit = getY(d.critical);
            const isHovered = hoveredIndex === i;
            const dotDelay = 0.2 + (i / data.length) * 0.8;

            return (
              <g key={i}>
                {/* Dot for All alerts */}
                {isHovered && (
                  <motion.circle
                    initial={{ r: 4, opacity: 0 }}
                    animate={{ r: [6, 12, 9], opacity: [0.6, 0.15, 0.35] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.8,
                      ease: "easeInOut",
                    }}
                    cx={x}
                    cy={yAll}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-brand-ink dark:text-brand-paper pointer-events-none"
                  />
                )}
                <circle
                  cx={x}
                  cy={yAll}
                  r={isHovered ? 5.5 : 3.5}
                  fill="currentColor"
                  stroke="var(--card)"
                  strokeWidth={isHovered ? 2.5 : 1.5}
                  style={{
                    opacity: isAnimated ? 1 : 0,
                    transform: isAnimated ? "scale(1)" : "scale(0)",
                    transformOrigin: `${x}px ${yAll}px`,
                    filter: isHovered
                      ? "drop-shadow(0 0 6px rgba(34,34,59,0.6))"
                      : "none",
                    transition: `opacity 0.4s ease-out ${dotDelay}s, transform 0.4s ease-out ${dotDelay}s, r 0.2s ease, stroke-width 0.2s ease`,
                  }}
                  className="text-brand-ink dark:text-brand-paper"
                />

                {/* Dot for Critical */}
                {isHovered && (
                  <motion.circle
                    initial={{ r: 4, opacity: 0 }}
                    animate={{ r: [6, 12, 9], opacity: [0.75, 0.2, 0.4] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.8,
                      ease: "easeInOut",
                      delay: 0.1,
                    }}
                    cx={x}
                    cy={yCrit}
                    fill="none"
                    stroke="#ff6a4d"
                    strokeWidth="2"
                    className="pointer-events-none"
                  />
                )}
                <circle
                  cx={x}
                  cy={yCrit}
                  r={isHovered ? 5.5 : 3.5}
                  fill="#ff6a4d"
                  stroke="var(--card)"
                  strokeWidth={isHovered ? 2.5 : 1.5}
                  style={{
                    opacity: isAnimated ? 1 : 0,
                    transform: isAnimated ? "scale(1)" : "scale(0)",
                    transformOrigin: `${x}px ${yCrit}px`,
                    filter: isHovered
                      ? "drop-shadow(0 0 8px rgba(255,106,77,0.8))"
                      : "none",
                    transition: `opacity 0.4s ease-out ${dotDelay + 0.1}s, transform 0.4s ease-out ${dotDelay + 0.1}s, r 0.2s ease, stroke-width 0.2s ease`,
                  }}
                />

                {/* Seamless Column Hover Hitbox (No dead zones) */}
                <rect
                  x={x - colWidth / 2}
                  y={paddingY}
                  width={colWidth}
                  height={chartH}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
              </g>
            );
          })}

          {/* Elevated Floating Tooltip with AnimatePresence */}
          <AnimatePresence>
            {hoveredIndex !== null && (() => {
              const d = data[hoveredIndex];
              const x = getX(hoveredIndex);
              const yAll = getY(d.all);
              const yCrit = getY(d.critical);
              const tooltipW = 148;
              const tooltipH = 56;
              const tooltipX = Math.min(
                Math.max(x - tooltipW / 2, paddingX - 10),
                width - paddingX - tooltipW + 10
              );
              const tooltipY = Math.max(
                Math.min(yAll, yCrit) - tooltipH - 14,
                8
              );

              return (
                <motion.g
                  key={`tooltip-${hoveredIndex}`}
                  initial={{ opacity: 0, y: 5, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 3, scale: 0.94 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="pointer-events-none select-none"
                >
                  {/* Tooltip Background Card */}
                  <rect
                    x={tooltipX}
                    y={tooltipY}
                    width={tooltipW}
                    height={tooltipH}
                    rx="10"
                    fill="#22223b"
                    stroke="rgba(201, 173, 167, 0.4)"
                    strokeWidth="1.2"
                    filter="url(#chart-tooltip-shadow)"
                  />

                  {/* Header: Time label */}
                  <text
                    x={tooltipX + tooltipW / 2}
                    y={tooltipY + 18}
                    textAnchor="middle"
                    fontSize="11"
                    fill="#c9ada7"
                    className="font-mono font-semibold tracking-wider"
                  >
                    {d.time.toUpperCase()}
                  </text>

                  {/* Metrics Row: All & Critical */}
                  <g transform={`translate(${tooltipX + 16}, ${tooltipY + 38})`}>
                    {/* All alerts dot & count */}
                    <circle cx="0" cy="-3.5" r="3.5" fill="#f2e9e4" />
                    <text
                      x="9"
                      y="0"
                      fontSize="12"
                      fill="#f2e9e4"
                      className="font-mono font-bold"
                    >
                      All: {d.all}
                    </text>

                    {/* Divider */}
                    <text
                      x="56"
                      y="0"
                      fontSize="12"
                      fill="#9a8c98"
                      opacity="0.5"
                    >
                      |
                    </text>

                    {/* Critical dot & count */}
                    <circle cx="68" cy="-3.5" r="3.5" fill="#ff6a4d" />
                    <text
                      x="77"
                      y="0"
                      fontSize="12"
                      fill="#ff6a4d"
                      className="font-mono font-bold"
                    >
                      Crit: {d.critical}
                    </text>
                  </g>
                </motion.g>
              );
            })()}
          </AnimatePresence>

          {/* X-axis Labels with legible font size */}
          {["11h ago", "9h ago", "7h ago", "5h ago", "3h ago", "1h ago", "Now"].map((label, idx) => {
            const indices = [0, 2, 4, 6, 8, 10, 11];
            const x = getX(indices[idx]);
            return (
              <text
                key={label}
                x={x}
                y={height + 14}
                textAnchor="middle"
                fontSize="13"
                className="font-mono font-medium fill-muted-foreground"
              >
                {label}
              </text>
            );
          })}
        </svg>
      </div>
    </motion.div>
  );
}
