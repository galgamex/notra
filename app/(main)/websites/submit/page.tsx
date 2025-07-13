import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';

import { WebsiteSubmitForm } from './_components/website-submit-form';

export default function SubmitWebsitePage() {
	return (
		<div className="mx-auto  py-6">
			{/* 返回按钮 */}
			<div className="mb-6 flex items-center gap-4 md:hidden">
				<Link
					className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900"
					href="/websites"
				>
					<ArrowLeft className="h-4 w-4" />
					<span>返回网站导航</span>
				</Link>
			</div>

			{/* 页面标题 */}
			<div className="mb-8 text-center">
				<div className="mb-4 flex items-center justify-center gap-2">
					<Plus className="h-8 w-8 text-blue-600" />
					<h1 className="text-3xl font-bold text-gray-900">提交网站</h1>
				</div>
				<p className="text-gray-600">
					分享优质网站，帮助更多人发现有价值的资源
				</p>
			</div>

			{/* 提交说明 */}
			<div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-4">
				<h3 className="mb-2 font-medium text-blue-900">提交说明</h3>
				<ul className="space-y-1 text-sm text-blue-800">
					<li>• 请确保网站内容健康、合法，具有实用价值</li>
					<li>• 网站应该能够正常访问，功能完整</li>
					<li>• 提交后将由管理员审核，审核通过后会在网站导航中显示</li>
					<li>• 重复或低质量的网站可能不会被收录</li>
				</ul>
			</div>

			{/* 提交表单 */}
			<div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-card">
				<WebsiteSubmitForm />
			</div>
		</div>
	);
}
