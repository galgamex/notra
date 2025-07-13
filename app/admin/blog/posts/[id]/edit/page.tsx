import DashboardSidebarHeader from '@/app/admin/_components/dashboard-sidebar-header';
import NavMain from '@/app/admin/_components/nav-main';
import AccountAvatar from '@/components/account-avatar';
import NotraInset from '@/components/notra/notra-inset';
import NotraInsetHeader from '@/components/notra/notra-inset-header';
import NotraSidebar from '@/components/notra/notra-sidebar';
import NotraSidebarContent from '@/components/notra/notra-sidebar-content';

import PostForm from '../../_components/post-form';

interface EditPostPageProps {
	params: {
		id: string;
	};
}

export default function EditPostPage({ params }: EditPostPageProps) {
	return (
		<>
			<NotraSidebar>
				<NotraSidebarContent>
					<DashboardSidebarHeader />
					<NavMain />
				</NotraSidebarContent>
			</NotraSidebar>
			<NotraInset>
				<NotraInsetHeader
					leftActions={
						<div className="flex items-center gap-2">
							<h1 className="text-lg font-semibold">编辑文章</h1>
							<span className="text-sm text-muted-foreground">
								修改文章内容和设置
							</span>
						</div>
					}
					rightActions={<AccountAvatar />}
				/>
				<div className="p-6">
					<PostForm mode="edit" postId={params.id} />
				</div>
			</NotraInset>
		</>
	);
}
