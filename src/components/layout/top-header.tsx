"use client";

import React, { useSyncExternalStore } from "react";
import Image from "next/image";
import { Sun, Moon, Menu } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { NotificationDropdown } from "./notification-dropdown";

interface TopHeaderProps {
  title: string;
  onOpenMobileMenu?: () => void;
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

export function TopHeader({ title, onOpenMobileMenu }: TopHeaderProps) {
  const { user } = useAuth();
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

  return (
    <header className="h-16 px-6 sm:px-8 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between gap-4">
      {/* Left: Mobile Menu Trigger (mobile only) + Breadcrumb Title */}
      <div className="flex items-center gap-3">
        {onOpenMobileMenu && (
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="md:hidden p-1.5 rounded-sm border border-border text-foreground hover:bg-muted transition-colors flex items-center justify-center shadow-sh-sm"
            title="Open menu"
            aria-label="Open menu"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}
        <div className="text-[14px] font-semibold text-muted-foreground">
          {title}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Notification Bell Dropdown */}
        <NotificationDropdown />

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* User Avatar */}
        <Image
          src={
            user?.avatar ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
          }
          alt={user?.name || "User"}
          width={32}
          height={32}
          unoptimized
          className="w-8 h-8 rounded-full object-cover border border-border shrink-0"
        />

        {/* Brand Badge */}
        <div className="hidden sm:flex items-center gap-1 pl-2 border-l border-border/80">
          <span className="font-heading font-extrabold text-[15px] tracking-tight text-brand-ink dark:text-brand-paper">
            Sentinel
          </span>
          <span className="font-heading font-extrabold text-[15px] tracking-tight text-brand-mauve">
            SOC
          </span>
        </div>
      </div>
    </header>
  );
}
