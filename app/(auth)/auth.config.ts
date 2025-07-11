import { NextAuthConfig } from 'next-auth';

export const authConfig = {
	secret: process.env.AUTH_SECRET,
	pages: {
		signIn: '/login'
	},
	providers: [
		// added later in auth.ts since it requires bcrypt which is only compatible with Node.js
		// while this file is also used in non-Node.js environments
	],
	callbacks: {
		authorized({ auth, request: { nextUrl } }) {
			const isLoggedIn = !!auth?.user;
			const isOnAdmin = nextUrl.pathname.startsWith('/admin');
			const isOnLogin = nextUrl.pathname.startsWith('/login');

			if (isOnAdmin && !isLoggedIn) {
				return false; // Redirect unauthenticated users to login page
			}

			if (isOnLogin && isLoggedIn) {
				return Response.redirect(new URL('/admin', nextUrl));
			}

			return true;
		}
	}
} satisfies NextAuthConfig;
