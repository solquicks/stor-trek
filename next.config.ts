import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow images from any https source for marketplace/NFT thumbnails
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Turbopack compatibility (Next.js 16 default)
  turbopack: {},
};

export default nextConfig;
