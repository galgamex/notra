'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { forgotPassword } from '@/actions/auth';
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
import {
	DEFAULT_SITE_LOGO,
	DEFAULT_SITE_LOGO_DARK,
	DEFAULT_SITE_TITLE
} from '@/constants/default';
import { useTranslations } from '@/i18n';
import { ForgotPasswordFormValues } from '@/types/auth';

export function ForgotPasswordForm() {
	const t = useTranslations('app_auth_forgot_password_page');
	const form = useForm<ForgotPasswordFormValues>({
		resolver: zodResolver(
			z.object({
				email: z.string().email({ message: t('email_invalid') })
			})
		),
		defaultValues: {
			email: ''
		}
	});

	const [isPending, startTransition] = useTransition();

	const onSubmit = (values: ForgotPasswordFormValues) => {
		startTransition(() => {
			forgotPassword(values)
				.then((result) => {
					if (result.success) {
						toast.success(t('send_success'));
					} else {
						toast.error(result.message);
					}
				})
				.catch(() => {
					toast.error(t('send_error'));
				});
		});
	};

	return (
		<Card>
			<CardHeader>
				<div className="mb-4 flex justify-center">
					<LogoClient
						darkLogo={DEFAULT_SITE_LOGO_DARK}
						logo={DEFAULT_SITE_LOGO}
						size={48}
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
						<SubmitButton className="w-full" isPending={isPending}>
							{t('send_button')}
						</SubmitButton>
					</form>
				</Form>

				<div className="mt-4 text-center text-sm">
					<Link className="underline" href="/login">
						{t('back_to_login')}
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
