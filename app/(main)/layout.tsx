import DynamicSidebar from '@/components/notra/dynamic-sidebar';
import NotraFooter from '@/components/notra/notra-footer';
import NotraHeader from '@/components/notra/notra-header';
import SiteSettingsService from '@/services/site-settings';

export default async function Layout({
	children
}: Readonly<{ children: React.ReactNode }>) {
	// 获取站点设置
	const { data: siteSettings } = await SiteSettingsService.getSiteSettings();

	return (
		<div className="flex min-h-screen flex-col">
			{/* 导航栏区域 */}
			<header className="sticky top-0 z-30">
				<NotraHeader siteSettings={siteSettings} />
			</header>

			{/* 侧边栏 */}
			<DynamicSidebar />

			{/* 主内容区域 */}
			<main className="flex-1 transition-all duration-300 md:ml-64">
				<div className="px-6 md:px-8">{children}</div>
			</main>

			{/* 页脚区域 */}
			<footer className="transition-all duration-300 md:ml-64">
				<NotraFooter />
			</footer>
		</div>
	);
}
