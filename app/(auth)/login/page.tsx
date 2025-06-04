import { Metadata } from 'next';

import { DEFAULT_SITE_TITLE } from '@/constants/default';
import { getTranslations } from '@/i18n';
import SiteSettingsService from '@/services/site-settings';

import { LoginForm } from './login-form';

export const generateMetadata = async (): Promise<Metadata> => {
	const { data: siteSettings } = await SiteSettingsService.getSiteSettings();
	const t = getTranslations('app_auth_login_page');

	return {
		title: `${t('metadata_title')} - ${siteSettings?.title ?? DEFAULT_SITE_TITLE}`
	};
};

export default function Page() {
	return (
		<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm">
				<LoginForm />
			</div>
		</div>
	);
}
