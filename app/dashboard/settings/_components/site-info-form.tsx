'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ImageEntity, SiteSettingsEntity } from '@prisma/client';
import { Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { updateSiteInfo } from '@/actions/site-settings';
import { ImageCropper } from '@/components/image-cropper';
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
import { Textarea } from '@/components/ui/textarea';
import { useTranslations } from '@/i18n';
import { uploadImage } from '@/lib/utils';
import { Nullable } from '@/types/common';
import { SiteInfoFormSchema, SiteInfoFormValues } from '@/types/site-settings';

export interface SiteInfoFormProps {
	defaultTitle?: SiteSettingsEntity['title'];
	defaultDescription?: SiteSettingsEntity['description'];
	defaultKeywords?: SiteSettingsEntity['keywords'];
	defaultLogo?: SiteSettingsEntity['logo'];
	defaultDarkLogo?: SiteSettingsEntity['darkLogo'];
}

export default function SiteInfoForm({
	defaultTitle,
	defaultDescription,
	defaultKeywords,
	defaultLogo,
	defaultDarkLogo
}: SiteInfoFormProps) {
	const t = useTranslations('app_dashboard_settings_page');
	const uploadError = useTranslations('actions_files')('upload_error');
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const form = useForm<SiteInfoFormValues>({
		resolver: zodResolver(SiteInfoFormSchema),
		defaultValues: {
			title: defaultTitle,
			description: defaultDescription,
			keywords: defaultKeywords
		}
	});

	const onSubmit = async (values: SiteInfoFormValues) => {
		setIsLoading(true);

		let image: Nullable<ImageEntity> = null;

		if (values.logo) {
			try {
				image = await uploadImage(values.logo);
			} catch {
				toast.error(uploadError);
				setIsLoading(false);

				return;
			}
		}

		let darkImage: Nullable<ImageEntity> = null;

		if (values.darkLogo) {
			try {
				darkImage = await uploadImage(values.darkLogo);
			} catch {
				toast.error(uploadError);
				setIsLoading(false);

				return;
			}
		}

		try {
			const result = await updateSiteInfo({
				title: values.title,
				description: values.description,
				keywords: values.keywords,
				logo: values.logo === null ? null : image?.url,
				darkLogo: values.darkLogo === null ? null : darkImage?.url
			});

			if (result.success) {
				toast.success(t('update_success'));
				router.refresh();
			} else {
				toast.error(result.message);
			}
		} catch {
			toast.error(t('update_error'));
		}

		setIsLoading(false);
	};

	const logoPlaceholder = (
		<div className="flex flex-col items-center justify-center gap-2">
			<Upload className="h-5 w-5 text-muted-foreground" />
		</div>
	);

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<FormField
					control={form.control}
					name="logo"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t('label_logo')}</FormLabel>
							<div className="w-28">
								<ImageCropper
									title={t('edit_logo')}
									aspectRatio={1}
									placeholder={logoPlaceholder}
									defaultImage={defaultLogo}
									disabled={isLoading}
									onCrop={(croppedFile) => {
										field.onChange(croppedFile);
									}}
								/>
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="darkLogo"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t('label_dark_logo')}</FormLabel>
							<div className="w-28">
								<ImageCropper
									title={t('edit_dark_logo')}
									aspectRatio={1}
									placeholder={logoPlaceholder}
									defaultImage={defaultDarkLogo}
									disabled={isLoading}
									onCrop={(croppedFile) => {
										field.onChange(croppedFile);
									}}
								/>
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t('label_site_title')}</FormLabel>
							<FormControl>
								<Input
									{...field}
									value={field.value ?? ''}
									placeholder="Notra"
									disabled={isLoading}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t('label_site_description')}</FormLabel>
							<FormControl>
								<Textarea
									{...field}
									value={field.value ?? ''}
									placeholder={t('description_placeholder')}
									disabled={isLoading}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="keywords"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t('label_keywords')}</FormLabel>
							<FormControl>
								<Input
									{...field}
									value={field.value ?? ''}
									placeholder={t('keywords_placeholder')}
									disabled={isLoading}
								/>
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
