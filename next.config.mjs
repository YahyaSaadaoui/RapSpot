/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "eqhntdpwtnhqzcnpxegh.supabase.co",
        port: "",
      },
    ],
  },
};

export default nextConfig;
