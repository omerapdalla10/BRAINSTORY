import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/reports", destination: "/articles", permanent: false },
      { source: "/reports/:slug", destination: "/articles/:slug", permanent: false },
    ];
  },
};

export default nextConfig;
