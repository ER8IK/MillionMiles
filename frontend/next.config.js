/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "ci.encar.com" },
      { protocol: "http",  hostname: "ci.encar.com" },
      { protocol: "https", hostname: "**.encar.com" },
    ],
  },
};

module.exports = nextConfig;
