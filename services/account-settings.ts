import { genSaltSync, hashSync } from 'bcrypt-ts';

import { signIn } from '@/app/(auth)/auth';
import { getTranslations } from '@/i18n';
import { logger } from '@/lib/logger';
import prisma from '@/lib/prisma';
import { ServiceResult } from '@/lib/service-result';

export default class AccountSettingsService {
	static async getAccount() {
		try {
			const account = await prisma.accountSettingsEntity.findUnique({
				where: { id: 'default' }
			});

			return ServiceResult.success(account);
		} catch (error) {
			logger('AccountSettingsService.getAccount', error);
			const t = getTranslations('services_account_settings');

			return ServiceResult.fail(t('get_account_error'));
		}
	}

	static async createAccount(username: string, password: string) {
		const salt = genSaltSync(10);
		const hashedPassword = hashSync(password, salt);

		try {
			const account = await prisma.accountSettingsEntity.create({
				data: { id: 'default', username, password: hashedPassword }
			});

			return ServiceResult.success(account);
		} catch (error) {
			logger('AccountSettingsService.createAccount', error);
			const t = getTranslations('services_account_settings');

			return ServiceResult.fail(t('create_account_error'));
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
			logger('AccountSettingsService.login', error);
			const t = getTranslations('services_account_settings');

			return ServiceResult.fail(t('login_error'));
		}
	}
}
