import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bai-remit-frontend-production.up.railway.app',
      },
    ],
  },
};

export default nextConfig;
