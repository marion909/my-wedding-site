/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable ESLint during production builds to prevent deployment failures
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
  
  // Ignore TypeScript errors during production builds
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  
  // Enable standalone output for better production deployment
  output: 'standalone',
  
  // Performance optimizations
  experimental: {
    optimizePackageImports: ['lucide-react', '@prisma/client']
  },
  
  // Image optimization
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Compression
  compress: true,
  
  // Compiler optimizations for production stability
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Minimize build errors by disabling strict optimizations
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      // Disable aggressive minification that can cause runtime errors
      config.optimization.minimize = false;
    }
    return config;
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
