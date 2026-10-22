import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for optimised Docker images
  output: "standalone",

  // Allow images from any origin (update with specific domains in production)
  images: {
    remotePatterns: [],
    formats: ["image/avif", "image/webp"],
  },

  // Suppress the "using experimental features" warning for Three.js dynamic imports
  transpilePackages: [],

  // Strict mode for better development warnings
  reactStrictMode: true,
};

export default nextConfig;
