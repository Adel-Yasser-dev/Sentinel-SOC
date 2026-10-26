"use client";

import React from "react";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { KpiMetricCard } from "@/components/dashboard/kpi-metric-card";
import { AlertVolumeChart } from "@/components/dashboard/alert-volume-chart";
import { SeverityMixChart } from "@/components/dashboard/severity-mix-chart";
import { TacticsBreakdown } from "@/components/dashboard/tactics-breakdown";
import { RulesBreakdown } from "@/components/dashboard/rules-breakdown";
import { CountryBreakdown } from "@/components/dashboard/country-breakdown";
import { LatestAlertsTable } from "@/components/dashboard/latest-alerts-table";
import { Bell, AlertOctagon, FolderOpen, Clock } from "lucide-react";

export default function DashboardPage() {
  return (
    <DashboardShell title="Dashboard">
      <div className="space-y-8">
        {/* Page Title & Subtitle Banner */}
        <div className="space-y-1">
          <h1 className="text-[28px] sm:text-[32px] font-heading font-extrabold text-brand-ink dark:text-brand-paper tracking-[-0.02em]">
            Security Dashboard
          </h1>
          <p className="text-[14px] text-muted-foreground">
            Last 12 hours across 6 monitored hosts. Simulated data.
          </p>
        </div>

        {/* 1. Top KPI Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          <KpiMetricCard
            title="Total alerts"
            count="361"
            icon={Bell}
            trendPercentage={41}
            trendDirection="higher"
            periodLabel="vs previous 6 hours"
            isNegative={true}
            delayIndex={0}
          />
          <KpiMetricCard
            title="Critical alerts"
            count="59"
            icon={AlertOctagon}
            trendPercentage={41}
            trendDirection="higher"
            periodLabel="vs previous 6 hours"
            isNegative={true}
            delayIndex={1}
          />
          <KpiMetricCard
            title="Open incidents"
            count="23"
            icon={FolderOpen}
            trendPercentage={9}
            trendDirection="higher"
            periodLabel="vs previous 6 hours"
            isNegative={true}
            delayIndex={2}
          />
          <KpiMetricCard
            title="Mean time to resolve"
            count="2.4h"
            icon={Clock}
            trendPercentage={8}
            trendDirection="lower"
            periodLabel="vs previous 6 hours"
            isNegative={false}
            delayIndex={3}
          />
        </div>

        {/* 2. Charts Row: Alert Volume (2/3) + Severity Mix (1/3) */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-stretch">
          <div className="xl:col-span-2 flex flex-col">
            <AlertVolumeChart />
          </div>
          <div className="xl:col-span-1 flex flex-col">
            <SeverityMixChart />
          </div>
        </div>

        {/* 3. Breakdown Columns (3 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <TacticsBreakdown />
          <RulesBreakdown />
          <CountryBreakdown />
        </div>

        {/* 4. Latest Alerts Table */}
        <LatestAlertsTable />
      </div>
    </DashboardShell>
  );
}
