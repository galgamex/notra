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
import PostsList from './_components/posts-list';

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
						<h1 className="text-lg font-medium">{t('posts')}</h1>
						<Button asChild>
							<Link href="/admin/blog/posts/new">
								<Plus size={16} className="mr-2" />
								新建文章
							</Link>
						</Button>
					</div>
					<p className="text-muted-foreground mb-6">
						管理您的所有文章，包括创建、编辑、发布和删除文章。
					</p>
					
					<PostsList />
				</div>
			</NotraInset>
		</>
	);
}