/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  output: 'standalone',
  assetPrefix: process.env.NODE_ENV === 'production' ? '.' : '',
};

module.exports = nextConfig; 