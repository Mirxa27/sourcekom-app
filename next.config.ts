import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  webpack: (config, { dev, isServer }) => {
    if (dev && isServer) {
      config.watchOptions = {
        ignored: ['**/*'],
      };
    }
    // Ensure proper path resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, './src'),
    };
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Enable image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Skip static generation for error pages
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
  // Output configuration for Vercel (only in production)
  ...(process.env.NODE_ENV === 'production' && { output: 'standalone' }),
  // Security headers (for Next.js dev server)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
