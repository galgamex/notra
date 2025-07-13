import { Plus } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

import AccountAvatar from '@/components/account-avatar';
import NotraInset from '@/components/notra/notra-inset';
import NotraInsetHeader from '@/components/notra/notra-inset-header';
import NotraSidebar from '@/components/notra/notra-sidebar';
import NotraSidebarContent from '@/components/notra/notra-sidebar-content';
import { Button } from '@/components/ui/button';
import { getTranslations } from '@/i18n';

import CategoriesList from './_components/categories-list';
import DashboardSidebarHeader from '../../_components/dashboard-sidebar-header';
import NavMain from '../../_components/nav-main';

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
			<NotraSidebar className="bg-sidebar">
				<DashboardSidebarHeader />
				<NotraSidebarContent>
					<NavMain />
				</NotraSidebarContent>
			</NotraSidebar>
			<NotraInset>
				<NotraInsetHeader rightActions={<AccountAvatar />} />
				<div className="px-9 py-6">
					<div className="mb-5 flex items-center justify-between">
						<h1 className="text-lg font-medium">{t('categories')}</h1>
						<Button asChild>
							<Link href="/admin/blog/categories/new">
								<Plus className="mr-2" size={16} />
								新建分类
							</Link>
						</Button>
					</div>
					<p className="mb-6 text-muted-foreground">
						管理您的文章分类，用于组织和分类您的内容。
					</p>

					<CategoriesList />
				</div>
			</NotraInset>
		</>
	);
}
