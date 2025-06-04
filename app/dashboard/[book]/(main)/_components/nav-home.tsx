'use client';

import { Home } from 'lucide-react';
import { usePathname } from 'next/navigation';

import NotraSidebarButton from '@/components/notra/notra-sidebar-button';
import { useTranslations } from '@/i18n';

import CreateDropdown from './create-dropdown';

interface NavHomeProps {
	bookSlug: string;
}

export default function NavHome({ bookSlug }: Readonly<NavHomeProps>) {
	const t = useTranslations('app_dashboard_book_main_layout');
	const pathname = usePathname();

	return (
		<div className="mb-1.5 flex w-full items-center gap-2">
			<NotraSidebarButton
				href={`/dashboard/${bookSlug}`}
				isActive={pathname === `/dashboard/${bookSlug}`}
			>
				<Home size={16} />
				<span>{t('home')}</span>
			</NotraSidebarButton>

			<CreateDropdown parentCatalogNodeId={null} />
		</div>
	);
}
