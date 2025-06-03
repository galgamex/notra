import { NextAuthConfig } from 'next-auth';

export const authConfig = {
	pages: {
		signIn: '/login'
	},
	providers: [
		// added later in auth.ts since it requires bcrypt which is only compatible with Node.js
		// while this file is also used in non-Node.js environments
	],
	callbacks: {
		authorized({ auth, request: { nextUrl } }) {
			const pathname = nextUrl.pathname;

			const isOnNotra = pathname.startsWith('/notra');
			const isOnLogin = pathname.startsWith('/login');
			const isLoggedIn = !!auth?.user;

			if (isOnLogin && isLoggedIn) {
				const callbackUrl = nextUrl.searchParams.get('callbackUrl');

				return Response.redirect(new URL(callbackUrl || '/notra', nextUrl));
			}

			if (isOnNotra && !isLoggedIn) {
				let callbackUrl = pathname;

				if (nextUrl.search) {
					callbackUrl += nextUrl.search;
				}

				const encodedCallbackUrl = encodeURIComponent(callbackUrl);

				return Response.redirect(
					new URL(`/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
				);
			}

			return true;
		}
	}
} satisfies NextAuthConfig;
