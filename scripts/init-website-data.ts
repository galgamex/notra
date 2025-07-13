import prisma from './prisma-client';

// 初始化网址导航站基础数据
async function initWebsiteData() {
	console.log('开始初始化网址导航站数据...');

	try {
		// 创建默认分类
		const defaultCategories = [
			{
				name: '搜索引擎',
				slug: 'search-engines',
				description: '各种搜索引擎和搜索工具',
				icon: '🔍',
				color: '#3B82F6',
				sortOrder: 1
			},
			{
				name: '社交媒体',
				slug: 'social-media',
				description: '社交网络和通讯平台',
				icon: '👥',
				color: '#10B981',
				sortOrder: 2
			},
			{
				name: '开发工具',
				slug: 'development-tools',
				description: '编程开发相关工具和资源',
				icon: '⚡',
				color: '#8B5CF6',
				sortOrder: 3
			},
			{
				name: '设计资源',
				slug: 'design-resources',
				description: '设计工具和素材资源',
				icon: '🎨',
				color: '#F59E0B',
				sortOrder: 4
			},
			{
				name: '学习教育',
				slug: 'education',
				description: '在线学习和教育平台',
				icon: '📚',
				color: '#EF4444',
				sortOrder: 5
			},
			{
				name: '娱乐休闲',
				slug: 'entertainment',
				description: '娱乐、游戏和休闲网站',
				icon: '🎮',
				color: '#06B6D4',
				sortOrder: 6
			},
			{
				name: '新闻资讯',
				slug: 'news',
				description: '新闻媒体和资讯网站',
				icon: '📰',
				color: '#84CC16',
				sortOrder: 7
			},
			{
				name: '购物电商',
				slug: 'shopping',
				description: '电商平台和购物网站',
				icon: '🛒',
				color: '#F97316',
				sortOrder: 8
			},
			{
				name: '工具软件',
				slug: 'tools',
				description: '实用工具和在线服务',
				icon: '🔧',
				color: '#6366F1',
				sortOrder: 9
			},
			{
				name: '其他',
				slug: 'others',
				description: '其他类型的网站',
				icon: '📂',
				color: '#6B7280',
				sortOrder: 10
			}
		];

		console.log('创建默认分类...');

		for (const category of defaultCategories) {
			await prisma.websiteCategory.upsert({
				where: { slug: category.slug },
				update: {},
				create: category
			});
		}

		// 创建默认标签
		const defaultTags = [
			{
				name: '免费',
				slug: 'free',
				description: '免费使用的网站和服务',
				color: '#10B981'
			},
			{
				name: '付费',
				slug: 'paid',
				description: '需要付费的网站和服务',
				color: '#F59E0B'
			},
			{
				name: '开源',
				slug: 'open-source',
				description: '开源项目和工具',
				color: '#8B5CF6'
			},
			{
				name: '中文',
				slug: 'chinese',
				description: '中文网站和服务',
				color: '#EF4444'
			},
			{
				name: '英文',
				slug: 'english',
				description: '英文网站和服务',
				color: '#3B82F6'
			},
			{
				name: '移动端',
				slug: 'mobile',
				description: '移动端应用和服务',
				color: '#06B6D4'
			},
			{
				name: 'API',
				slug: 'api',
				description: '提供API接口的服务',
				color: '#84CC16'
			},
			{
				name: '云服务',
				slug: 'cloud',
				description: '云计算和云服务',
				color: '#F97316'
			},
			{
				name: 'AI',
				slug: 'ai',
				description: '人工智能相关服务',
				color: '#6366F1'
			},
			{
				name: '热门',
				slug: 'popular',
				description: '热门和流行的网站',
				color: '#EC4899'
			}
		];

		console.log('创建默认标签...');

		for (const tag of defaultTags) {
			await prisma.websiteTagEntity.upsert({
				where: { slug: tag.slug },
				update: {},
				create: tag
			});
		}

		// 获取创建的分类和标签
		const searchCategory = await prisma.websiteCategory.findUnique({
			where: { slug: 'search-engines' }
		});
		const socialCategory = await prisma.websiteCategory.findUnique({
			where: { slug: 'social-media' }
		});
		const devCategory = await prisma.websiteCategory.findUnique({
			where: { slug: 'development-tools' }
		});

		const freeTag = await prisma.websiteTagEntity.findUnique({
			where: { slug: 'free' }
		});
		const popularTag = await prisma.websiteTagEntity.findUnique({
			where: { slug: 'popular' }
		});
		const chineseTag = await prisma.websiteTagEntity.findUnique({
			where: { slug: 'chinese' }
		});
		const englishTag = await prisma.websiteTagEntity.findUnique({
			where: { slug: 'english' }
		});

		// 创建示例网站
		if (
			searchCategory &&
			socialCategory &&
			devCategory &&
			freeTag &&
			popularTag &&
			chineseTag &&
			englishTag
		) {
			const sampleWebsites = [
				{
					name: 'Google',
					url: 'https://www.google.com',
					description: '全球最大的搜索引擎',
					logo: 'https://www.google.com/favicon.ico',
					categoryId: searchCategory.id,
					status: 'APPROVED' as const,
					isRecommend: true,
					isFeatured: true,
					sortOrder: 1,
					tagIds: [freeTag.id, popularTag.id, englishTag.id]
				},
				{
					name: '百度',
					url: 'https://www.baidu.com',
					description: '中国最大的搜索引擎',
					logo: 'https://www.baidu.com/favicon.ico',
					categoryId: searchCategory.id,
					status: 'APPROVED' as const,
					isRecommend: true,
					sortOrder: 2,
					tagIds: [freeTag.id, popularTag.id, chineseTag.id]
				},
				{
					name: 'GitHub',
					url: 'https://github.com',
					description: '全球最大的代码托管平台',
					logo: 'https://github.com/favicon.ico',
					categoryId: devCategory.id,
					status: 'APPROVED' as const,
					isRecommend: true,
					isFeatured: true,
					sortOrder: 1,
					tagIds: [freeTag.id, popularTag.id, englishTag.id]
				},
				{
					name: 'Twitter',
					url: 'https://twitter.com',
					description: '全球知名的社交媒体平台',
					logo: 'https://twitter.com/favicon.ico',
					categoryId: socialCategory.id,
					status: 'APPROVED' as const,
					isRecommend: true,
					sortOrder: 1,
					tagIds: [freeTag.id, popularTag.id, englishTag.id]
				}
			];

			console.log('创建示例网站...');
			const createdWebsites = [];

			for (const website of sampleWebsites) {
				const { tagIds, ...websiteData } = website;

				const existingWebsite = await prisma.website.findFirst({
					where: { url: website.url }
				});

				if (!existingWebsite) {
					const createdWebsite = await prisma.website.create({
						data: {
							...websiteData,
							clickCount: Math.floor(Math.random() * 1000) + 100, // 随机点击数 100-1099
							tags: {
								create: tagIds.map((tagId) => ({
									tagId
								}))
							}
						}
					});

					createdWebsites.push(createdWebsite);
				}
			}

			// 创建示例点击记录
			console.log('创建示例点击记录...');

			for (const website of createdWebsites) {
				// 为每个网站创建一些随机点击记录
				const clickCount = Math.floor(Math.random() * 50) + 10; // 10-59条点击记录

				for (let i = 0; i < clickCount; i++) {
					const randomDate = new Date();

					randomDate.setDate(
						randomDate.getDate() - Math.floor(Math.random() * 30)
					); // 过去30天内的随机日期

					await prisma.websiteClick.create({
						data: {
							websiteId: website.id,
							ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
							userAgent:
								'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
							referer: 'https://example.com',
							createdAt: randomDate
						}
					});
				}
			}
		}

		console.log('网址导航站数据初始化完成！');
	} catch (error) {
		console.error('初始化数据失败:', error);

		throw error;
	} finally {
		await prisma.$disconnect();
	}
}

// 如果直接运行此脚本
if (require.main === module) {
	initWebsiteData()
		.then(() => {
			console.log('初始化完成');
			process.exit(0);
		})
		.catch((error) => {
			console.error('初始化失败:', error);
			process.exit(1);
		});
}

export default initWebsiteData;
