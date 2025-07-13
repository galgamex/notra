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

import PostsList from './_components/posts-list';
import DashboardSidebarHeader from '../../_components/dashboard-sidebar-header';
import NavMain from '../../_components/nav-main';

export const generateMetadata = async (): Promise<Metadata> => {
	const t = getTranslations('app_dashboard_sidebar');

	return {
		title: `${t('posts')} - Notra`
	};
};

export default function PostsPage() {
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
						<h1 className="text-lg font-medium">{t('posts')}</h1>
						<Button asChild>
							<Link href="/admin/blog/posts/new">
								<Plus className="mr-2" size={16} />
								新建文章
							</Link>
						</Button>
					</div>
					<p className="mb-6 text-muted-foreground">
						管理您的所有文章，包括创建、编辑、发布和删除文章。
					</p>

					<PostsList />
				</div>
			</NotraInset>
		</>
	);
}
