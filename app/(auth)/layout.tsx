import NotraHeader from '@/components/notra/notra-header';
import SiteSettingsService from '@/services/site-settings';

export default async function AuthLayout({
	children
}: Readonly<{ children: React.ReactNode }>) {
	// 获取站点设置
	const { data: siteSettings } = await SiteSettingsService.getSiteSettings();

	return (
		<>
			<NotraHeader siteSettings={siteSettings} />
			<div className="fixed inset-0 top-nav-height overflow-hidden">
				{children}
			</div>
		</>
	);
}
