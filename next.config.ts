import type { NextConfig } from "next";

const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5086").replace(/\/$/, "");

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    return [
      {
        source: "/api/logs",
        destination: `${backendUrl}/api/logs`,
      },
      {
        source: "/api/logs/:path*",
        destination: `${backendUrl}/api/logs/:path*`,
      },
      {
        source: "/logs",
        destination: `${backendUrl}/logs`,
      },
      {
        source: "/logs/:path*",
        destination: `${backendUrl}/logs/:path*`,
      },
    ];
  },
};

export default nextConfig;
