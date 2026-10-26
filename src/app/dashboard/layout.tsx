import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security Dashboard",
  description:
    "Real-time enterprise security telemetry, multi-metric KPIs, 24-hour alert volume scrubbers, and active incident triage overview.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
