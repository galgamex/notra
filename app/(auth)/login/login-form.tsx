'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { login } from '@/actions/auth';
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
import { useTranslations } from '@/i18n';
import { LoginFormValues } from '@/types/auth';

export function LoginForm() {
	const t = useTranslations('app_auth_login_page');
	const form = useForm<LoginFormValues>({
		resolver: zodResolver(
			z.object({
				username: z.string().min(1, { message: t('username_required') }),
				password: z.string().min(6, { message: t('password_min_length') })
			})
		),
		defaultValues: {
			username: '',
			password: ''
		}
	});

	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const onSubmit = (values: LoginFormValues) => {
		startTransition(() => {
			login(values)
				.then((result) => {
					if (result.success) {
						router.refresh();
					} else {
						toast.error(result.message);
					}
				})
				.catch(() => {
					toast.error(t('login_error'));
				});
		});
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>{t('card_title')}</CardTitle>
				<CardDescription>{t('card_description')}</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t('password_label')}</FormLabel>
									<FormControl>
										<Input type="password" disabled={isPending} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<SubmitButton isPending={isPending}>
							{t('login_button')}
						</SubmitButton>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
