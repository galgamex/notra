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

				const passwordsMatch = await compare(password as string, user.password);

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
				token.role = (user as { role?: string }).role;
				token.username = (user as { username?: string }).username;
				token.avatar = (user as { avatar?: string }).avatar;
			}

			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id as string;
				const user = session.user as {
					role?: string;
					username?: string;
					avatar?: string;
				};
				user.role = token.role as string;
				user.username = token.username as string;
				user.avatar = token.avatar as string;
			}

			return session;
		}
	}
});
