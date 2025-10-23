/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  // Disable all the complex features
  reactStrictMode: false,
  swcMinify: false, // Disable minification to avoid Supabase errors
  compress: true,
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  // Handle external packages
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    // Ensure astronomy-engine is properly resolved
    config.resolve.alias = {
      ...config.resolve.alias,
      'astronomy-engine': require.resolve('astronomy-engine'),
    };
    return config;
  },
};

module.exports = nextConfig;