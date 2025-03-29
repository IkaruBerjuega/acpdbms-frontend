import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "localhost",
      "127.0.0.1",
      "media.istockphoto.com",
      "apcdbms-public-storage.s3.ap-southeast-2.amazonaws.com",
    ],
  },
};

export default nextConfig;
