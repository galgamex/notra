'use client';

import { MoreHorizontal, Edit, Trash2, Hash } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

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

interface Tag {
	id: string;
	name: string;
	slug: string;
	description?: string;
	color?: string;
	_count?: {
		websites: number;
	};
	createdAt: string;
	updatedAt: string;
}

export default function TagsList() {
	const [tags, setTags] = useState<Tag[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchTags();
	}, []);

	const fetchTags = async () => {
		try {
			const response = await fetch('/api/website/tags');

			if (response.ok) {
				const data = await response.json();

				setTags(data.tags || []);
			}
		} catch (error) {
			console.error('Failed to fetch tags:', error);
		} finally {
			setLoading(false);
		}
	};

	const handleDelete = async (tagId: string) => {
		if (!confirm('确定要删除这个标签吗？删除后该标签将从所有网站中移除。')) {
			return;
		}

		try {
			const response = await fetch(`/api/website/tags/${tagId}`, {
				method: 'DELETE'
			});

			if (response.ok) {
				// 刷新列表
				fetchTags();
			}
		} catch (error) {
			console.error('Failed to delete tag:', error);
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
						<TableHead>标签名称</TableHead>
						<TableHead>标识符</TableHead>
						<TableHead>描述</TableHead>
						<TableHead>使用次数</TableHead>
						<TableHead>创建时间</TableHead>
						<TableHead className="text-right">操作</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{tags.map((tag) => (
						<TableRow key={tag.id}>
							<TableCell className="font-medium">
								<div className="flex items-center space-x-2">
									<Hash className="h-4 w-4 text-muted-foreground" />
									<span>{tag.name}</span>
									{tag.color && (
										<div
											className="h-3 w-3 rounded-full"
											style={{ backgroundColor: tag.color }}
										/>
									)}
								</div>
							</TableCell>
							<TableCell>
								<Badge variant="outline">{tag.slug}</Badge>
							</TableCell>
							<TableCell className="max-w-xs truncate">
								{tag.description || '暂无描述'}
							</TableCell>
							<TableCell>
								<div className="flex items-center space-x-1">
									<Hash className="h-4 w-4 text-muted-foreground" />
									<span>{tag._count?.websites || 0}</span>
								</div>
							</TableCell>
							<TableCell>
								{new Date(tag.createdAt).toLocaleDateString('zh-CN')}
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
											<Link href={`/websites?tag=${tag.slug}`} target="_blank">
												<Hash className="mr-2 h-4 w-4" />
												查看标签页面
											</Link>
										</DropdownMenuItem>
										<DropdownMenuItem asChild>
											<Link href={`/admin/websites/tags/${tag.id}/edit`}>
												<Edit className="mr-2 h-4 w-4" />
												编辑
											</Link>
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											className="text-red-600"
											onClick={() => handleDelete(tag.id)}
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
			{tags.length === 0 && (
				<div className="py-8 text-center text-muted-foreground">
					暂无标签数据
				</div>
			)}
		</div>
	);
}
