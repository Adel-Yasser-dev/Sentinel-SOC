import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Autonomous AI Intelligence",
  description:
    "Autonomous AI reasoning engine for real-time alert triage, scenario injection, neural threat classification, and sub-second automated containment.",
};

export default function RealtimeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
