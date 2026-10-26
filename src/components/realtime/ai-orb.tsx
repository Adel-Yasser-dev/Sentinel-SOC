"use client";

import React from "react";

interface AiOrbProps {
  isThinking?: boolean;
}

/**
 * AiOrb
 * The glowing, multi-ring quantum intelligence orb matching the user's SOC prototype.
 * Spins concentric orbital rings and pulses when AI is inferencing.
 */
export function AiOrb({ isThinking = false }: AiOrbProps) {
  return (
    <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
      {/* Outer Counter-Rotating Ring */}
      <div
        className={`absolute -inset-2.5 rounded-full border-2 border-transparent border-b-brand-rose border-r-brand-mauve/70 transition-opacity duration-500 pointer-events-none ${
          isThinking ? "opacity-75 animate-orb-ring-2" : "opacity-0"
        }`}
      />

      {/* Inner Rotating Ring */}
      <div
        className={`absolute -inset-1.25 rounded-full border-2 border-transparent border-t-brand-rose border-l-brand-mauve transition-opacity duration-500 pointer-events-none ${
          isThinking ? "opacity-100 animate-orb-ring-1" : "opacity-0"
        }`}
      />

      {/* Core Glowing Orb Sphere */}
      <div
        className={`w-13 h-13 rounded-full relative transition-all duration-500 shadow-md ${
          isThinking
            ? "animate-orb-breathe shadow-[0_0_20px_rgba(201,173,167,0.45)]"
            : "filter saturate-75 brightness-90 shadow-none"
        }`}
        style={{
          background:
            "radial-gradient(circle at 35% 30%, #f2e9e4, #c9ada7 45%, #4a4e69)",
        }}
      />
    </div>
  );
}
