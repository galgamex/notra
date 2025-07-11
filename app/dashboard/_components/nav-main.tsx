'use client';

import { Home } from 'lucide-react';
import { usePathname } from 'next/navigation';

import NotraSidebarButton from '@/components/notra/notra-sidebar-button';
import NotraSidebarMenu from '@/components/notra/notra-sidebar-menu';
import NotraSidebarMenuItem from '@/components/notra/notra-sidebar-menu-item';
import { useTranslations } from '@/i18n';
import { SidebarNavItem } from '@/types/sidebar-nav';

export default function NavMain() {
	const t = useTranslations('app_dashboard_sidebar');
	const pathname = usePathname();

	const navItems: SidebarNavItem[] = [
		{
			title: t('home'),
			url: '/dashboard',
			icon: Home
		}
	];

	return (
		<NotraSidebarMenu>
			{navItems.map((item) => (
				<NotraSidebarMenuItem key={item.url}>
					<NotraSidebarButton
						className="pr-4 pl-2.5"
						href={item.url}
						isActive={pathname === item.url}
					>
						{item.icon && <item.icon size={16} />}
						<span>{item.title}</span>
					</NotraSidebarButton>
				</NotraSidebarMenuItem>
			))}
		</NotraSidebarMenu>
	);
}
