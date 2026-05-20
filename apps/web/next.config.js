/** @type {import('next').NextConfig} */
import createMDX from '@next/mdx';

const isDev = process.env.NODE_ENV === 'development';

const apiUrlString = process.env.NEXT_PUBLIC_API_URL;

const apiUrl = apiUrlString ? new URL(apiUrlString) : null;

const nextConfig = {
  allowedDevOrigins: ['http://localhost:3000'],
  output: 'standalone',
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],

  images: {
    remotePatterns: [
      apiUrl
        ? {
            protocol: apiUrl.protocol.replace(':', ''),
            hostname: apiUrl.hostname,
            port: apiUrl.port || undefined,
            pathname: '/uploads/**',
          }
        : null,
      {
        protocol: 'https',
        hostname: '**',
      },
    ].filter(Boolean),

    ...(isDev
      ? {
          dangerouslyAllowLocalIP: true,
        }
      : {}),
  },
};

const withMDX = createMDX({});
export default withMDX(nextConfig);
