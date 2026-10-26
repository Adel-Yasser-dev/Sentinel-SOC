"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { AuthSplitLayout } from "@/components/auth/auth-split-layout";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("ahmed.samy@sentinelsoc.io");
  const [password, setPassword] = useState("••••••••••••");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(email, "Ahmed Samy");
    }, 600);
  };

  return (
    <AuthSplitLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h2 className="text-[26px] sm:text-[30px] font-heading font-extrabold text-brand-ink dark:text-brand-paper tracking-[-0.02em]">
            Welcome Back
          </h2>
          <p className="text-[14px] text-muted-foreground">
            Sign in to your security console.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-foreground flex items-center gap-1">
              Email <span className="text-status-error-500">*</span>
            </label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your Name or email"
              className="w-full h-11 px-3.5 rounded-[10px] border border-border bg-background text-foreground text-[14px] focus:outline-none focus:ring-2 focus:ring-ring shadow-sh-sm transition-all"
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-foreground flex items-center gap-1">
              Password <span className="text-status-error-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full h-11 pl-3.5 pr-11 rounded-[10px] border border-border bg-background text-foreground text-[14px] focus:outline-none focus:ring-2 focus:ring-ring shadow-sh-sm transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-[13px] pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-brand-ink focus:ring-brand-ink"
              />
              <span className="text-foreground font-medium">Remember Me</span>
            </label>
            <a
              href="#forgot"
              onClick={(e) => {
                e.preventDefault();
                alert("Password reset link sent to your email!");
              }}
              className="text-brand-plum dark:text-brand-rose hover:underline font-semibold"
            >
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 text-[14px] font-semibold bg-brand-ink text-brand-paper dark:bg-brand-paper dark:text-brand-ink rounded-[10px] hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sh-sm mt-2 disabled:opacity-75"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Sign In</span>
          </button>
        </form>

        {/* Link to Register */}
        <div className="text-center text-[13px] text-muted-foreground pt-1">
          <span>New to Sentinel? </span>
          <Link
            href="/register"
            className="font-semibold text-foreground underline hover:text-primary transition-colors"
          >
            Create an account
          </Link>
        </div>

        {/* Divider: Or Continue With */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/80" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase tracking-wider font-semibold">
            <span className="bg-card dark:bg-card px-3 text-muted-foreground">
              Or Continue With
            </span>
          </div>
        </div>

        {/* Social Auth Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => login("google.user@sentinelsoc.io", "Google Analyst")}
            className="h-10 px-4 rounded-[10px] border border-border bg-card/60 hover:bg-muted text-[13px] font-semibold text-foreground flex items-center justify-center gap-2 transition-all shadow-sh-sm active:scale-95"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => login("github.user@sentinelsoc.io", "GitHub Analyst")}
            className="h-10 px-4 rounded-[10px] border border-border bg-card/60 hover:bg-muted text-[13px] font-semibold text-foreground flex items-center justify-center gap-2 transition-all shadow-sh-sm active:scale-95"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub</span>
          </button>
        </div>
      </div>
    </AuthSplitLayout>
  );
}
