"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "./sidebar";
import { TopHeader } from "./top-header";

interface DashboardShellProps {
  title: string;
  children: React.ReactNode;
}

export function DashboardShell({ title, children }: DashboardShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sentinel_sidebar_collapsed");
    if (saved !== null) {
      queueMicrotask(() => setCollapsed(saved === "true"));
    }
  }, []);

  const toggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("sentinel_sidebar_collapsed", String(next));
      return next;
    });
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-background text-foreground flex">
      {/* Fixed Desktop Collapsible Sidebar */}
      <div className="hidden md:block shrink-0 h-full">
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={toggleCollapse}
        />
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-in fade-in duration-200">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-50 h-full">
            <Sidebar
              collapsed={false}
              onCloseMobile={() => setMobileMenuOpen(false)}
              isMobile={true}
            />
          </div>
        </div>
      )}

      {/* Main Workspace Column: Fixed full height, header static, only main content scrolls */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        {/* Fixed Header */}
        <div className="shrink-0">
          <TopHeader
            title={title}
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
          />
        </div>

        {/* Scrollable Center: The ONLY scroll area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <div className="max-w-360 w-full mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
