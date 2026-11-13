import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The subscription page was retired; send old Google links to the homepage.
      { source: "/subscription", destination: "/", permanent: true },
      { source: "/subscription/:path*", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
