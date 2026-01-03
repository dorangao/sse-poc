import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  compress: false, // Disable compression for SSE support
  reactStrictMode: true,
};

export default nextConfig;
