'use client';

import {
	MoreHorizontal,
	Edit,
	Trash2,
	Eye,
	CheckCircle,
	XCircle
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';
import type { WebsiteWithDetails } from '@/types/website';

export default function WebsitesList() {
	const [websites, setWebsites] = useState<WebsiteWithDetails[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchWebsites();
	}, []);

	const fetchWebsites = async () => {
		try {
			const response = await fetch('/api/website');

			if (response.ok) {
				const data = await response.json();

				setWebsites(data.websites || []);
			}
		} catch (error) {
			console.error('Failed to fetch websites:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleStatusChange = async (
		websiteId: string,
		newStatus: 'APPROVED' | 'REJECTED'
	) => {
		try {
			const response = await fetch(`/api/website/${websiteId}`, {
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ status: newStatus })
			});

			if (response.ok) {
				// 刷新列表
				fetchWebsites();
			}
		} catch (error) {
			console.error('Failed to update website status:', error);
		}
	};

	const handleDelete = async (websiteId: string) => {
		if (!confirm('确定要删除这个网站吗？')) {
			return;
		}

		try {
			const response = await fetch(`/api/website/${websiteId}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				// 刷新列表
				fetchWebsites();
			}
		} catch (error) {
			console.error('Failed to delete website:', error);
		}
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case 'APPROVED':
				return (
					<Badge className="bg-green-500" variant="default">
						已审核
					</Badge>
				);
			case 'PENDING':
				return <Badge variant="secondary">待审核</Badge>;
			case 'REJECTED':
				return <Badge variant="destructive">已拒绝</Badge>;
			case 'DISABLED':
				return <Badge variant="outline">已禁用</Badge>;
			default:
				return <Badge variant="outline">{status}</Badge>;
		}
	};

	if (loading) {
		return <div className="py-4 text-center">加载中...</div>;
	}

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[100px]">图标</TableHead>
						<TableHead>网站名称</TableHead>
						<TableHead>URL</TableHead>
						<TableHead>分类</TableHead>
						<TableHead>状态</TableHead>
						<TableHead>点击数</TableHead>
						<TableHead>创建时间</TableHead>
						<TableHead className="text-right">操作</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{websites.map((website) => (
						<TableRow key={website.id}>
							<TableCell>
								<Avatar className="h-8 w-8">
									<AvatarImage alt={website.name} src={website.logo || ''} />
									<AvatarFallback>{website.name.charAt(0)}</AvatarFallback>
								</Avatar>
							</TableCell>
							<TableCell className="font-medium">{website.name}</TableCell>
							<TableCell>
								<Link
									className="text-blue-600 hover:underline"
									href={website.url}
									target="_blank"
								>
									{website.url}
								</Link>
							</TableCell>
							<TableCell>
								{website.category ? (
									<Badge variant="outline">{website.category.name}</Badge>
								) : (
									<span className="text-muted-foreground">未分类</span>
								)}
							</TableCell>
							<TableCell>{getStatusBadge(website.status)}</TableCell>
							<TableCell>{website.clickCount || 0}</TableCell>
							<TableCell>
								{new Date(website.createdAt).toLocaleDateString('zh-CN')}
							</TableCell>
							<TableCell className="text-right">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button className="h-8 w-8 p-0" variant="ghost">
											<span className="sr-only">打开菜单</span>
											<MoreHorizontal className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuLabel>操作</DropdownMenuLabel>
										<DropdownMenuItem asChild>
											<Link href={website.url} target="_blank">
												<Eye className="mr-2 h-4 w-4" />
												查看网站
											</Link>
										</DropdownMenuItem>
										<DropdownMenuItem asChild>
											<Link href={`/admin/websites/${website.id}/edit`}>
												<Edit className="mr-2 h-4 w-4" />
												编辑
											</Link>
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										{website.status === 'PENDING' && (
											<>
												<DropdownMenuItem
													onClick={() =>
														handleStatusChange(website.id, 'APPROVED')
													}
												>
													<CheckCircle className="mr-2 h-4 w-4" />
													审核通过
												</DropdownMenuItem>
												<DropdownMenuItem
													onClick={() =>
														handleStatusChange(website.id, 'REJECTED')
													}
												>
													<XCircle className="mr-2 h-4 w-4" />
													审核拒绝
												</DropdownMenuItem>
												<DropdownMenuSeparator />
											</>
										)}
										<DropdownMenuItem
											className="text-red-600"
											onClick={() => handleDelete(website.id)}
										>
											<Trash2 className="mr-2 h-4 w-4" />
											删除
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			{websites.length === 0 && (
				<div className="py-8 text-center text-muted-foreground">
					暂无网站数据
				</div>
			)}
		</div>
	);
}
