import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { AuthProvider } from "@/lib/auth-context";

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f2e9e4" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1d2e" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://sentinelsoc.io"),
  title: {
    default: "SentinelSOC | Autonomous Threat Intelligence & Incident Response",
    template: "%s | SentinelSOC",
  },
  description:
    "Enterprise Security Operations Center platform featuring autonomous AI alert triage, continuous MITRE ATT&CK mapping, and sub-second incident containment. Graduation Project v0.1.",
  keywords: [
    "SentinelSOC",
    "SOC Dashboard",
    "Security Operations Center",
    "Autonomous AI Triage",
    "Cybersecurity",
    "Threat Intelligence",
    "MITRE ATT&CK",
    "Incident Response",
    "Security Telemetry",
    "Graduation Project",
  ],
  authors: [{ name: "SentinelSOC Engineering Team" }],
  creator: "SentinelSOC Team",
  publisher: "SentinelSOC Security",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sentinelsoc.io",
    siteName: "SentinelSOC",
    title: "SentinelSOC | Autonomous Threat Intelligence & Incident Response",
    description:
      "Enterprise AI-augmented SOC platform for autonomous incident triage, real-time telemetry analysis, and automated threat containment.",
    images: [
      {
        url: "/favicon.svg",
        width: 1200,
        height: 630,
        alt: "SentinelSOC Security Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SentinelSOC | Autonomous Threat Intelligence & SOC Platform",
    description:
      "Autonomous AI triage, continuous MITRE ATT&CK mapping, and automated active containment for modern enterprise SOCs.",
    images: ["/favicon.svg"],
    creator: "@sentinelsoc",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${bricolageGrotesque.variable} ${hankenGrotesk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans antialiased">
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
