/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,  // Skip ALL TS errors
  },
  eslint: {
    ignoreDuringBuilds: true, // Skip ALL lint errors
  },
}

module.exports = nextConfig;





