"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Bell,
  Activity,
  Sparkles,
  Radar,
  Info,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onCloseMobile?: () => void;
  isMobile?: boolean;
}

export function Sidebar({
  collapsed = false,
  onToggleCollapse,
  onCloseMobile,
  isMobile = false,
}: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard" || pathname === "/",
    },
    {
      name: "Alerts",
      href: "/alerts",
      icon: Bell,
      active: pathname === "/alerts",
    },
    {
      name: "Realtime",
      href: "/realtime",
      icon: Activity,
      active: pathname === "/realtime",
      isAi: true,
    },
    {
      name: "MITER ATTA&CK",
      href: "/mitre",
      icon: Radar,
      active: pathname === "/mitre",
    },
  ];

  return (
    <aside
      className={`h-screen sticky top-0 shrink-0 border-r border-border bg-[#e9ded8]/40 dark:bg-[#1c1d2e] flex flex-col justify-between select-none transition-all duration-300 ease-in-out ${
        collapsed ? "w-18" : "w-57.5"
      }`}
    >
      {/* Top Header / Logo + Arrow in top right */}
      <div>
        <div
          className={`h-16 flex items-center border-b border-border/40 ${
            collapsed ? "justify-center px-2" : "justify-between px-5"
          }`}
        >
          {!collapsed ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 overflow-hidden"
              >
                <span className="font-heading font-extrabold text-[20px] tracking-tight text-brand-ink dark:text-brand-paper whitespace-nowrap">
                  Sentinel
                </span>
                <span className="font-heading font-extrabold text-[20px] tracking-tight text-brand-mauve whitespace-nowrap">
                  SOC
                </span>
              </Link>
              {isMobile ? (
                <button
                  type="button"
                  onClick={onCloseMobile}
                  className="p-1.5 rounded-sm border border-border/50 bg-card/60 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors shadow-sh-sm"
                  title="Close sidebar"
                  aria-label="Close sidebar"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                onToggleCollapse && (
                  <button
                    type="button"
                    onClick={onToggleCollapse}
                    className="p-1.5 rounded-sm border border-border/50 bg-card/60 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors shadow-sh-sm cursor-pointer"
                    title="Collapse sidebar"
                    aria-label="Collapse sidebar"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                )
              )}
            </>
          ) : (
            <div className="flex items-center justify-center w-full">
              {onToggleCollapse && (
                <button
                  type="button"
                  onClick={onToggleCollapse}
                  className="p-1.5 rounded-sm border border-border/50 bg-card/60 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors shadow-sh-sm cursor-pointer"
                  title="Expand sidebar"
                  aria-label="Expand sidebar"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className={`p-3 space-y-1.5 ${collapsed ? "px-2" : "px-3.5"}`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={isMobile ? onCloseMobile : undefined}
                title={collapsed ? item.name : undefined}
                className={`relative flex items-center rounded-[10px] text-[13px] font-semibold transition-all duration-150 ${
                  collapsed ? "justify-center p-2.5" : "gap-3 px-3.5 py-2.5"
                } ${
                  item.active
                    ? "bg-brand-ink text-brand-paper dark:bg-brand-paper dark:text-brand-ink shadow-sh-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />

                {"isAi" in item && item.isAi && collapsed && (
                  <span
                    className="absolute top-1 right-1 w-4 h-4 rounded-full bg-status-error-500 text-white flex items-center justify-center shadow-[0_0_8px_rgba(255,106,77,0.7)] pointer-events-none"
                    title="Autonomous AI Intelligence"
                  >
                    <Sparkles className="w-2.5 h-2.5 fill-white stroke-[2.5]" />
                  </span>
                )}
                {!collapsed && (
                  <span className="flex-1 flex items-center justify-between overflow-hidden">
                    <span className="truncate">{item.name}</span>
                    {"isAi" in item && item.isAi && (
                      <span
                        className="flex items-center justify-center w-6 h-6 rounded-full bg-status-error-500/20 border border-status-error-500/40 text-status-error-500 dark:text-status-error-400 shadow-sm shrink-0 ml-2"
                        title="Autonomous AI Intelligence"
                      >
                        <Sparkles className="w-3.5 h-3.5 fill-status-error-500/30 text-status-error-500 dark:text-status-error-400" />
                      </span>
                    )}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Profile & Sign Out */}
      <div
        className={`border-t border-border/60 ${
          collapsed ? "p-2.5 space-y-2 text-center" : "p-4 space-y-3"
        }`}
      >
        {/* User Card */}
        {!collapsed ? (
          <div className="flex items-center gap-3 p-2 rounded-[10px] bg-card/60 border border-border/50">
            <Image
              src={
                user?.avatar ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              }
              alt={user?.name || "User"}
              width={40}
              height={40}
              unoptimized
              className="w-10 h-10 rounded-full object-cover border border-border shrink-0"
            />
            <div className="overflow-hidden">
              <div className="text-[13px] font-semibold text-foreground truncate">
                {user?.name || "Ahmed Samy"}
              </div>
            </div>
          </div>
        ) : (
          <div
            className="flex justify-center"
            title={user?.name || "Ahmed Samy"}
          >
            <Image
              src={
                user?.avatar ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              }
              alt={user?.name || "User"}
              width={36}
              height={36}
              unoptimized
              className="w-9 h-9 rounded-full object-cover border border-border shrink-0"
            />
          </div>
        )}

        {/* Secondary Links: Help Center & Sign Out */}
        <div
          className={`space-y-0.5 ${
            collapsed ? "flex flex-col items-center" : "text-[12px]"
          }`}
        >
          <button
            type="button"
            title="Help Center"
            className={`rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors ${
              collapsed
                ? "p-2 flex items-center justify-center w-full"
                : "w-full flex items-center justify-between px-3 py-2 text-[12px]"
            }`}
          >
            {!collapsed && <span>Help Center</span>}
            <Info className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={logout}
            title="Sign Out"
            className={`rounded-sm text-status-error-500 hover:bg-status-error-500/10 transition-colors font-medium ${
              collapsed
                ? "p-2 flex items-center justify-center w-full"
                : "w-full flex items-center justify-between px-3 py-2 text-[12px]"
            }`}
          >
            {!collapsed && <span>Sign Out</span>}
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
