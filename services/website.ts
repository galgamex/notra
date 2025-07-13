import { WebsiteStatus } from '@prisma/client';

import prisma from '@/lib/prisma';
import type {
	CreateWebsiteFormValues,
	UpdateWebsiteFormValues,
	CreateWebsiteCategoryFormValues,
	UpdateWebsiteCategoryFormValues,
	CreateWebsiteTagFormValues,
	UpdateWebsiteTagFormValues,
	WebsiteListQuery,
	WebsiteCategoryListQuery,
	WebsiteTagListQuery,
	WebsiteReviewFormValues,
	WebsiteSubmissionFormValues,
	WebsiteClickQuery,
	WebsiteStats
} from '@/types/website';

class WebsiteService {
	// ==================== 网站管理 ====================

	// 创建网站
	static async createWebsite(
		data: CreateWebsiteFormValues,
		submitterId?: string
	) {
		const { tagIds, ...websiteData } = data;

		const website = await prisma.website.create({
			data: {
				...websiteData,
				submitterId,
				tags: {
					create: tagIds.map((tagId) => ({
						tagId
					}))
				}
			},
			include: {
				category: true,
				submitter: {
					select: {
						id: true,
						username: true,
						name: true,
						avatar: true
					}
				},
				reviewer: {
					select: {
						id: true,
						username: true,
						name: true,
						avatar: true
					}
				},
				tags: {
					include: {
						tag: true
					}
				},
				_count: {
						select: {
							clicks: true,
							likes: true
						}
					}
			}
		});

		return website;
	}

	// 更新网站
	static async updateWebsite(data: UpdateWebsiteFormValues) {
		const { id, tagIds, ...updateData } = data;

		const website = await prisma.website.update({
			where: { id },
			data: {
				...updateData,
				...(tagIds && {
					tags: {
						deleteMany: {},
						create: tagIds.map((tagId) => ({
							tagId
						}))
					}
				})
			},
			include: {
				category: true,
				submitter: {
					select: {
						id: true,
						username: true,
						name: true,
						avatar: true
					}
				},
				reviewer: {
					select: {
						id: true,
						username: true,
						name: true,
						avatar: true
					}
				},
				tags: {
					include: {
						tag: true
					}
				},
				_count: {
					select: {
						clicks: true,
						likes: true
					}
				}
			}
		});

		return website;
	}

	// 删除网站
	static async deleteWebsite(id: string) {
		await prisma.website.delete({
			where: { id }
		});
	}

	// 根据ID获取网站
	static async getWebsiteById(id: string) {
		const website = await prisma.website.findUnique({
			where: { id },
			include: {
				category: true,
				submitter: {
					select: {
						id: true,
						username: true,
						name: true,
						avatar: true
					}
				},
				reviewer: {
					select: {
						id: true,
						username: true,
						name: true,
						avatar: true
					}
				},
				tags: {
					include: {
						tag: true
					}
				},
				_count: {
					select: {
						clicks: true,
						likes: true
					}
				}
			}
		});

		return website;
	}

	// 获取网站列表
	static async getWebsites(query: WebsiteListQuery = {}) {
		const {
			page = 1,
			limit = 10,
			categoryId,
			tagId,
			status,
			search,
			submitterId,
			isRecommend,
			isFeatured,
			isNSFW,
			sortBy = 'createdAt',
			sortOrder = 'desc'
		} = query;

		const skip = (page - 1) * limit;

		const where: Record<string, unknown> = {};

		if (categoryId) {
			where.categoryId = categoryId;
		}

		if (tagId) {
			where.tags = {
				some: {
					tagId
				}
			};
		}

		if (status) {
			where.status = status;
		}

		if (search) {
			where.OR = [
				{ name: { contains: search, mode: 'insensitive' } },
				{ description: { contains: search, mode: 'insensitive' } },
				{ url: { contains: search, mode: 'insensitive' } }
			];
		}

		if (submitterId) {
			where.submitterId = submitterId;
		}

		if (typeof isRecommend === 'boolean') {
			where.isRecommend = isRecommend;
		}

		if (typeof isFeatured === 'boolean') {
			where.isFeatured = isFeatured;
		}

		if (typeof isNSFW === 'boolean') {
			where.isNSFW = isNSFW;
		}

		const orderBy: Record<string, string> = {};

		orderBy[sortBy] = sortOrder;

		const [websites, total] = await Promise.all([
			prisma.website.findMany({
				where,
				skip,
				take: limit,
				orderBy,
				include: {
					category: true,
					submitter: {
						select: {
							id: true,
							username: true,
							name: true,
							avatar: true
						}
					},
					reviewer: {
						select: {
							id: true,
							username: true,
							name: true,
							avatar: true
						}
					},
					tags: {
						include: {
							tag: true
						}
					},
					_count: {
						select: {
							clicks: true,
							likes: true
						}
					}
				}
			}),
			prisma.website.count({ where })
		]);

		const totalPages = Math.ceil(total / limit);

		return {
			websites,
			total,
			page,
			limit,
			totalPages
		};
	}

	// 审核网站
	static async reviewWebsite(
		data: WebsiteReviewFormValues,
		reviewerId: string
	) {
		const { id, status } = data;

		const website = await prisma.website.update({
			where: { id },
			data: {
				status,
				reviewerId,
				reviewedAt: new Date()
			},
			include: {
				category: true,
				submitter: {
					select: {
						id: true,
						username: true,
						name: true,
						avatar: true
					}
				},
				reviewer: {
					select: {
						id: true,
						username: true,
						name: true,
						avatar: true
					}
				},
				tags: {
					include: {
						tag: true
					}
				},
				_count: {
					select: {
						clicks: true,
						likes: true
					}
				}
			}
		});

		return website;
	}

	// 提交网站（公开接口）
	static async submitWebsite(
		data: WebsiteSubmissionFormValues,
		submitterId?: string
	) {
		const { tagIds = [], ...websiteData } = data;

		const website = await prisma.website.create({
			data: {
				...websiteData,
				submitterId,
				status: WebsiteStatus.PENDING,
				tags: {
					create: tagIds.map((tagId) => ({
						tagId
					}))
				}
			},
			include: {
				category: true,
				submitter: {
					select: {
						id: true,
						username: true,
						name: true,
						avatar: true
					}
				},
				tags: {
					include: {
						tag: true
					}
				}
			}
		});

		return website;
	}

	// ==================== 分类管理 ====================

	// 创建分类
	static async createCategory(data: CreateWebsiteCategoryFormValues) {
		// 如果有父分类，设置层级为1，否则为0
		const level = data.parentId ? 1 : 0;

		const category = await prisma.websiteCategory.create({
			data: {
				...data,
				level
			},
			include: {
				parent: data.parentId
					? {
							select: {
								id: true,
								name: true,
								slug: true
							}
						}
					: undefined,
				_count: {
					select: {
						websites: true
					}
				}
			}
		});

		return category;
	}

	// 更新分类
	static async updateCategory(data: UpdateWebsiteCategoryFormValues) {
		const { id, ...updateData } = data;

		const category = await prisma.websiteCategory.update({
			where: { id },
			data: updateData,
			include: {
				_count: {
					select: {
						websites: true
					}
				}
			}
		});

		return category;
	}

	// 删除分类
	static async deleteCategory(id: string) {
		await prisma.websiteCategory.delete({
			where: { id }
		});
	}

	// 根据ID获取分类
	static async getCategoryById(id: string) {
		const category = await prisma.websiteCategory.findUnique({
			where: { id },
			include: {
				_count: {
					select: {
						websites: true
					}
				}
			}
		});

		return category;
	}

	// 根据slug获取分类
	static async getCategoryBySlug(slug: string) {
		const category = await prisma.websiteCategory.findUnique({
			where: { slug },
			include: {
				parent: {
					select: {
						id: true,
						name: true,
						slug: true
					}
				},
				children: {
					where: { isVisible: true },
					orderBy: { sortOrder: 'asc' },
					include: {
						_count: {
							select: {
								websites: true
							}
						}
					}
				},
				_count: {
					select: {
						websites: true
					}
				}
			}
		});

		return category;
	}

	// 获取分类树（层级结构）
	static async getCategoryTree() {
		const categories = await prisma.websiteCategory.findMany({
			where: {
				isVisible: true,
				level: 0 // 只获取一级分类
			},
			orderBy: { sortOrder: 'asc' },
			include: {
				children: {
					where: { isVisible: true },
					orderBy: { sortOrder: 'asc' },
					include: {
						_count: {
							select: {
								websites: true
							}
						}
					}
				},
				_count: {
					select: {
						websites: true
					}
				}
			}
		});

		return categories;
	}

	// 获取指定分类的子分类
	static async getSubCategories(parentId: string) {
		return await prisma.websiteCategory.findMany({
			where: { parentId, isVisible: true },
			orderBy: { sortOrder: 'asc' },
			include: {
				_count: {
					select: {
						websites: true
					}
				}
			}
		});
	}

	// 获取分类列表
	static async getCategories(query: WebsiteCategoryListQuery = {}) {
		const {
			page = 1,
			limit = 10,
			search,
			isVisible,
			level,
			parentId,
			sortBy = 'sortOrder',
			sortOrder = 'asc'
		} = query;

		const skip = (page - 1) * limit;

		const where: Record<string, unknown> = {};

		if (search) {
			where.OR = [
				{ name: { contains: search, mode: 'insensitive' } },
				{ description: { contains: search, mode: 'insensitive' } }
			];
		}

		if (typeof isVisible === 'boolean') {
			where.isVisible = isVisible;
		}

		if (typeof level === 'number') {
			where.level = level;
		}

		if (parentId) {
			where.parentId = parentId;
		}

		const orderBy: Record<string, string> = {};

		orderBy[sortBy] = sortOrder;

		const [categories, total] = await Promise.all([
			prisma.websiteCategory.findMany({
				where,
				skip,
				take: limit,
				orderBy,
				include: {
					_count: {
						select: {
							websites: true
						}
					}
				}
			}),
			prisma.websiteCategory.count({ where })
		]);

		const totalPages = Math.ceil(total / limit);

		return {
			categories,
			total,
			page,
			limit,
			totalPages
		};
	}

	// ==================== 标签管理 ====================

	// 创建标签
	static async createTag(data: CreateWebsiteTagFormValues) {
		const tag = await prisma.websiteTagEntity.create({
			data,
			include: {
				_count: {
					select: {
						websites: true
					}
				}
			}
		});

		return tag;
	}

	// 更新标签
	static async updateTag(data: UpdateWebsiteTagFormValues) {
		const { id, ...updateData } = data;

		const tag = await prisma.websiteTagEntity.update({
			where: { id },
			data: updateData,
			include: {
				_count: {
					select: {
						websites: true
					}
				}
			}
		});

		return tag;
	}

	// 删除标签
	static async deleteTag(id: string) {
		await prisma.websiteTagEntity.delete({
			where: { id }
		});
	}

	// 根据ID获取标签
	static async getTagById(id: string) {
		const tag = await prisma.websiteTagEntity.findUnique({
			where: { id },
			include: {
				_count: {
					select: {
						websites: true
					}
				}
			}
		});

		return tag;
	}

	// 获取标签列表
	static async getTags(query: WebsiteTagListQuery = {}) {
		const {
			page = 1,
			limit = 10,
			search,
			sortBy = 'createdAt',
			sortOrder = 'desc'
		} = query;

		const skip = (page - 1) * limit;

		const where: Record<string, unknown> = {};

		if (search) {
			where.OR = [
				{ name: { contains: search, mode: 'insensitive' } },
				{ description: { contains: search, mode: 'insensitive' } }
			];
		}

		const orderBy: Record<string, string> = {};

		orderBy[sortBy] = sortOrder;

		const [tags, total] = await Promise.all([
			prisma.websiteTagEntity.findMany({
				where,
				skip,
				take: limit,
				orderBy,
				include: {
					_count: {
						select: {
							websites: true
						}
					}
				}
			}),
			prisma.websiteTagEntity.count({ where })
		]);

		const totalPages = Math.ceil(total / limit);

		return {
			tags,
			total,
			page,
			limit,
			totalPages
		};
	}

	// ==================== 点击统计 ====================

	// 记录网站点击
	static async recordClick(data: {
		websiteId: string;
		userId?: string;
		ipAddress?: string;
		userAgent?: string;
		referrer?: string;
	}) {
		const { websiteId, userId, ipAddress, userAgent, referrer } = data;

		// 更新网站点击计数
		await prisma.website.update({
			where: { id: websiteId },
			data: {
				clickCount: {
					increment: 1
				}
			}
		});

		// 记录点击详情
		const click = await prisma.websiteClick.create({
			data: {
				websiteId,
				userId,
				ipAddress,
				userAgent,
				referer: referrer
			},
			include: {
				website: {
					select: {
						id: true,
						name: true,
						url: true
					}
				},
				user: {
					select: {
						id: true,
						username: true,
						name: true
					}
				}
			}
		});

		return click;
	}

	// 获取点击记录
	static async getClicks(query: WebsiteClickQuery = {}) {
		const {
			websiteId,
			userId,
			startDate,
			endDate,
			page = 1,
			limit = 10
		} = query;

		const skip = (page - 1) * limit;

		const where: Record<string, unknown> = {};

		if (websiteId) {
			where.websiteId = websiteId;
		}

		if (userId) {
			where.userId = userId;
		}

		if (startDate || endDate) {
			const dateFilter: { gte?: Date; lte?: Date } = {};

			if (startDate) {
				dateFilter.gte = startDate;
			}

			if (endDate) {
				dateFilter.lte = endDate;
			}

			where.createdAt = dateFilter;
		}

		const [clicks, total] = await Promise.all([
			prisma.websiteClick.findMany({
				where,
				skip,
				take: limit,
				orderBy: {
					createdAt: 'desc'
				},
				include: {
					website: {
						select: {
							id: true,
							name: true,
							url: true
						}
					},
					user: {
						select: {
							id: true,
							username: true,
							name: true
						}
					}
				}
			}),
			prisma.websiteClick.count({ where })
		]);

		const totalPages = Math.ceil(total / limit);

		return {
			clicks,
			total,
			page,
			limit,
			totalPages
		};
	}

	// ==================== 统计信息 ====================

	// 获取网站统计信息
	static async getStats(): Promise<WebsiteStats> {
		const [websiteStats, categoryCount, tagCount, clickCount] =
			await Promise.all([
				prisma.website.groupBy({
					by: ['status'],
					_count: {
						id: true
					}
				}),
				prisma.websiteCategory.count(),
				prisma.websiteTagEntity.count(),
				prisma.websiteClick.count()
			]);

		const [recommendedCount, featuredCount] = await Promise.all([
			prisma.website.count({ where: { isRecommend: true } }),
			prisma.website.count({ where: { isFeatured: true } })
		]);

		const stats: WebsiteStats = {
			totalWebsites: 0,
			approvedWebsites: 0,
			pendingWebsites: 0,
			rejectedWebsites: 0,
			disabledWebsites: 0,
			totalCategories: categoryCount,
			totalTags: tagCount,
			totalClicks: clickCount,
			recommendedWebsites: recommendedCount,
			featuredWebsites: featuredCount
		};

		websiteStats.forEach((stat) => {
			stats.totalWebsites += stat._count.id;

			switch (stat.status) {
				case WebsiteStatus.APPROVED:
					stats.approvedWebsites = stat._count.id;
					break;
				case WebsiteStatus.PENDING:
					stats.pendingWebsites = stat._count.id;
					break;
				case WebsiteStatus.REJECTED:
					stats.rejectedWebsites = stat._count.id;
					break;
				case WebsiteStatus.DISABLED:
					stats.disabledWebsites = stat._count.id;
					break;
			}
		});

		return stats;
	}

	// 获取热门网站
	static async getPopularWebsites(limit: number = 10, includeNSFW: boolean = false) {
		const where: { status: WebsiteStatus; isNSFW?: boolean } = {
			status: WebsiteStatus.APPROVED
		};

		if (!includeNSFW) {
			where.isNSFW = false;
		}

		const websites = await prisma.website.findMany({
			where,
			take: limit,
			orderBy: {
				clickCount: 'desc'
			},
			select: {
				id: true,
				name: true,
				url: true,
				logo: true,
				clickCount: true,
				category: {
					select: {
						name: true,
						color: true
					}
				}
			}
		});

		return websites;
	}

	// 获取最新网站
	static async getRecentWebsites(limit: number = 10, includeNSFW: boolean = false) {
		const where: { status: WebsiteStatus; isNSFW?: boolean } = {
			status: WebsiteStatus.APPROVED
		};

		if (!includeNSFW) {
			where.isNSFW = false;
		}

		const websites = await prisma.website.findMany({
			where,
			take: limit,
			orderBy: {
				createdAt: 'desc'
			},
			select: {
				id: true,
				name: true,
				url: true,
				description: true,
				logo: true,
				createdAt: true,
				category: {
					select: {
						name: true,
						color: true
					}
				}
			}
		});

		return websites;
	}

	// 搜索网站建议
	static async searchSuggestions(query: string, limit: number = 5, includeNSFW: boolean = false) {
		const where: { status: WebsiteStatus; isNSFW?: boolean; OR: Array<{ name?: { contains: string; mode: 'insensitive' }; description?: { contains: string; mode: 'insensitive' } }> } = {
			status: WebsiteStatus.APPROVED,
			OR: [
				{ name: { contains: query, mode: 'insensitive' } },
				{ description: { contains: query, mode: 'insensitive' } }
			]
		};

		if (!includeNSFW) {
			where.isNSFW = false;
		}

		const websites = await prisma.website.findMany({
			where,
			take: limit,
			select: {
				id: true,
				name: true,
				url: true,
				description: true,
				logo: true,
				category: {
					select: {
						name: true,
						color: true
					}
				}
			}
		});

		return websites;
	}
}

export default WebsiteService;
