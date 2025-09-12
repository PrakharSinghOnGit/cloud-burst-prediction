import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://34.131.144.192:8000/:path*", // Your backend
      },
    ];
  },
  images: {
    domains: ["tailark.com", "avatars.githubusercontent.com"],
  },
};

export default nextConfig;
