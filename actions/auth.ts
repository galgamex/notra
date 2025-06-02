'use server';

import AccountSettingsService from '@/services/account-settings.service';
import { LoginFormValues } from '@/types/auth';

export const login = async (values: LoginFormValues) => {
	const serviceResult = await AccountSettingsService.login(
		values.username,
		values.password
	);

	return serviceResult.toPlainObject();
};
