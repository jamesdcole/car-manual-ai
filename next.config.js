/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  // Disable API routes (we use Firebase Functions)
  experimental: {
    serverComponentsExternalPackages: []
  }
}

module.exports = nextConfig

