const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  webpack: (config) => {
    config.resolve.fullySpecified = false; // Fix Tailwind
    return config;
  },
}





