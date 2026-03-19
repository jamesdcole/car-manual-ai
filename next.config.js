/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',          // <— key line
  experimental: {
    // your experimental flags
  },
  serverExternalPackages: ['pdf-parse'],
}

module.exports = nextConfig

