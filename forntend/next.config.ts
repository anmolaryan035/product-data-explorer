import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.worldofbooks.com", // Allow all subdomains
      },
      {
        protocol: "https",
        hostname: "**.wob.com", // Often used for their image CDN
      },
    ],
  },
};

export default nextConfig;