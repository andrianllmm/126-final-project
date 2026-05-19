/** @type {import('next').NextConfig} */
import createMDX from '@next/mdx';

const nextConfig = {
  allowedDevOrigins: ['http://localhost:3000'],
  output: 'standalone',
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
