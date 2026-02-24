/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['tesseract.js', 'sharp', 'pdf-parse', 'pdf2json']
  }
}

module.exports = nextConfig



