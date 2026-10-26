import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alerts & Investigation Hub",
  description:
    "Comprehensive enterprise incident management. Filter, search, inspect deep host telemetry, and triage security alerts.",
};

export default function AlertsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
