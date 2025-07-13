'use client';

import {
	House,
	FileText,
	FolderOpen,
	Tag,
	Globe,
	Layers,
	Hash,
	BarChart3
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

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
			url: '/admin',
			icon: House
		},
		{
			title: t('website_management'),
			url: '/admin/websites',
			icon: Globe,
			subItems: [
				{
					title: t('websites'),
					url: '/admin/websites',
					icon: Globe
				},
				{
					title: t('website_categories'),
					url: '/admin/websites/categories',
					icon: Layers
				},
				{
					title: t('website_tags'),
					url: '/admin/websites/tags',
					icon: Hash
				},
				{
					title: t('website_stats'),
					url: '/admin/websites/stats',
					icon: BarChart3
				}
			]
		},
		{
			title: t('blog_management'),
			url: '/admin/blog',
			icon: FileText,
			subItems: [
				{
					title: t('posts'),
					url: '/admin/blog/posts',
					icon: FileText
				},
				{
					title: t('categories'),
					url: '/admin/blog/categories',
					icon: FolderOpen
				},
				{
					title: t('tags'),
					url: '/admin/blog/tags',
					icon: Tag
				}
			]
		}
	];

	const [openItems, setOpenItems] = useState<string[]>([]);

	const handleToggle = (url: string) => {
		setOpenItems((prev) =>
			prev.includes(url) ? prev.filter((item) => item !== url) : [...prev, url]
		);
	};

	const renderNavItem = (item: SidebarNavItem, level = 0) => {
		const isActive =
			pathname === item.url ||
			(item.subItems &&
				item.subItems.some((subItem) => pathname.startsWith(subItem.url)));
		const hasSubItems = item.subItems && item.subItems.length > 0;
		const isOpen = openItems.includes(item.url) || isActive;

		return (
			<NotraSidebarMenuItem key={item.url}>
				<NotraSidebarButton
					className={`pr-4 ${level === 0 ? 'pl-2.5' : 'pl-6'}`}
					href={hasSubItems ? '#' : item.url}
					isActive={isActive}
					onClick={hasSubItems ? () => handleToggle(item.url) : undefined}
				>
					{item.icon && <item.icon size={16} />}
					<span>{item.title}</span>
				</NotraSidebarButton>
				{hasSubItems && isOpen && (
					<NotraSidebarMenu className="mt-1">
						{item.subItems!.map((subItem) => renderNavItem(subItem, level + 1))}
					</NotraSidebarMenu>
				)}
			</NotraSidebarMenuItem>
		);
	};

	return (
		<NotraSidebarMenu>
			{navItems.map((item) => renderNavItem(item))}
		</NotraSidebarMenu>
	);
}
