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
      
      // Turso client için external dependencies
      config.externals = config.externals || [];
      if (typeof config.externals === 'function') {
        const originalExternals = config.externals;
        config.externals = [
          originalExternals,
          ({ request }, callback) => {
            if (request && (
              request.includes('@libsql/isomorphic-ws') ||
              request.includes('@libsql/client/web')
            )) {
              return callback(null, `commonjs ${request}`);
            }
            callback();
          }
        ];
      } else if (Array.isArray(config.externals)) {
        config.externals.push('@libsql/isomorphic-ws');
        config.externals.push('@libsql/client/web');
      }
    }
    return config;
  },
};

export default nextConfig;

