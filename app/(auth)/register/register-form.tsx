'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { register } from '@/actions/auth';
import LogoClient from '@/components/logo-client';
import { SubmitButton } from '@/components/submit-button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DEFAULT_SITE_LOGO, DEFAULT_SITE_LOGO_DARK, DEFAULT_SITE_TITLE } from '@/constants/default';
import { useTranslations } from '@/i18n';
import { RegisterFormValues } from '@/types/auth';

export function RegisterForm() {
	const t = useTranslations('app_auth_register_page');
	const form = useForm<RegisterFormValues>({
		resolver: zodResolver(
			z.object({
				username: z.string().min(1, { message: t('username_required') }),
				email: z.string().email({ message: t('email_invalid') }).optional(),
				password: z.string().min(6, { message: t('password_min_length') }),
				confirmPassword: z.string().min(6, { message: t('password_min_length') })
			}).refine((data) => data.password === data.confirmPassword, {
				message: t('password_mismatch'),
				path: ['confirmPassword']
			})
		),
		defaultValues: {
			username: '',
			email: '',
			password: '',
			confirmPassword: ''
		}
	});

	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const onSubmit = (values: RegisterFormValues) => {
		startTransition(() => {
			register(values)
				.then((result) => {
					if (result.success) {
						toast.success(t('register_success'));
						router.push('/login');
					} else {
						toast.error(result.message);
					}
				})
				.catch(() => {
					toast.error(t('register_error'));
				});
		});
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex justify-center mb-4">
					<LogoClient 
						size={48} 
						logo={DEFAULT_SITE_LOGO}
						darkLogo={DEFAULT_SITE_LOGO_DARK}
						title={DEFAULT_SITE_TITLE}
					/>
				</div>
				<CardTitle>{t('card_title')}</CardTitle>
				<CardDescription>{t('card_description')}</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name="username"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t('username_label')}</FormLabel>
									<FormControl>
										<Input disabled={isPending} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t('email_label')}</FormLabel>
									<FormControl>
										<Input disabled={isPending} type="email" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t('password_label')}</FormLabel>
									<FormControl>
										<Input disabled={isPending} type="password" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t('confirm_password_label')}</FormLabel>
									<FormControl>
										<Input disabled={isPending} type="password" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<SubmitButton isPending={isPending} className="w-full">
							{t('register_button')}
						</SubmitButton>
					</form>
				</Form>
				
				<div className="mt-4 text-center text-sm">
					{t('have_account')}{' '}
					<Link href="/login" className="underline">
						{t('login_link')}
					</Link>
				</div>
			</CardContent>
		</Card>
	);
} 