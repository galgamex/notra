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
	}
};

export default nextConfig;
