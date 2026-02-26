/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    typescript: {
      ignoreBuildErrors: true,
    },
  },
}

module.exports = nextConfig;






