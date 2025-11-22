import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    SECRET: process.env.SECRET || "hoard_secret",
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },

  i18n: {
    locales: ["ja", "en"],
    defaultLocale: "ja",
  },
};

export default nextConfig;
