import { Metadata } from 'next';
import NotraInset from '@/components/notra/notra-inset';
import NotraInsetHeader from '@/components/notra/notra-inset-header';
import NotraSidebar from '@/components/notra/notra-sidebar';
import NotraSidebarContent from '@/components/notra/notra-sidebar-content';
import AccountAvatar from '@/components/account-avatar';
import { getTranslations } from '@/i18n';

import DashboardSidebarHeader from '@/app/admin/_components/dashboard-sidebar-header';
import NavMain from '@/app/admin/_components/nav-main';
import PostForm from '../_components/post-form';

export const generateMetadata = async (): Promise<Metadata> => {
	const t = getTranslations('app_dashboard_sidebar');
	return {
		title: `${t('posts')} - Notra`
	};
};

export default function NewPostPage() {
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
					<PostForm mode="create" />
				</div>
			</NotraInset>
		</>
	);
}