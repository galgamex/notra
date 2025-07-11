import NextAuth from 'next-auth';

import { authConfig } from '@/app/(auth)/auth.config';

export const config = {
	matcher: ['/api/:path*', '/admin/:path*', '/login']
};

export default NextAuth(authConfig).auth;
