/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Force webpack (ignore Turbopack)
    return config;
  },
  experimental: {
    forceWebpack: true
  }
}

module.exports = nextConfig

