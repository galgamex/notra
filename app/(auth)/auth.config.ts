import { NextAuthConfig } from 'next-auth';

export const authConfig = {
<<<<<<< HEAD
	secret: process.env.AUTH_SECRET,
=======
>>>>>>> f2962736316efd5726c61050eac23356daea6ebd
	pages: {
		signIn: '/login'
	},
	providers: [
		// added later in auth.ts since it requires bcrypt which is only compatible with Node.js
		// while this file is also used in non-Node.js environments
	],
	callbacks: {
		authorized({ auth, request: { nextUrl } }) {
<<<<<<< HEAD
			const isLoggedIn = !!auth?.user;
			const isOnAdmin = nextUrl.pathname.startsWith('/admin');
			const isOnLogin = nextUrl.pathname.startsWith('/login');

			if (isOnAdmin && !isLoggedIn) {
				return false; // Redirect unauthenticated users to login page
			}

			if (isOnLogin && isLoggedIn) {
				return Response.redirect(new URL('/admin', nextUrl));
=======
			const pathname = nextUrl.pathname;

			const isOnDashboard = pathname.startsWith('/dashboard');
			const isOnLogin = pathname.startsWith('/login');
			const isLoggedIn = !!auth?.user;

			if (isOnLogin && isLoggedIn) {
				const callbackUrl = nextUrl.searchParams.get('callbackUrl');

				return Response.redirect(new URL(callbackUrl ?? '/notra', nextUrl));
			}

			if (isOnDashboard && !isLoggedIn) {
				let callbackUrl = pathname;

				if (nextUrl.search) {
					callbackUrl += nextUrl.search;
				}

				const encodedCallbackUrl = encodeURIComponent(callbackUrl);

				return Response.redirect(
					new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
				);
>>>>>>> f2962736316efd5726c61050eac23356daea6ebd
			}

			return true;
		}
	}
} satisfies NextAuthConfig;
