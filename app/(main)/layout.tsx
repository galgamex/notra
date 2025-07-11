import NotraFooter from '@/components/notra/notra-footer';
import NotraHeader from '@/components/notra/notra-header';
import MainSidebar from '@/components/notra/main-sidebar';
import SiteSettingsService from '@/services/site-settings';

export default async function Layout({
	children
}: Readonly<{ children: React.ReactNode }>) {
	// 获取站点设置
	const { data: siteSettings } = await SiteSettingsService.getSiteSettings();

	return (
		<div className="min-h-screen flex flex-col">
			{/* 导航栏区域 */}
			<header className="sticky top-0 z-30">
				<NotraHeader siteSettings={siteSettings} />
			</header>
			
			{/* 侧边栏 */}
			<MainSidebar />
			
			{/* 主内容区域 */}
			<main className="flex-1 md:ml-64 transition-all duration-300">
				<div className="px-6 md:px-8">
					{children}
				</div>
			</main>
			
			{/* 页脚区域 */}
			<footer className="md:ml-64 transition-all duration-300">
				<NotraFooter />
			</footer>
		</div>
	);
}
