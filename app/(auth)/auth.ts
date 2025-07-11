import { compare } from 'bcrypt-ts';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import UserService from '@/services/user';

import { authConfig } from './auth.config';

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut
} = NextAuth({
	...authConfig,
	providers: [
		Credentials({
			credentials: {
				username: {},
				password: {}
			},
			async authorize({ username, password }) {
				const user = (await UserService.getUser()).data;

				if (!user) {
					const result = await UserService.createUser(
						username as string,
						password as string
					);

					if (result.success) {
						return result.data;
					}

					return null;
				}

				if (user.username !== username) {
					return null;
				}

				const passwordsMatch = await compare(
					password as string,
					user.password
				);

				if (passwordsMatch) {
					return user;
				}

				return null;
			}
		})
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.role = (user as any).role;
				token.username = (user as any).username;
				token.avatar = (user as any).avatar;
			}

			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id as string;
				(session.user as any).role = token.role;
				(session.user as any).username = token.username;
				(session.user as any).avatar = token.avatar;
			}

			return session;
		}
	}
});
