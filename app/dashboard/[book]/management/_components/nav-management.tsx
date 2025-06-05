'use client';

import { BookOpen } from 'lucide-react';
import { usePathname } from 'next/navigation';

import NotraSidebarButton from '@/components/notra/notra-sidebar-button';
import NotraSidebarGroup from '@/components/notra/notra-sidebar-group';
import NotraSidebarMenu from '@/components/notra/notra-sidebar-menu';
import NotraSidebarMenuItem from '@/components/notra/notra-sidebar-menu-item';
import { useTranslations } from '@/i18n';
import { SidebarNavItem } from '@/types/sidebar-nav';

interface NavManagementProps {
	slug: string;
}

export default function NavManagement({ slug }: Readonly<NavManagementProps>) {
	const pathname = usePathname();
	const t = useTranslations('app_dashboard_book_management_sidebar');

	const navSite: SidebarNavItem[] = [
		{
			title: t('book_info'),
			url: `/dashboard/${slug}/management/settings`,
			icon: BookOpen
		}
	];

	return (
		<>
			<p className="pt-2 pl-4 font-semibold">{t('book_management')}</p>
			<NotraSidebarGroup group={t('settings')}>
				<NotraSidebarMenu>
					{navSite.map((item) => (
						<NotraSidebarMenuItem key={item.url}>
							<NotraSidebarButton
								className="pr-4 pl-6"
								href={item.url}
								isActive={pathname === item.url}
							>
								{item.icon && <item.icon size={16} />}
								<span>{item.title}</span>
							</NotraSidebarButton>
						</NotraSidebarMenuItem>
					))}
				</NotraSidebarMenu>
			</NotraSidebarGroup>
		</>
	);
}
