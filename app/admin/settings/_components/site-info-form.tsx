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
	defaultLogo?: SiteSettingsEntity['logo'];
	defaultDarkLogo?: SiteSettingsEntity['darkLogo'];
	defaultCopyright?: SiteSettingsEntity['copyright'];
}

export default function SiteInfoForm({
	defaultTitle,
	defaultDescription,
	defaultLogo,
	defaultDarkLogo,
	defaultCopyright
}: Readonly<SiteInfoFormProps>) {
	const t = useTranslations('app_dashboard_settings_page');
	const uploadError = useTranslations('actions_files')('upload_error');
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	const form = useForm<SiteInfoFormValues>({
		resolver: zodResolver(SiteInfoFormSchema),
		defaultValues: {
			title: defaultTitle,
			description: defaultDescription,
			copyright: defaultCopyright
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
				logo: values.logo === null ? null : image?.url,
				darkLogo: values.darkLogo === null ? null : darkImage?.url,
				copyright: values.copyright
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
			<form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
				<FormField
					control={form.control}
					name="logo"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t('label_logo')}</FormLabel>
							<div className="w-28">
								<ImageCropper
									aspectRatio={1}
									defaultImage={defaultLogo}
									disabled={isLoading}
									placeholder={logoPlaceholder}
									title={t('edit_logo')}
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
									aspectRatio={1}
									defaultImage={defaultDarkLogo}
									disabled={isLoading}
									placeholder={logoPlaceholder}
									title={t('edit_dark_logo')}
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
									disabled={isLoading}
									placeholder="Notra"
									value={field.value ?? ''}
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
									disabled={isLoading}
									placeholder={t('description_placeholder')}
									value={field.value ?? ''}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="copyright"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t('label_copyright')}</FormLabel>
							<FormControl>
								<Input
									{...field}
									disabled={isLoading}
									placeholder={t('copyright_placeholder')}
									value={field.value ?? ''}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<SubmitButton
					className="w-auto"
					disabled={!form.formState.isDirty}
					isPending={isLoading}
				>
					{t('button_update_info')}
				</SubmitButton>
			</form>
		</Form>
	);
}
