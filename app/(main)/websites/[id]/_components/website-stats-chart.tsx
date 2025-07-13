'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, parseISO } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface StatsData {
	date: string;
	visits: number;
	mobileDevices: number;
	desktopDevices: number;
	totalDevices: number;
}

interface WebsiteStatsChartProps {
	websiteId: string;
	days?: number;
}

interface CustomTooltipProps {
	active?: boolean;
	payload?: Array<{
		value: number;
		dataKey: string;
		color: string;
	}>;
	label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
	if (active && payload && payload.length && label) {
		const date = parseISO(label);
		const formattedDate = format(date, 'yyyy年MM月dd日', { locale: zhCN });

		const getDataKeyLabel = (dataKey: string) => {
			switch (dataKey) {
				case 'visits': return '访问次数';
				case 'mobileDevices': return '移动设备';
				case 'desktopDevices': return '桌面设备';
				default: return '设备数量';
			}
		};

		return (
			<div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
				<p className="font-medium text-gray-900 dark:text-gray-100 mb-2">{formattedDate}</p>
				{payload.map((entry, index) => (
					<p key={index} className="text-sm" style={{ color: entry.color }}>
						{getDataKeyLabel(entry.dataKey)}: {entry.value}
					</p>
				))}
			</div>
		);
	}
	return null;
};

export default function WebsiteStatsChart({ websiteId, days = 30 }: WebsiteStatsChartProps) {
	const [data, setData] = useState<StatsData[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchStats = async () => {
			try {
				setLoading(true);
				setError(null);

				const response = await fetch(`/api/website/${websiteId}/stats?days=${days}`);
				if (!response.ok) {
					throw new Error('获取统计数据失败');
				}

				const result = await response.json();
				setData(result.stats);
			} catch (err) {
				setError(err instanceof Error ? err.message : '获取统计数据失败');
			} finally {
				setLoading(false);
			}
		};

		fetchStats();
	}, [websiteId, days]);

	if (loading) {
		return (
				<div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
					<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">访问统计</h2>
				<div className="flex items-center justify-center h-64">
					<div className="text-gray-700 dark:text-gray-300">加载中...</div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
				<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">访问统计</h2>
				<div className="flex items-center justify-center h-64">
					<div className="text-red-500">{error}</div>
				</div>
			</div>
		);
	}

	// 格式化X轴标签
	const formatXAxisLabel = (tickItem: string) => {
		const date = parseISO(tickItem);
		return format(date, 'MM/dd');
	};

	return (
		<div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6">
			<h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">访问统计</h2>
			<div className="h-64">
				<ResponsiveContainer width="100%" height="100%">
					<BarChart
						data={data}
						margin={{
							top: 5,
							right: 30,
							left: 20,
							bottom: 5,
						}}
					>
						<CartesianGrid strokeDasharray="3 3" className="opacity-30" />
						<XAxis
							dataKey="date"
							tickFormatter={formatXAxisLabel}
							className="text-xs text-gray-700 dark:text-gray-300"
						/>
						<YAxis className="text-xs text-gray-700 dark:text-gray-300" />
						<Tooltip content={<CustomTooltip />} />
						<Legend
							wrapperStyle={{
								color: 'rgb(107 114 128)',
								fontSize: '12px'
							}}
						/>
						<Bar
							dataKey="visits"
							fill="#3b82f6"
							name="访问次数"
							radius={[2, 2, 0, 0]}
						/>
						<Bar
							dataKey="mobileDevices"
							fill="#10b981"
							name="移动设备"
							radius={[2, 2, 0, 0]}
						/>
						<Bar
							dataKey="desktopDevices"
							fill="#f59e0b"
							name="桌面设备"
							radius={[2, 2, 0, 0]}
						/>
					</BarChart>
				</ResponsiveContainer>
			</div>
			<div className="mt-4 text-sm text-gray-700 dark:text-gray-300">
				<p>显示最近 {days} 天的访问数据</p>
				<p className="mt-1">• 蓝色条形表示访问次数，绿色条形表示移动设备数量，橙色条形表示桌面设备数量</p>
				<p className="mt-1">• 悬停在条形图上可查看具体数据</p>
			</div>
		</div>
	);
}