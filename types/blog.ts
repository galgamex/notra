import { PostStatus } from '@prisma/client';

// 基础类型定义
export interface PostWithDetails {
	id: string;
	title: string;
	slug: string;
	content: string;
	excerpt?: string | null;
	coverImage?: string | null;
	status: PostStatus;
	viewCount: number;
	publishedAt?: Date | null;
	createdAt: Date;
	updatedAt: Date;
	authorId: string;
	categoryId?: string | null;
	author: {
		id: string;
		username: string;
		name?: string | null;
		avatar?: string | null;
	};
	category?: {
		id: string;
		name: string;
		slug: string;
		description?: string | null;
		color?: string | null;
	} | null;
	tags: {
		tag: {
			id: string;
			name: string;
			slug: string;
			color?: string | null;
		};
	}[];
	comments?: CommentWithDetails[];
	_count: {
		comments: number;
	};
}

export interface CategoryWithDetails {
	id: string;
	name: string;
	slug: string;
	description?: string;
	color?: string;
	createdAt: Date;
	updatedAt: Date;
	_count: {
		posts: number;
	};
}

export interface TagWithDetails {
	id: string;
	name: string;
	slug: string;
	color?: string;
	createdAt: Date;
	updatedAt: Date;
	_count: {
		posts: number;
	};
}

export interface CommentWithDetails {
	id: string;
	content: string;
	createdAt: Date;
	updatedAt: Date;
	authorId: string;
	postId: string;
	parentId: string | null;
	author: {
		id: string;
		username: string;
		name: string | null;
		avatar: string | null;
	};
	replies?: CommentWithDetails[];
	_count: {
		replies: number;
	};
}

// 表单类型定义
export interface CreatePostFormValues {
	title: string;
	slug: string;
	content: string;
	excerpt?: string;
	coverImage?: string;
	status: PostStatus;
	categoryId?: string;
	tagIds: string[];
}

export interface UpdatePostFormValues extends CreatePostFormValues {
	id: string;
}

export interface CreateCategoryFormValues {
	name: string;
	slug: string;
	description?: string;
	color?: string;
}

export interface UpdateCategoryFormValues extends CreateCategoryFormValues {
	id: string;
}

export interface CreateTagFormValues {
	name: string;
	slug: string;
	color?: string;
}

export interface UpdateTagFormValues extends CreateTagFormValues {
	id: string;
}

export interface CreateCommentFormValues {
	content: string;
	postId: string;
	parentId?: string;
}

// 查询类型定义
export interface BlogListQuery {
	page?: number;
	limit?: number;
	categoryId?: string;
	tagId?: string;
	status?: PostStatus;
	search?: string;
	authorId?: string;
}

export interface BlogListResponse {
	posts: PostWithDetails[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

// 统计类型定义
export interface BlogStats {
	totalPosts: number;
	publishedPosts: number;
	draftPosts: number;
	totalCategories: number;
	totalTags: number;
	totalComments: number;
	totalViews: number;
}
