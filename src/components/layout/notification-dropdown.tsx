"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  Check,
  CheckCheck,
  AlertCircle,
  AlertTriangle,
  Info,
  ShieldCheck,
  Trash2,
  ExternalLink,
} from "lucide-react";

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  severity: "Critical" | "High" | "Medium" | "Low" | "Info";
  read: boolean;
  host?: string;
}

const initialNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Potential Ransomware Activity",
    description: "Mass file rename pattern detected on Host-DB-02",
    time: "2m ago",
    severity: "Critical",
    read: false,
    host: "Host-DB-02",
  },
  {
    id: "notif-2",
    title: "SSH Brute Force Blocked",
    description: "Over 120 failed attempts from IP 185.220.101.5",
    time: "14m ago",
    severity: "High",
    read: false,
    host: "VPN-GW",
  },
  {
    id: "notif-3",
    title: "Privilege Escalation Rule",
    description: "cmd.exe spawned by spoolsv.exe via PrintNightmare",
    time: "45m ago",
    severity: "High",
    read: false,
    host: "DC-Primary",
  },
  {
    id: "notif-4",
    title: "Rare Outbound Beacon",
    description: "Encrypted traffic to unregistered domain on port 8443",
    time: "2h ago",
    severity: "Medium",
    read: true,
    host: "WKS-DEV-09",
  },
  {
    id: "notif-5",
    title: "Daily MITRE ATT&CK Matrix Report",
    description: "Consolidated detection coverage updated for 24h",
    time: "5h ago",
    severity: "Info",
    read: true,
  },
];

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(initialNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    return true;
  });

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleReadStatus = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)),
    );
  };

  const removeNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getSeverityBadge = (severity: NotificationItem["severity"]) => {
    switch (severity) {
      case "Critical":
        return {
          icon: AlertCircle,
          color: "text-status-error-500",
          bg: "bg-status-error-500/15 border-status-error-500/30",
        };
      case "High":
        return {
          icon: AlertTriangle,
          color: "text-status-warning-700",
          bg: "bg-status-warning-500/15 border-status-warning-500/30",
        };
      case "Medium":
        return {
          icon: AlertTriangle,
          color: "text-brand-plum dark:text-brand-rose",
          bg: "bg-muted border-border",
        };
      case "Low":
        return {
          icon: ShieldCheck,
          color: "text-status-success-500",
          bg: "bg-status-success-500/15 border-status-success-500/30",
        };
      case "Info":
      default:
        return {
          icon: Info,
          color: "text-status-info-500",
          bg: "bg-status-info-500/15 border-status-info-500/30",
        };
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative p-2 rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
        title="Notifications"
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-error-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-status-error-500" />
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-sh-lg z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header */}
          <div className="p-4 border-b border-border/70 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-extrabold text-[15px] text-foreground">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-status-error-500/15 text-status-error-500 border border-status-error-500/30">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-[12px] font-semibold text-brand-plum dark:text-brand-rose hover:underline flex items-center gap-1 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="px-4 pt-2.5 pb-2 flex items-center gap-2 border-b border-border/40 text-[12px] font-medium bg-muted/20">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-2.5 py-1 rounded-sm transition-colors ${
                filter === "all"
                  ? "bg-foreground text-background font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setFilter("unread")}
              className={`px-2.5 py-1 rounded-sm transition-colors ${
                filter === "unread"
                  ? "bg-foreground text-background font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Notifications Scrollable List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-border/40">
            {filteredNotifications.length === 0 ? (
              <div className="py-10 text-center text-muted-foreground text-[13px] space-y-1">
                <Check className="w-8 h-8 mx-auto text-status-success-500/60" />
                <p className="font-medium text-foreground">
                  You&apos;re all caught up
                </p>
                <p className="text-[12px]">No notifications to display</p>
              </div>
            ) : (
              filteredNotifications.map((notif) => {
                const badge = getSeverityBadge(notif.severity);
                const IconComponent = badge.icon;

                return (
                  <div
                    key={notif.id}
                    onClick={() => toggleReadStatus(notif.id)}
                    className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer group hover:bg-muted/40 relative ${
                      !notif.read ? "bg-muted/25" : ""
                    }`}
                  >
                    {/* Severity Icon */}
                    <div
                      className={`p-1.5 rounded-md border shrink-0 mt-0.5 ${badge.bg}`}
                    >
                      <IconComponent className={`w-3.5 h-3.5 ${badge.color}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-[13px] font-semibold truncate ${
                            !notif.read
                              ? "text-foreground font-bold"
                              : "text-foreground/90"
                          }`}
                        >
                          {notif.title}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-mono shrink-0">
                          {notif.time}
                        </span>
                      </div>

                      <p className="text-[12px] text-muted-foreground line-clamp-2 leading-relaxed">
                        {notif.description}
                      </p>

                      <div className="flex items-center gap-2 pt-1 text-[11px]">
                        {notif.host && (
                          <span className="px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono border border-border/50">
                            {notif.host}
                          </span>
                        )}
                        <span
                          className={`font-semibold capitalize ${badge.color}`}
                        >
                          {notif.severity}
                        </span>
                      </div>
                    </div>

                    {/* Actions on hover */}
                    <div className="shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => removeNotification(notif.id, e)}
                        className="p-1 rounded text-muted-foreground hover:text-status-error-500 hover:bg-status-error-500/10 transition-colors"
                        title="Dismiss"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Unread indicator dot */}
                    {!notif.read && (
                      <span className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-status-error-500" />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Action */}
          <div className="p-3 border-t border-border/70 bg-muted/15 flex items-center justify-between text-[12px]">
            <span className="text-muted-foreground font-medium">
              Real-time alert stream
            </span>
            <Link
              href="/alerts"
              onClick={() => setIsOpen(false)}
              className="font-semibold text-brand-ink dark:text-brand-paper hover:underline flex items-center gap-1 transition-colors"
            >
              <span>View all alerts</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
