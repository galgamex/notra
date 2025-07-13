'use client';

import {
	MoreHorizontal,
	Edit,
	Trash2,
	Eye,
	CheckCircle,
	XCircle,
	Search,
	Filter
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';

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
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/components/ui/select';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';
import type { WebsiteWithDetails } from '@/types/website';

interface WebsiteListResponse {
	websites: WebsiteWithDetails[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export default function WebsitesList() {
	const [websites, setWebsites] = useState<WebsiteWithDetails[]>([]);
	const [loading, setLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [total, setTotal] = useState(0);
	const [searchTerm, setSearchTerm] = useState('');
	const [statusFilter, setStatusFilter] = useState<string>('all');
	const [sortBy, setSortBy] = useState<string>('createdAt');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
	const limit = 20;

	const fetchWebsites = useCallback(async () => {
		setLoading(true);
		try {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: limit.toString(),
				sortBy,
				sortOrder
			});

			if (searchTerm) {
				params.append('search', searchTerm);
			}

			if (statusFilter !== 'all') {
				params.append('status', statusFilter);
			}

			const response = await fetch(`/api/website?${params}`);

			if (response.ok) {
				const data: WebsiteListResponse = await response.json();

				setWebsites(data.websites || []);
				setTotalPages(data.totalPages || 1);
				setTotal(data.total || 0);
			}
		} catch (error) {
			console.error('Failed to fetch websites:', error);
		} finally {
			setLoading(false);
		}
	}, [page, searchTerm, statusFilter, sortBy, sortOrder, limit]);

	useEffect(() => {
		fetchWebsites();
	}, [fetchWebsites]);

	// 搜索防抖
	useEffect(() => {
		const timer = setTimeout(() => {
			setPage(1); // 重置到第一页
			fetchWebsites();
		}, 500);

		return () => clearTimeout(timer);
	}, [searchTerm]);

	// 筛选变化时重置页码
	useEffect(() => {
		setPage(1);
	}, [statusFilter, sortBy, sortOrder]);

	const handleStatusChange = async (
		websiteId: string,
		newStatus: 'APPROVED' | 'REJECTED'
	) => {
		try {
			const response = await fetch(`/api/website/${websiteId}/review`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					id: websiteId,
					status: newStatus
				})
			});

			if (response.ok) {
				// 刷新列表
				fetchWebsites();
			} else {
				const error = await response.json();

				console.error('审核失败:', error.error || '未知错误');
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
		<div className="space-y-4">
			{/* 搜索和筛选工具栏 */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-1 items-center gap-2">
					<div className="relative flex-1 max-w-sm">
						<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							className="pl-8"
							placeholder="搜索网站名称或URL..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
					<Select value={statusFilter} onValueChange={setStatusFilter}>
						<SelectTrigger className="w-32">
							<Filter className="mr-2 h-4 w-4" />
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">全部状态</SelectItem>
							<SelectItem value="PENDING">待审核</SelectItem>
							<SelectItem value="APPROVED">已审核</SelectItem>
							<SelectItem value="REJECTED">已拒绝</SelectItem>
							<SelectItem value="DISABLED">已禁用</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="flex items-center gap-2">
					<Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
						const [newSortBy, newSortOrder] = value.split('-');
						setSortBy(newSortBy);
						setSortOrder(newSortOrder as 'asc' | 'desc');
					}}>
						<SelectTrigger className="w-40">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="createdAt-desc">最新创建</SelectItem>
							<SelectItem value="createdAt-asc">最早创建</SelectItem>
							<SelectItem value="clickCount-desc">点击最多</SelectItem>
							<SelectItem value="clickCount-asc">点击最少</SelectItem>
							<SelectItem value="name-asc">名称 A-Z</SelectItem>
							<SelectItem value="name-desc">名称 Z-A</SelectItem>
						</SelectContent>
					</Select>
					<div className="text-sm text-muted-foreground">
						共 {total} 个网站
					</div>
				</div>
			</div>

			{/* 网站列表表格 */}
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

			{/* 分页控件 */}
			<div className="flex items-center justify-between px-2">
				<div className="text-sm text-muted-foreground">
					显示第 {(page - 1) * limit + 1} - {Math.min(page * limit, total)} 条，共 {total} 条
				</div>
				<div className="flex items-center space-x-2">
					<Button
						variant="outline"
						size="sm"
						disabled={page <= 1}
						onClick={() => setPage(page - 1)}
					>
						上一页
					</Button>
					<div className="flex items-center gap-1">
						{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
							let pageNum;
							if (totalPages <= 5) {
								pageNum = i + 1;
							} else if (page <= 3) {
								pageNum = i + 1;
							} else if (page >= totalPages - 2) {
								pageNum = totalPages - 4 + i;
							} else {
								pageNum = page - 2 + i;
							}
							return (
								<Button
									key={pageNum}
									variant={page === pageNum ? "default" : "outline"}
									size="sm"
									className="w-8 h-8 p-0"
									onClick={() => setPage(pageNum)}
								>
									{pageNum}
								</Button>
							);
						})}
					</div>
					<Button
						variant="outline"
						size="sm"
						disabled={page >= totalPages}
						onClick={() => setPage(page + 1)}
					>
						下一页
					</Button>
				</div>
			</div>
		</div>
	);
}
