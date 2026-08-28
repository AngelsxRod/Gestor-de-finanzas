import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const appDirectory = path.dirname(fileURLToPath(import.meta.url));
const apiInternalUrl = process.env.API_INTERNAL_URL ?? "http://127.0.0.1:3211";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(appDirectory, "../.."),
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${apiInternalUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
