'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { updateSiteInfo } from '@/actions/site-settings';
import { SubmitButton } from '@/components/submit-button';
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
import { Nullable } from '@/types/common';
import {
	AnalyticsFormSchema,
	AnalyticsFormValues
} from '@/types/site-settings';

export interface AnalyticsFormProps {
	defaultGoogleAnalyticsId?: Nullable<string>;
}

export default function AnalyticsForm({
	defaultGoogleAnalyticsId
}: Readonly<AnalyticsFormProps>) {
	const t = useTranslations('app_dashboard_settings_page');
	const [isLoading, setIsLoading] = useState(false);

	const form = useForm<AnalyticsFormValues>({
		resolver: zodResolver(AnalyticsFormSchema),
		defaultValues: {
			googleAnalyticsId: defaultGoogleAnalyticsId ?? ''
		}
	});

	const onSubmit = async (values: AnalyticsFormValues) => {
		setIsLoading(true);

		try {
			const result = await updateSiteInfo({
				googleAnalyticsId: values.googleAnalyticsId
			});

			if (result.success) {
				toast.success(t('update_success'));
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
					name="googleAnalyticsId"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t('label_google_analytics_id')}</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder="UA-1234567890"
									disabled={isLoading}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<SubmitButton isPending={isLoading} className="w-auto">
					{t('button_update_analytics')}
				</SubmitButton>
			</form>
		</Form>
	);
}
