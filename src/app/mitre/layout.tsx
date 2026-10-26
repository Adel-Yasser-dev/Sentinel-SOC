import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MITRE ATT&CK Matrix",
  description:
    "Adversary kill-chain projection and tactical alignment across 14 enterprise phases with deep technique breakdown and forensic tracing.",
};

export default function MitreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
