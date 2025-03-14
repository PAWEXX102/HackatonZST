import { PHASE_PRODUCTION_BUILD } from "next/constants.js";

/** @type {(phase: string) => Promise<import('next').NextConfig>} */
const config = async (phase) => {
  const nextConfig = {
    devIndicators: false,
    reactStrictMode: true,
    images: {
      domains: ["lh3.googleusercontent.com"],
      unoptimized: true,
    },
    compiler: {
      removeConsole: process.env.NODE_ENV === "production",
    },
  };

  if (phase === PHASE_PRODUCTION_BUILD) {
    // Używaj Serwist tylko w produkcji, nie w trybie dev
    const withSerwist = (await import("@serwist/next")).default({
      swSrc: "public/service-worker/app-worker.ts",
      swDest: "public/sw.js",
      reloadOnOnline: true,
    });
    return withSerwist(nextConfig);
  }

  return nextConfig;
};

export default config;
