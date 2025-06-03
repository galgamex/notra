'use client';

import { AppWindow } from 'lucide-react';
import { usePathname } from 'next/navigation';

import NotraSidebarButton from '@/components/notra/notra-sidebar-button';
import NotraSidebarGroup from '@/components/notra/notra-sidebar-group';
import NotraSidebarMenu from '@/components/notra/notra-sidebar-menu';
import NotraSidebarMenuItem from '@/components/notra/notra-sidebar-menu-item';
import { useTranslations } from '@/i18n';

export default function NavSettings() {
	const pathname = usePathname();
	const t = useTranslations('app_dashboard_settings_sidebar');

	const navSite = [
		{
			title: t('site_settings'),
			url: '/dashboard/settings',
			icon: AppWindow
		}
	];

	return (
		<NotraSidebarGroup group={t('site')}>
			<NotraSidebarMenu>
				{navSite.map((item) => (
					<NotraSidebarMenuItem key={item.url}>
						<NotraSidebarButton
							href={item.url}
							className="pr-4 pl-6"
							isActive={pathname === item.url}
						>
							{item.icon && <item.icon size={16} />}
							<span>{item.title}</span>
						</NotraSidebarButton>
					</NotraSidebarMenuItem>
				))}
			</NotraSidebarMenu>
		</NotraSidebarGroup>
	);
}
