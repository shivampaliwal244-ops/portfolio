import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Apna mobile/network IP yahan add kar diya hai taaki phone par white screen na aaye
  allowedDevOrigins: ['127.0.0.1', '192.168.97.89'], 
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
