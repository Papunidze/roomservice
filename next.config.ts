import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const API_ORIGIN = process.env.API_ORIGIN ?? "http://localhost:4000";

const nextConfig: NextConfig = {
  allowedDevOrigins: process.env.LAN_HOST ? [process.env.LAN_HOST] : [],
  turbopack: {
    root: dirname(fileURLToPath(import.meta.url)),
  },
  rewrites: async () => [
    { source: "/api/:path*", destination: `${API_ORIGIN}/api/:path*` },
  ],
};

export default nextConfig;
