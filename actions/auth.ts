'use server';

import UserService from '@/services/user';
import {
	LoginFormValues,
	RegisterFormValues,
	ForgotPasswordFormValues
} from '@/types/auth';

export const login = async (values: LoginFormValues) => {
	const serviceResult = await UserService.login(
		values.username,
		values.password
	);

	return serviceResult.toPlainObject();
};

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
