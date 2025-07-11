import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import NotraInset from '@/components/notra/notra-inset';
import NotraInsetHeader from '@/components/notra/notra-inset-header';
import NotraSidebar from '@/components/notra/notra-sidebar';
import NotraSidebarContent from '@/components/notra/notra-sidebar-content';
import AccountAvatar from '@/components/account-avatar';
import { getTranslations } from '@/i18n';

import DashboardSidebarHeader from '../../../_components/dashboard-sidebar-header';
import NavMain from '../../../_components/nav-main';
import CategoryForm from './_components/category-form';

export const generateMetadata = async (): Promise<Metadata> => {
	const t = getTranslations('app_dashboard_sidebar');
	return {
		title: `新建分类 - ${t('categories')} - Notra`
	};
};

export default function NewCategoryPage() {
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
					<div className="flex items-center gap-4 mb-6">
						<Button asChild variant="ghost" size="sm">
							<Link href="/admin/blog/categories">
								<ArrowLeft size={16} className="mr-2" />
								返回分类列表
							</Link>
						</Button>
						<h1 className="text-lg font-medium">新建分类</h1>
					</div>
					<p className="text-muted-foreground mb-6">
						创建一个新的文章分类，用于组织和分类您的内容。
					</p>
					
					<CategoryForm />
				</div>
			</NotraInset>
		</>
	);
}