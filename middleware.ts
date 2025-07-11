import NextAuth from 'next-auth';

import { authConfig } from '@/app/(auth)/auth.config';

export const config = {
<<<<<<< HEAD
	matcher: ['/api/:path*', '/admin/:path*', '/login']
=======
	matcher: ['/api/:path*', '/dashboard/:path*', '/login']
>>>>>>> f2962736316efd5726c61050eac23356daea6ebd
};

export default NextAuth(authConfig).auth;
