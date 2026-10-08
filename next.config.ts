import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@sparticuz/chromium"],

  outputFileTracingIncludes: {
    "/api/send-warranty-email": [
      "./node_modules/@sparticuz/chromium/**/*",
    ],
    "/api/cron/warranty-emails": [
      "./node_modules/@sparticuz/chromium/**/*",
    ],
  },
};

export default nextConfig;