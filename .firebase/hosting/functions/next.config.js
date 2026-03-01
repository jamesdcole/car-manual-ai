// next.config.js
var nextConfig = {
  output: "export",
  // ← CRITICAL: Static HTML export
  trailingSlash: true,
  // ← Firebase friendly URLs
  images: { unoptimized: true }
  // ← No Image Optimization (static)
};
module.exports = nextConfig;
