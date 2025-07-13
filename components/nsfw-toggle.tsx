'use client';

import { AlertTriangle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface NSFWToggleProps {
	className?: string;
}

export function NSFWToggle({ className }: NSFWToggleProps) {
	const [nsfwEnabled, setNsfwEnabled] = useState(false);
	const [loading, setLoading] = useState(true);
	const [showWarning, setShowWarning] = useState(false);
	const [pendingValue, setPendingValue] = useState(false);

	// 获取当前NSFW设置
	useEffect(() => {

		const fetchNSFWPreference = async () => {

			try {
				const response = await fetch('/api/user/nsfw-preference');

				if (response.ok) {
					const data = await response.json();

					setNsfwEnabled(data.nsfwEnabled);
				}
			} catch (error) {
				console.error('获取NSFW偏好失败:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchNSFWPreference();
	}, []);

	// 处理切换
	const handleToggle = (checked: boolean) => {
		if (checked && !nsfwEnabled) {
			// 启用NSFW时显示警告
			setPendingValue(true);
			setShowWarning(true);
		} else {
			// 禁用NSFW时直接更新
			updateNSFWPreference(checked);
		}
	};

	// 更新NSFW偏好
	const updateNSFWPreference = async (enabled: boolean) => {
		try {
			const response = await fetch('/api/user/nsfw-preference', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ nsfwEnabled: enabled }),
			});

			if (response.ok) {
				setNsfwEnabled(enabled);
				toast.success(enabled ? 'NSFW内容已启用' : 'NSFW内容已禁用');
				// 刷新页面以应用新设置
				window.location.reload();
			} else {
				throw new Error('更新失败');
			}
		} catch (error) {
			console.error('更新NSFW偏好失败:', error);
			toast.error('设置更新失败，请重试');
		}
	};

	// 确认启用NSFW
	const confirmEnableNSFW = () => {
		setShowWarning(false);
		updateNSFWPreference(pendingValue);
	};

	// 取消启用NSFW
	const cancelEnableNSFW = () => {
		setShowWarning(false);
		setPendingValue(false);
	};

	if (loading) {
		return (
			<div className={`flex items-center space-x-2 ${className}`}>
				<div className="h-5 w-9 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
				<Label className="text-sm text-gray-500">加载中...</Label>
			</div>
		);
	}

	return (
		<>
			<div className={`flex items-center space-x-2 ${className}`}>
				<Switch
					checked={nsfwEnabled}
					id="nsfw-toggle"
					onCheckedChange={handleToggle}
				/>
				<Label className="cursor-pointer text-sm font-medium" htmlFor="nsfw-toggle">
					显示NSFW内容
				</Label>
				{nsfwEnabled && (
					<AlertTriangle className="h-4 w-4 text-amber-500" />
				)}
			</div>

			<AlertDialog open={showWarning} onOpenChange={setShowWarning}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle className="flex items-center gap-2">
							<AlertTriangle className="h-5 w-5 text-amber-500" />
							内容警告
						</AlertDialogTitle>
						<AlertDialogDescription>
							您即将启用NSFW（Not Safe For Work）内容显示。这些内容可能包含成人或敏感材料，不适合在工作场所或公共场合浏览。
							<br /><br />
							请确认您已年满18岁且同意查看此类内容。
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel onClick={cancelEnableNSFW}>
							取消
						</AlertDialogCancel>
						<AlertDialogAction onClick={confirmEnableNSFW}>
							我已满18岁，继续
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}

export default NSFWToggle;