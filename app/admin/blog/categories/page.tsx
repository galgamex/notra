import { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import NotraInset from '@/components/notra/notra-inset';
import NotraInsetHeader from '@/components/notra/notra-inset-header';
import NotraSidebar from '@/components/notra/notra-sidebar';
import NotraSidebarContent from '@/components/notra/notra-sidebar-content';
import AccountAvatar from '@/components/account-avatar';
import { getTranslations } from '@/i18n';

import DashboardSidebarHeader from '../../_components/dashboard-sidebar-header';
import NavMain from '../../_components/nav-main';
import CategoriesList from './_components/categories-list';

export const generateMetadata = async (): Promise<Metadata> => {
	const t = getTranslations('app_dashboard_sidebar');
	return {
		title: `${t('categories')} - Notra`
	};
};

export default function CategoriesPage() {
	const t = getTranslations('app_dashboard_sidebar');

	return (
		<>
			<NotraSidebar resizeable className="bg-sidebar">
				<DashboardSidebarHeader />
				<NotraSidebarContent>
					<NavMain />
				</NotraSidebarContent>
			</NotraSidebar>
			<NotraInset>
				<NotraInsetHeader rightActions={<AccountAvatar />} />
				<div className="px-9 py-6">
					<div className="flex items-center justify-between mb-5">
						<h1 className="text-lg font-medium">{t('categories')}</h1>
						<Button asChild>
							<Link href="/admin/blog/categories/new">
								<Plus size={16} className="mr-2" />
								新建分类
							</Link>
						</Button>
					</div>
					<p className="text-muted-foreground mb-6">
						管理您的文章分类，用于组织和分类您的内容。
					</p>
					
					<CategoriesList />
				</div>
			</NotraInset>
		</>
	);
}