/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
        pathname: '/**',
      },
    ],
    unoptimized: false,
  },
  // Cloudflare Pages için optimize edilmiş ayarlar
  output: undefined, // OpenNext otomatik halleder
  trailingSlash: false,
  webpack: (config, { isServer }) => {
    // Cloudflare Pages için crypto modülü fallback
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: false,
      };
    }
    return config;
  },
};

export default nextConfig;

