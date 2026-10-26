"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AuthSplitLayoutProps {
  children: React.ReactNode;
  heroTitle?: string;
  heroSubtitle?: string;
  footerNote?: string;
}

function subscribeTheme(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getThemeSnapshot() {
  if (typeof document === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}

function getServerSnapshot() {
  return false;
}

export function AuthSplitLayout({
  children,
  heroTitle = "Watch every alert in one place.",
  heroSubtitle = "Sign in to triage incidents, follow attack paths, and keep response times low.",
  footerNote = "Prototype screen. No real account or session is created.",
}: AuthSplitLayoutProps) {
  const isDark = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerSnapshot
  );

  const toggleTheme = () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

  const slides = [
    {
      title: heroTitle,
      subtitle: heroSubtitle,
    },
    {
      title: "Autonomous AI triage at machine speed.",
      subtitle:
        "Cross-correlate kernel process trees, cloud audit logs, and egress traffic without alert fatigue.",
    },
    {
      title: "Continuous MITRE ATT&CK projection.",
      subtitle:
        "Pinpoint patient zero and predict adversary kill-chain movement before lateral traversal.",
    },
    {
      title: "Sub-second quarantine and containment.",
      subtitle:
        "Automate firewall policies and isolate compromised workloads before data leaves the perimeter.",
    },
  ];

  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [slides.length]);

  const current = slides[activeSlide];

  return (
    <div className="h-screen max-h-screen w-full flex flex-col md:flex-row bg-background text-foreground overflow-hidden select-none">
      {/* Left Aside: Brand Hero & Decorative Radar (.art from prototype) taking the rest (~2/3) */}
      <aside className="relative flex-1 h-full overflow-hidden bg-card dark:bg-[#1c1d2e] p-8 sm:p-12 lg:p-16 flex flex-col justify-between border-b md:border-b-0 md:border-r border-border shrink-0">
        {/* Brand Logo */}
        <div className="relative z-10 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-1.5">
            <span className="font-heading font-extrabold text-[24px] tracking-tight text-foreground">
              Sentinel
            </span>
            <span className="font-heading font-extrabold text-[24px] tracking-tight text-brand-rose">
              SOC
            </span>
          </Link>

          {/* Theme toggle for mobile */}
          <button
            type="button"
            onClick={toggleTheme}
            className="md:hidden p-2 rounded-sm border border-border bg-card/60 text-foreground"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Hero Message with smooth automated text change */}
        <div className="relative z-10 my-12 md:my-auto space-y-5">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              <h1 className="text-[36px] sm:text-[44px] lg:text-[48px] leading-[1.05] font-heading font-extrabold text-foreground tracking-[-0.02em]">
                {current.title}
              </h1>
              <p className="text-[15px] sm:text-[17px] text-muted-foreground leading-relaxed">
                {current.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Subtle slide indicators */}
          <div className="flex items-center gap-1.5 pt-2">
            {slides.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === activeSlide
                    ? "w-6 bg-brand-rose"
                    : "w-1.5 bg-border/70"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-[12px] text-muted-foreground">
          {footerNote}
        </div>

        {/* Authentic Concentric Radar Graphic from prototype */}
        <div className="rg" aria-hidden="true">
          <i />
          {/* Live tactical threat blips */}
          <span className="absolute top-[32%] right-[22%] w-2.5 h-2.5 rounded-full bg-status-error-500 shadow-[0_0_8px_var(--color-status-error-500)] animate-radar-blip-1" />
          <span className="absolute bottom-[28%] left-[30%] w-2 h-2 rounded-full bg-status-warning-500 shadow-[0_0_8px_var(--color-status-warning-500)] animate-radar-blip-2" />
          <span className="absolute top-[18%] left-[44%] w-2 h-2 rounded-full bg-status-success-500 shadow-[0_0_8px_var(--color-status-success-500)] animate-radar-blip-3" />
        </div>
      </aside>

      {/* Right Main: Contained Form Column (~1/3 on desktop) with Internal Scroller */}
      <main className="w-full md:w-95 lg:w-105 xl:w-115 shrink-0 h-full overflow-y-auto bg-card/60 dark:bg-brand-ink/90 relative flex flex-col justify-between border-l border-border/80">
        {/* Desktop Theme toggle button */}
        <div className="w-full px-8 pt-8 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-sm border border-border bg-card hover:bg-muted text-foreground transition-all shadow-sh-sm cursor-pointer"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Contained form */}
        <div className="w-full max-w-sm mx-auto px-6 sm:px-8 py-6 my-auto">
          {children}
        </div>

        {/* Bottom subtle copyright note */}
        <div className="w-full px-6 py-4 text-center text-[11px] text-muted-foreground/70 shrink-0">
          <span>&copy; 2026 SentinelSOC Security. All rights reserved.</span>
        </div>
      </main>
    </div>
  );
}
