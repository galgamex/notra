import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

import AccountAvatar from '@/components/account-avatar';
import NotraInset from '@/components/notra/notra-inset';
import NotraInsetHeader from '@/components/notra/notra-inset-header';
import NotraSidebar from '@/components/notra/notra-sidebar';
import NotraSidebarContent from '@/components/notra/notra-sidebar-content';
import { Button } from '@/components/ui/button';
import { getTranslations } from '@/i18n';

import CategoryForm from './_components/category-form';
import DashboardSidebarHeader from '../../../_components/dashboard-sidebar-header';
import NavMain from '../../../_components/nav-main';

export const generateMetadata = async (): Promise<Metadata> => {
	const t = getTranslations('app_dashboard_sidebar');

	return {
		title: `新建分类 - ${t('categories')} - Notra`
	};
};

export default function NewCategoryPage() {
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
					<div className="mb-6 flex items-center gap-4">
						<Button asChild size="sm" variant="ghost">
							<Link href="/admin/blog/categories">
								<ArrowLeft className="mr-2" size={16} />
								返回分类列表
							</Link>
						</Button>
						<h1 className="text-lg font-medium">新建分类</h1>
					</div>
					<p className="mb-6 text-muted-foreground">
						创建一个新的文章分类，用于组织和分类您的内容。
					</p>

					<CategoryForm />
				</div>
			</NotraInset>
		</>
	);
}
