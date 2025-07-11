import { compare } from 'bcrypt-ts';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

<<<<<<< HEAD
import UserService from '@/services/user';
=======
import AccountSettingsService from '@/services/account-settings';
>>>>>>> f2962736316efd5726c61050eac23356daea6ebd

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
<<<<<<< HEAD
				const user = (await UserService.getUser()).data;

				if (!user) {
					const result = await UserService.createUser(
=======
				const account = (await AccountSettingsService.getAccount()).data;

				if (!account) {
					const result = await AccountSettingsService.createAccount(
>>>>>>> f2962736316efd5726c61050eac23356daea6ebd
						username as string,
						password as string
					);

					if (result.success) {
						return result.data;
					}

					return null;
				}

<<<<<<< HEAD
				if (user.username !== username) {
=======
				if (account.username !== username) {
>>>>>>> f2962736316efd5726c61050eac23356daea6ebd
					return null;
				}

				const passwordsMatch = await compare(
					password as string,
<<<<<<< HEAD
					user.password
				);

				if (passwordsMatch) {
					return user;
=======
					account.password
				);

				if (passwordsMatch) {
					return account;
>>>>>>> f2962736316efd5726c61050eac23356daea6ebd
				}

				return null;
			}
		})
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
<<<<<<< HEAD
				token.role = (user as any).role;
				token.username = (user as any).username;
				token.avatar = (user as any).avatar;
=======
>>>>>>> f2962736316efd5726c61050eac23356daea6ebd
			}

			return token;
		},
		async session({ session, token }) {
			if (session.user) {
				session.user.id = token.id as string;
<<<<<<< HEAD
				(session.user as any).role = token.role;
				(session.user as any).username = token.username;
				(session.user as any).avatar = token.avatar;
=======
>>>>>>> f2962736316efd5726c61050eac23356daea6ebd
			}

			return session;
		}
	}
});
