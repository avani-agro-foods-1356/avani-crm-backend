import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
  allowedDevOrigins: ['generally-joy-horse-strand.trycloudflare.com', 'avani-crm-live.loca.lt']
} as any;

export default nextConfig;
