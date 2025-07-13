import { ArrowLeft } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card';

import WebsiteForm from './_components/website-form';

export const metadata: Metadata = {
	title: '添加网站',
	description: '添加新的网站到导航'
};

export default function NewWebsitePage() {
	return (
		<div className="space-y-6">
			<div className="flex items-center space-x-4">
				<Button asChild size="sm" variant="ghost">
					<Link href="/admin/websites">
						<ArrowLeft className="mr-2 h-4 w-4" />
						返回
					</Link>
				</Button>
				<div>
					<h1 className="text-3xl font-bold tracking-tight">添加网站</h1>
					<p className="text-muted-foreground">添加新的网站到导航系统</p>
				</div>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>网站信息</CardTitle>
					<CardDescription>
						请填写网站的基本信息，所有带 * 的字段为必填项。
					</CardDescription>
				</CardHeader>
				<CardContent>
					<WebsiteForm />
				</CardContent>
			</Card>
		</div>
	);
}
