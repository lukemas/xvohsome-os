import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Reduces dev-only UI that can interact badly with RSC manifests on some setups. */
  devIndicators: false,
};

export default nextConfig;
