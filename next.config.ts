import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: '**.supabase.co'
      },
      {
        hostname: 'imgss.acgn.org'
      },
      {
        protocol: 'https',
        hostname: '**'
      }
    ]
  },
  // 添加域名相关配置
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      }
    ];
  }
};

export default nextConfig;