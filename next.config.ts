import type { NextConfig } from "next";

const SUPABASE_HOST =
  process.env.SUPABASE_URL?.replace(/^https?:\/\//, "").replace(/\/$/, "") ||
  "ntgtvtzbjwotuwkiflar.supabase.co";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: SUPABASE_HOST, pathname: "/storage/v1/object/public/**" },
    ],
  },
};

export default nextConfig;
