import { ChevronLeft } from 'lucide-react';

import Logo from '@/components/logo';
import NotraBackButton from '@/components/notra/notra-back-button';
import { getTranslations } from '@/i18n';

export default function BackButton() {
	const t = getTranslations('app_dashboard_settings_sidebar');

	return (
		<NotraBackButton>
			<ChevronLeft className="size-4" />
			<Logo size={18} />
			<p>{t('back')}</p>
		</NotraBackButton>
	);
}
