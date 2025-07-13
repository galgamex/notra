import { WebsiteStatus } from '@prisma/client';

// 基础类型定义
export interface WebsiteWithDetails {
	id: string;
	name: string;
	url: string;
	description?: string | null;
	logo?: string | null;
	favicon?: string | null;
	screenshot?: string | null;
	status: WebsiteStatus;
	clickCount: number;
	sortOrder: number;
	isRecommend: boolean;
	isFeatured: boolean;
	reviewedAt?: Date | null;
	createdAt: Date;
	updatedAt: Date;
	categoryId: string;
	submitterId?: string | null;
	reviewerId?: string | null;
	category: {
		id: string;
		name: string;
		slug: string;
		description?: string | null;
		icon?: string | null;
		color?: string | null;
	};
	submitter?: {
		id: string;
		username: string;
		name?: string | null;
		avatar?: string | null;
	} | null;
	reviewer?: {
		id: string;
		username: string;
		name?: string | null;
		avatar?: string | null;
	} | null;
	tags: {
		tag: {
			id: string;
			name: string;
			slug: string;
			color?: string | null;
		};
	}[];
	_count: {
		clicks: number;
	};
}

export interface WebsiteCategoryWithDetails {
	id: string;
	name: string;
	slug: string;
	description?: string | null;
	icon?: string | null;
	color?: string | null;
	sortOrder: number;
	isVisible: boolean;
	parentId?: string | null;
	level: number;
	createdAt: Date;
	updatedAt: Date;
	parent?: {
		id: string;
		name: string;
		slug: string;
	} | null;
	children?: WebsiteCategoryWithDetails[];
	_count: {
		websites: number;
	};
}

export interface WebsiteTagWithDetails {
	id: string;
	name: string;
	slug: string;
	description?: string | null;
	color?: string | null;
	createdAt: Date;
	updatedAt: Date;
	_count: {
		websites: number;
	};
}

export interface WebsiteClickWithDetails {
	id: string;
	websiteId: string;
	userId?: string | null;
	ipAddress?: string | null;
	userAgent?: string | null;
	referer?: string | null;
	createdAt: Date;
	website: {
		id: string;
		name: string;
		url: string;
	};
	user?: {
		id: string;
		username: string;
		name?: string | null;
	} | null;
}

// 表单类型定义
export interface CreateWebsiteFormValues {
	name: string;
	url: string;
	description?: string;
	logo?: string;
	favicon?: string;
	screenshot?: string;
	categoryId: string;
	tagIds: string[];
	isRecommend?: boolean;
	isFeatured?: boolean;
	sortOrder?: number;
}

export interface UpdateWebsiteFormValues extends CreateWebsiteFormValues {
	id: string;
	status?: WebsiteStatus;
}

export interface CreateWebsiteCategoryFormValues {
	name: string;
	slug: string;
	description?: string;
	icon?: string;
	color?: string;
	parentId?: string;
	sortOrder?: number;
	isVisible?: boolean;
}

export interface UpdateWebsiteCategoryFormValues
	extends CreateWebsiteCategoryFormValues {
	id: string;
}

export interface CreateWebsiteTagFormValues {
	name: string;
	slug: string;
	description?: string;
	color?: string;
}

export interface UpdateWebsiteTagFormValues extends CreateWebsiteTagFormValues {
	id: string;
}

// 查询类型定义
export interface WebsiteListQuery {
	page?: number;
	limit?: number;
	categoryId?: string;
	tagId?: string;
	status?: WebsiteStatus;
	search?: string;
	submitterId?: string;
	isRecommend?: boolean;
	isFeatured?: boolean;
	sortBy?: 'createdAt' | 'updatedAt' | 'clickCount' | 'sortOrder' | 'name';
	sortOrder?: 'asc' | 'desc';
}

export interface WebsiteListResponse {
	websites: WebsiteWithDetails[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface WebsiteCategoryListQuery {
	page?: number;
	limit?: number;
	search?: string;
	isVisible?: boolean;
	sortBy?: 'createdAt' | 'updatedAt' | 'sortOrder' | 'name';
	sortOrder?: 'asc' | 'desc';
	level?: number;
	parentId?: string;
}

export interface WebsiteCategoryListResponse {
	categories: WebsiteCategoryWithDetails[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export interface WebsiteTagListQuery {
	page?: number;
	limit?: number;
	search?: string;
	sortBy?: 'createdAt' | 'updatedAt' | 'name';
	sortOrder?: 'asc' | 'desc';
}

export interface WebsiteTagListResponse {
	tags: WebsiteTagWithDetails[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

// 统计类型定义
export interface WebsiteStats {
	totalWebsites: number;
	approvedWebsites: number;
	pendingWebsites: number;
	rejectedWebsites: number;
	disabledWebsites: number;
	totalCategories: number;
	totalTags: number;
	totalClicks: number;
	recommendedWebsites: number;
	featuredWebsites: number;
}

// 审核相关类型
export interface WebsiteReviewFormValues {
	id: string;
	status: WebsiteStatus;
	reviewNote?: string;
}

// 网站提交表单类型
export interface WebsiteSubmissionFormValues {
	name: string;
	url: string;
	description?: string;
	categoryId: string;
	tagIds?: string[];
	submitterEmail?: string;
	submitterName?: string;
}

// 点击统计查询类型
export interface WebsiteClickQuery {
	websiteId?: string;
	userId?: string;
	startDate?: Date;
	endDate?: Date;
	page?: number;
	limit?: number;
}

export interface WebsiteClickResponse {
	clicks: WebsiteClickWithDetails[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

// 网站搜索建议类型
export interface WebsiteSearchSuggestion {
	id: string;
	name: string;
	url: string;
	description?: string | null;
	logo?: string | null;
	category: {
		name: string;
		color?: string | null;
	};
}

// 热门网站类型
export interface PopularWebsite {
	id: string;
	name: string;
	url: string;
	logo?: string | null;
	clickCount: number;
	category: {
		name: string;
		color?: string | null;
	};
}

// 最新网站类型
export interface RecentWebsite {
	id: string;
	name: string;
	url: string;
	description?: string | null;
	logo?: string | null;
	createdAt: Date;
	category: {
		name: string;
		color?: string | null;
	};
}
