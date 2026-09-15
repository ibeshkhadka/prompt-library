import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  typedRoutes: true,
  output: "export",
  basePath: "/prompt-library",
  trailingSlash: true,
  images: { unoptimized: true },
};
export default nextConfig;
