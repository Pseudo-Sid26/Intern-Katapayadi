import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/puzzles',
        destination: '/self-quizzing/1',
        permanent: true,
      },
      {
        source: '/puzzles/1',
        destination: '/self-quizzing/1',
        permanent: true,
      },
       {
        source: '/dynasties',
        destination: '/leaderboard',
        permanent: true,
      },
      {
        source: '/artifacts',
        destination: '/encoding-charts',
        permanent: true,
      },
      {
        source: '/scan',
        destination: '/multiplayer',
        permanent: true,
      }
    ]
  },
};

export default nextConfig;
