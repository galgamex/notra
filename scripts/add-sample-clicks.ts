import prisma from './prisma-client';

// 为现有网站添加示例点击数据
async function addSampleClicks() {
	console.log('开始为现有网站添加示例点击数据...');

	try {
		// 获取所有已批准的网站
		const websites = await prisma.website.findMany({
			where: {
				status: 'APPROVED'
			}
		});

		console.log(`找到 ${websites.length} 个已批准的网站`);

		for (const website of websites) {
			// 检查是否已有点击记录
			const existingClickCount = await prisma.websiteClick.count({
				where: { websiteId: website.id }
			});

			if (existingClickCount === 0) {
				console.log(`为网站 "${website.name}" 添加示例点击数据...`);

				// 生成随机点击数
				const randomClickCount = Math.floor(Math.random() * 1000) + 100; // 100-1099

				// 更新网站的点击计数
				await prisma.website.update({
					where: { id: website.id },
					data: { clickCount: randomClickCount }
				});

				// 创建点击记录（创建实际点击数的一部分作为详细记录）
				const detailRecordCount = Math.floor(randomClickCount * 0.1) + 10; // 约10%的详细记录

				for (let i = 0; i < detailRecordCount; i++) {
					const randomDate = new Date();

					randomDate.setDate(
						randomDate.getDate() - Math.floor(Math.random() * 30)
					); // 过去30天内的随机日期

					await prisma.websiteClick.create({
						data: {
							websiteId: website.id,
							ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
							userAgent:
								'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
							referer:
								Math.random() > 0.5
									? 'https://www.google.com'
									: 'https://www.baidu.com',
							createdAt: randomDate
						}
					});
				}

				console.log(
					`  - 添加了 ${randomClickCount} 次点击计数和 ${detailRecordCount} 条详细记录`
				);
			} else {
				console.log(
					`网站 "${website.name}" 已有 ${existingClickCount} 条点击记录，跳过`
				);
			}
		}

		console.log('示例点击数据添加完成！');
	} catch (error) {
		console.error('添加示例点击数据失败:', error);

		throw error;
	} finally {
		await prisma.$disconnect();
	}
}

// 如果直接运行此脚本
if (require.main === module) {
	addSampleClicks()
		.then(() => {
			console.log('添加完成');
			process.exit(0);
		})
		.catch((error) => {
			console.error('添加失败:', error);
			process.exit(1);
		});
}

export default addSampleClicks;
