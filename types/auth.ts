<<<<<<< HEAD
export interface LoginFormValues {
	username: string;
	password: string;
}

export interface RegisterFormValues {
	username: string;
	email?: string;
	password: string;
	confirmPassword: string;
}

export interface ForgotPasswordFormValues {
	email: string;
}

export interface ResetPasswordFormValues {
	token: string;
	password: string;
	confirmPassword: string;
}

export interface User {
	id: string;
	username: string;
	email?: string | null;
	password: string;
	avatar?: string | null;
	name?: string | null;
	role: 'USER' | 'ADMIN';
	emailVerified?: Date | null;
	verificationToken?: string | null;
	createdAt: Date;
	updatedAt: Date;
}
=======
export type LoginFormValues = {
	username: string;
	password: string;
};
>>>>>>> f2962736316efd5726c61050eac23356daea6ebd
