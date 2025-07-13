'use client';

import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import {
	ExternalLink,
	Eye,
	Star,
	Award,
	Calendar,
	User,
	Tag,
	Share2,
	Copy,
	Check,
	AlertTriangle,
	Heart
} from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { WebsiteWithDetails } from '@/types/website';
import WebsiteStatsChart from './website-stats-chart';

interface WebsiteDetailProps {
	website: WebsiteWithDetails;
}

export function WebsiteDetail({ website }: WebsiteDetailProps) {
	const [isVisiting, setIsVisiting] = useState(false);
	const [copied, setCopied] = useState(false);
	const [nsfwEnabled, setNsfwEnabled] = useState(false);
	const [nsfwLoading, setNsfwLoading] = useState(true);
	const [mounted, setMounted] = useState(false);
	const [liked, setLiked] = useState(false);
	const [likeCount, setLikeCount] = useState(website.likeCount);
	const [isLiking, setIsLiking] = useState(false);

	// 设置组件挂载状态
	useEffect(() => {
		setMounted(true);
	}, []);

	// 检查用户NSFW偏好
	useEffect(() => {
		if (!mounted) return;

		const checkNSFWPreference = async () => {
			try {
				const response = await fetch('/api/user/nsfw-preference');

				if (response.ok) {
					const data = await response.json();

					setNsfwEnabled(data.nsfwEnabled);
				}
			} catch (error) {
				console.error('获取NSFW偏好失败:', error);
			} finally {
				setNsfwLoading(false);
			}
		};

		checkNSFWPreference();
	}, [mounted]);

	// 获取点赞状态
	useEffect(() => {
		if (!mounted) return;

		const fetchLikeStatus = async () => {
			try {
				const response = await fetch(`/api/website/likes?websiteId=${website.id}`);

				if (response.ok) {
					const data = await response.json();

					setLiked(data.liked);
					setLikeCount(data.likeCount);
				}
			} catch (error) {
				console.error('获取点赞状态失败:', error);
			}
		};

		fetchLikeStatus();
	}, [mounted, website.id]);

	// 记录点击并跳转
	const handleVisit = async () => {
		setIsVisiting(true);

		try {
			// 记录点击
			await fetch('/api/website/clicks', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					websiteId: website.id,
					referrer: window.location.href
				})
			});

			// 在新窗口打开网站
			window.open(website.url, '_blank', 'noopener,noreferrer');
		} catch (error) {
			console.error('记录点击失败:', error);
			// 即使记录失败也要打开网站
			window.open(website.url, '_blank', 'noopener,noreferrer');
		} finally {
			setIsVisiting(false);
		}
	};

	// 复制链接
	const handleCopyLink = async () => {
		try {
			await navigator.clipboard.writeText(website.url);
			setCopied(true);
			toast.success('链接已复制到剪贴板');
			setTimeout(() => setCopied(false), 2000);
		} catch {
			toast.error('复制失败，请手动复制');
		}
	};

	// 分享网站
	const handleShare = async () => {
		const shareData = {
			title: website.name,
			text: website.description || `发现了一个不错的网站：${website.name}`,
			url: window.location.href
		};

		if (navigator.share) {
			try {
				await navigator.share(shareData);
			} catch {
				// 用户取消分享或分享失败
				handleCopyLink();
			}
		} else {
			// 不支持原生分享，复制链接
			handleCopyLink();
		}
	};

	// 处理点赞
	const handleLike = async () => {
		if (isLiking) return;

		setIsLiking(true);

		try {
			const response = await fetch('/api/website/likes', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					websiteId: website.id
				})
			});

			if (response.ok) {
				const data = await response.json();

				setLiked(data.liked);
				setLikeCount(data.likeCount);
				toast.success(data.message);
			} else {
				const errorData = await response.json();

				toast.error(errorData.message || '操作失败');
			}
		} catch (error) {
			console.error('点赞操作失败:', error);
			toast.error('操作失败，请稍后重试');
		} finally {
			setIsLiking(false);
		}
	};

	return (
		<div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-card">
			{/* 网站头部信息 */}
			<div className="border-b border-gray-100 p-6 dark:border-gray-700">
				<div className="flex items-start gap-4">
					{/* 网站Logo */}
					<div className="flex-shrink-0">
						{website.logo ? (
							<Image
								alt={`${website.name} Logo`}
								className="rounded-lg border border-gray-200"
								height={64}
								src={website.logo}
								width={64}
								onError={(e) => {
									const target = e.target as HTMLImageElement;

									target.style.display = 'none';
								}}
							/>
						) : (
							<div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700">
								<span className="text-xl font-bold text-white">
									{website.name.charAt(0).toUpperCase()}
								</span>
							</div>
						)}
					</div>

					{/* 网站基本信息 */}
					<div className="min-w-0 flex-1">
						<div className="flex items-start justify-between gap-4">
							<div className="flex-1">
								<h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
									{website.name}
								</h1>

								{/* 分类和标识 */}
								<div className="mb-3 flex items-center gap-2">
									<Badge
										className="text-white"
										style={{
											backgroundColor: website.category.color || '#6b7280'
										}}
										variant="secondary"
									>
										{website.category.icon && (
											<span className="mr-1">{website.category.icon}</span>
										)}
										{website.category.name}
									</Badge>

									{website.isRecommend && (
										<Badge
											className="border-orange-300 text-orange-600"
											variant="outline"
										>
											<Star className="mr-1 h-3 w-3" />
											推荐
										</Badge>
									)}

									{website.isFeatured && (
										<Badge
											className="border-purple-300 text-purple-600"
											variant="outline"
										>
											<Award className="mr-1 h-3 w-3" />
											精选
										</Badge>
									)}

									{website.isNSFW && (
										<Badge
											className="border-red-300 text-red-600"
											variant="outline"
										>
											<AlertTriangle className="mr-1 h-3 w-3" />
											NSFW
										</Badge>
									)}
								</div>

								{/* 统计信息 */}
						<div className="flex items-center gap-4 text-sm text-gray-700 dark:text-gray-300">
								<div className="flex items-center gap-1">
									<Eye className="h-4 w-4" />
									<span>{website.clickCount.toLocaleString()} 次访问</span>
								</div>
								<div className="flex items-center gap-1">
									<Heart className="h-4 w-4" />
									<span>{likeCount.toLocaleString()} 次点赞</span>
								</div>
								<div className="flex items-center gap-1">
									<Calendar className="h-4 w-4" />
									<span>
										收录于{' '}
										{format(new Date(website.createdAt), 'yyyy年MM月dd日', {
											locale: zhCN
										})}
									</span>
								</div>
							</div>
							</div>

							{/* 操作按钮 */}
						<div className="flex items-center gap-2">
							<Button 
								size="sm" 
								variant={liked ? "default" : "outline"}
								disabled={isLiking}
								onClick={handleLike}
								className={liked ? "bg-red-500 hover:bg-red-600 border-red-500" : ""}
								aria-label={liked ? "取消点赞" : "点赞"}
								title={liked ? "取消点赞" : "点赞"}
							>
								{isLiking ? (
									<div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
								) : (
									<Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
								)}
							</Button>

							<Button 
								size="sm" 
								variant="outline" 
								onClick={handleShare}
								aria-label="分享网站"
								title="分享网站"
							>
								<Share2 className="h-4 w-4" />
							</Button>

							<Button 
								size="sm" 
								variant="outline" 
								onClick={handleCopyLink}
								aria-label={mounted && copied ? "链接已复制" : "复制链接"}
								title={mounted && copied ? "链接已复制" : "复制链接"}
							>
								{mounted && copied ? (
									<Check className="h-4 w-4 text-green-600" />
								) : (
									<Copy className="h-4 w-4" />
								)}
							</Button>
						</div>
						</div>
					</div>
				</div>

				{/* 访问按钮或NSFW警告 */}
				<div className="mt-6">
					{mounted && website.isNSFW && !nsfwLoading && !nsfwEnabled ? (
						<Alert className="border-red-200 bg-red-50">
							<AlertTriangle className="h-4 w-4 text-red-600" />
							<AlertDescription className="text-red-800">
								此网站包含成人内容。要访问此网站，请先在设置中启用NSFW内容显示功能。
							</AlertDescription>
						</Alert>
					) : (
						<Button
							className="w-full sm:w-auto"
							disabled={isVisiting || (!mounted || nsfwLoading)}
							size="lg"
							onClick={handleVisit}
						>
							{isVisiting ? (
								<>
									<div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
									访问中...
								</>
							) : !mounted || nsfwLoading ? (
								<>
									<div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
									加载中...
								</>
							) : (
								<>
									<ExternalLink className="mr-2 h-4 w-4" />
									访问网站
								</>
							)}
						</Button>
					)}
				</div>
			</div>

			{/* 网站描述 */}
			{website.description && (
				<div className="border-b border-gray-100 p-6 dark:border-gray-700">
					<h2 className="mb-3 font-medium text-gray-900 dark:text-gray-100">网站介绍</h2>
					<p className="leading-relaxed whitespace-pre-wrap text-gray-700 dark:text-gray-300">
						{website.description}
					</p>
				</div>
			)}

			{/* 网站标签 */}
			{website.tags && website.tags.length > 0 && (
				<div className="border-b border-gray-100 p-6 dark:border-gray-700">
					<h2 className="mb-3 flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
						<Tag className="h-4 w-4" />
						相关标签
					</h2>
					<div className="flex flex-wrap gap-2">
						{website.tags.map(({ tag }) => (
							<Badge
								key={tag.id}
								className="text-gray-600"
								style={{
									borderColor: tag.color || '#d1d5db',
									color: tag.color || '#6b7280'
								}}
								variant="outline"
							>
								{tag.name}
							</Badge>
						))}
					</div>
				</div>
			)}

			{/* 访问统计图表 */}
			<div className="border-b border-gray-100 p-6 dark:border-gray-700">
				<WebsiteStatsChart websiteId={website.id} days={30} />
			</div>

			{/* 提交者信息 */}
			{website.submitter && (
				<div className="p-6">
					<h2 className="mb-3 flex items-center gap-2 font-medium text-gray-900 dark:text-gray-100">
						<User className="h-4 w-4" />
						提交者
					</h2>
					<div className="flex items-center gap-3">
						{website.submitter.avatar ? (
							<Image
								alt={website.submitter.name || website.submitter.username}
								className="rounded-full"
								height={32}
								src={website.submitter.avatar}
								width={32}
							/>
						) : (
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300">
								<span className="text-sm font-medium text-gray-600">
									{(website.submitter.name || website.submitter.username)
										.charAt(0)
										.toUpperCase()}
								</span>
							</div>
						)}
						<div>
							<p className="font-medium text-gray-900 dark:text-gray-100">
								{website.submitter.name || website.submitter.username}
							</p>
							<p className="text-sm text-gray-700 dark:text-gray-300">感谢分享优质资源</p>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
