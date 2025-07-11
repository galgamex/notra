import { genSaltSync, hashSync } from 'bcrypt-ts';
import crypto from 'crypto';

import { signIn } from '@/app/(auth)/auth';
import { getTranslations } from '@/i18n';
import { sendPasswordResetEmail, sendVerificationEmail } from '@/lib/email';
import { logger } from '@/lib/logger';
import prisma from '@/lib/prisma';
import { ServiceResult } from '@/lib/service-result';

export default class UserService {
	static async getUser() {
		try {
			const user = await prisma.user.findFirst();

			return ServiceResult.success(user);
		} catch (error) {
			logger('UserService.getUser', error);
			const t = getTranslations('services_user');

			return ServiceResult.fail(t('get_user_error'));
		}
	}

	static async createUser(username: string, password: string, email?: string) {
		const salt = genSaltSync(10);
		const hashedPassword = hashSync(password, salt);

		try {
			// 检查是否是第一个用户
			const userCount = await prisma.user.count();
			const isFirstUser = userCount === 0;

			// 检查用户名是否已存在
			const existingUser = await prisma.user.findUnique({
				where: { username }
			});

			if (existingUser) {
				const t = getTranslations('services_user');
				return ServiceResult.fail(t('username_exists'));
			}

			// 如果提供了邮箱，检查邮箱是否已存在
			if (email) {
				const existingEmail = await prisma.user.findUnique({
					where: { email }
				});

				if (existingEmail) {
					const t = getTranslations('services_user');
					return ServiceResult.fail(t('email_exists'));
				}
			}

			// 生成邮箱验证令牌
			const verificationToken = email ? crypto.randomBytes(32).toString('hex') : null;

			const user = await prisma.user.create({
				data: { 
					username, 
					password: hashedPassword,
					email,
					role: isFirstUser ? 'ADMIN' : 'USER', // 第一个用户设为管理员
					verificationToken
				}
			});

			// 如果提供了邮箱，发送验证邮件
			if (email && verificationToken) {
				try {
					await sendVerificationEmail(email, verificationToken);
				} catch (emailError) {
					logger('UserService.createUser', `邮件发送失败: ${emailError}`);
					// 不因为邮件发送失败而中断注册流程
				}
			}

			return ServiceResult.success(user);
		} catch (error) {
			logger('UserService.createUser', error);
			const t = getTranslations('services_user');

			return ServiceResult.fail(t('create_user_error'));
		}
	}

	static async login(username: string, password: string) {
		try {
			await signIn('credentials', {
				username,
				password,
				redirect: false
			});

			return ServiceResult.success(null);
		} catch (error) {
			logger('UserService.login', error);
			const t = getTranslations('services_user');

			return ServiceResult.fail(t('login_error'));
		}
	}

	static async sendPasswordResetEmail(email: string) {
		try {
			const user = await prisma.user.findUnique({
				where: { email }
			});

			if (!user) {
				const t = getTranslations('services_user');
				return ServiceResult.fail(t('email_not_found'));
			}

			// 生成重置令牌
			const resetToken = crypto.randomBytes(32).toString('hex');
			const resetTokenExpiry = new Date(Date.now() + 3600000); // 1小时后过期

			// 更新用户的重置令牌
			await prisma.user.update({
				where: { email },
				data: {
					verificationToken: resetToken,
					// 这里应该有一个resetTokenExpiry字段，但当前schema没有，暂时使用verificationToken
				}
			});

			// 发送重置邮件
			await sendPasswordResetEmail(email, resetToken);

			const t = getTranslations('services_user');
			return ServiceResult.success(t('reset_email_sent'));
		} catch (error) {
			logger('UserService.sendPasswordResetEmail', error);
			const t = getTranslations('services_user');

			return ServiceResult.fail(t('reset_email_error'));
		}
	}

	static async verifyEmail(token: string) {
		try {
			const user = await prisma.user.findFirst({
				where: { verificationToken: token }
			});

			if (!user) {
				const t = getTranslations('services_user');
				return ServiceResult.fail(t('invalid_token'));
			}

			await prisma.user.update({
				where: { id: user.id },
				data: {
					emailVerified: new Date(),
					verificationToken: null
				}
			});

			const t = getTranslations('services_user');
			return ServiceResult.success(t('email_verified'));
		} catch (error) {
			logger('UserService.verifyEmail', error);
			const t = getTranslations('services_user');

			return ServiceResult.fail(t('verify_email_error'));
		}
	}
}
