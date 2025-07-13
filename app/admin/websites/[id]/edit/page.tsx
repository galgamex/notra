import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import WebsiteService from '@/services/website';

import WebsiteEditForm from './_components/website-edit-form';

export const metadata: Metadata = {
	title: '编辑网站',
	description: '编辑网站信息'
};

interface EditWebsitePageProps {
	params: Promise<{ id: string }>;
}

export default async function EditWebsitePage({
	params
}: EditWebsitePageProps) {
	const { id } = await params;
	let website = null;

	try {
		website = await WebsiteService.getWebsiteById(id);
	} catch (error) {
		console.error('获取网站失败:', error);
		notFound();
	}

	if (!website) {
		notFound();
	}

	return (
		<div className="space-y-6">
			{/* 返回按钮 */}
			<div className="flex items-center gap-4">
				<Link href="/admin/websites">
					<Button size="sm" variant="ghost">
						<ArrowLeft className="mr-2 h-4 w-4" />
						返回网站列表
					</Button>
				</Link>
			</div>

			{/* 编辑表单 */}
			<Card>
				<CardHeader>
					<CardTitle>编辑网站</CardTitle>
					<CardDescription>
						修改网站的基本信息、分类和标签等
					</CardDescription>
				</CardHeader>
				<CardContent>
					<WebsiteEditForm website={website} />
				</CardContent>
			</Card>
		</div>
	);
}