import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    typescript: {
    // !! WARNING: This will ignore all TypeScript errors during build !!
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
