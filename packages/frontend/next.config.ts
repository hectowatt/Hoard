import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    SECRET: process.env.SECRET || "hoard_secret",
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
        ],
      },
    ];
  },
};
export default nextConfig;
