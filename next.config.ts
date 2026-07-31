import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["mysql2", "nodemailer"],
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: ["192.168.1.94"],
};

export default nextConfig;
