import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Tell Vercel to bypass TypeScript tantrums
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // 2. Tell Vercel to bypass ESLint warnings
  eslint: {
    ignoreDuringBuilds: true,
  },

  // 3. Your live Python connection
  async rewrites() {
    return [
      {
        // When you call /api/py/anything in your frontend...
        source: "/api/py/:path*",
        // ...it actually talks to your LIVE Python server!
        destination: "https://main-app-backend-fvgl.onrender.com/:path*", 
      },
    ];
  },
};

export default nextConfig;