/** @type {import('next').NextConfig} */
import createMDX from '@next/mdx';

const isDev = process.env.NODE_ENV === 'development';

const apiUrl = new URL(process.env.NEXT_PUBLIC_API_URL);

const nextConfig = {
  allowedDevOrigins: ['http://localhost:3000'],
  output: 'standalone',
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

  images: {
    remotePatterns: [
      {
        protocol: apiUrl.protocol.replace(':', ''),
        hostname: apiUrl.hostname,
        port: apiUrl.port || '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],

    ...(isDev
      ? {
          dangerouslyAllowLocalIP: true,
        }
      : {}),
  },
};

const withMDX = createMDX({});
export default withMDX(nextConfig);
