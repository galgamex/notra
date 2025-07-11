'use server';

<<<<<<< HEAD
import UserService from '@/services/user';
import { LoginFormValues, RegisterFormValues, ForgotPasswordFormValues } from '@/types/auth';

export const login = async (values: LoginFormValues) => {
	const serviceResult = await UserService.login(
=======
import AccountSettingsService from '@/services/account-settings';
import { LoginFormValues } from '@/types/auth';

export const login = async (values: LoginFormValues) => {
	const serviceResult = await AccountSettingsService.login(
>>>>>>> f2962736316efd5726c61050eac23356daea6ebd
		values.username,
		values.password
	);

	return serviceResult.toPlainObject();
};
<<<<<<< HEAD

export const register = async (values: RegisterFormValues) => {
	const serviceResult = await UserService.createUser(
		values.username,
		values.password,
		values.email
	);

	return serviceResult.toPlainObject();
};

export const forgotPassword = async (values: ForgotPasswordFormValues) => {
	const serviceResult = await UserService.sendPasswordResetEmail(values.email);

	return serviceResult.toPlainObject();
};
=======
>>>>>>> f2962736316efd5726c61050eac23356daea6ebd
