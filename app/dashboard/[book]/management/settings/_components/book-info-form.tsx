'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { BookEntity } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { updateBookInfo } from '@/actions/book';
import { SubmitButton } from '@/components/submit-button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useTranslations } from '@/i18n';
import { BookInfoFormValues } from '@/types/book';

export interface BookInfoFormProps {
	id: BookEntity['id'];
	defaultName: BookEntity['name'];
	defaultSlug: BookEntity['slug'];
}

export default function BookInfoForm({
	id,
	defaultName,
	defaultSlug
}: Readonly<BookInfoFormProps>) {
	const t = useTranslations('app_dashboard_book_management_settings_page');
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();
	const form = useForm<BookInfoFormValues>({
		resolver: zodResolver(
			z.object({
				name: z.string().min(1, { message: t('name_required') }),
				slug: z
					.string()
					.min(2, { message: t('slug_required') })
					.regex(/^[a-z0-9-_.]+$/, {
						message: t('slug_required')
					})
			})
		),
		defaultValues: {
			name: defaultName,
			slug: defaultSlug
		}
	});

	const onSubmit = async (values: BookInfoFormValues) => {
		setIsLoading(true);

		try {
			const result = await updateBookInfo({ id, ...values });

			if (result.success) {
				toast.success(t('update_success'));
				router.replace(`/dashboard/${values.slug}/management/settings`);
			} else {
				toast.error(result.message);
			}
		} catch {
			toast.error(t('update_error'));
		}

		setIsLoading(false);
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t('label_name')}</FormLabel>
							<FormControl>
								<Input {...field} disabled={isLoading} />
							</FormControl>
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="slug"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t('label_slug')}</FormLabel>
							<FormDescription>{t('slug_description')}</FormDescription>
							<FormControl>
								<Input {...field} disabled={isLoading} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<SubmitButton isPending={isLoading} className="w-auto">
					{t('button_update_info')}
				</SubmitButton>
			</form>
		</Form>
	);
}
