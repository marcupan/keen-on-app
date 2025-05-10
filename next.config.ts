import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	reactStrictMode: true,
	env: {
		NEXT_PUBLIC_API_URL:
			process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
	},
	async redirects() {
		return [
			{
				source: '/',
				destination: '/dashboard',
				permanent: true,
			},
		];
	},
};

export default nextConfig;
