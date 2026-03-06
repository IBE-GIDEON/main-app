import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // When you call /api/py/anything in your frontend...
        source: "/api/py/:path*",
        // ...it actually talks to your Python server!
        destination: "http://127.0.0.1:8000/:path*",
      },
    ];
  },
};

export default nextConfig;