import prisma from '@/lib/prisma';
import { PostStatus } from '@prisma/client';
import type {
  CreatePostFormValues,
  UpdatePostFormValues,
  CreateCategoryFormValues,
  UpdateCategoryFormValues,
  CreateTagFormValues,
  UpdateTagFormValues,
  CreateCommentFormValues,
  BlogListQuery,
  BlogStats,
} from '@/types/blog';

export class BlogService {
  // 文章相关方法
  static async createPost(data: CreatePostFormValues, authorId: string) {
    const { tagIds, ...postData } = data;
    
    const post = await prisma.post.create({
      data: {
        ...postData,
        authorId,
        tags: {
          create: tagIds.map(tagId => ({
            tagId,
          })),
        },
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    return post;
  }

  static async updatePost(data: UpdatePostFormValues) {
    const { id, tagIds, ...updateData } = data;
    
    const post = await prisma.post.update({
      where: { id },
      data: {
        ...updateData,
        ...(tagIds && {
          tags: {
            deleteMany: {},
            create: tagIds.map(tagId => ({
              tagId,
            })),
          },
        }),
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    return post;
  }

  static async deletePost(id: string) {
    await prisma.post.delete({
      where: { id },
    });
  }

  static async getPostById(id: string) {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    if (!post) {
      return null;
    }

    // 单独获取评论，使用递归方法
    const comments = await this.getCommentsByPostId(post.id);

    return {
      ...post,
      comments,
    };
  }

  static async getPostBySlug(slug: string) {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });

    if (!post) {
      return null;
    }

    // 单独获取评论，使用递归方法
    const comments = await this.getCommentsByPostId(post.id);

    return {
      ...post,
      comments,
    };
  }

  static async getPosts(query: BlogListQuery = {}) {
    const {
      page = 1,
      limit = 10,
      categoryId,
      tagId,
      status,
      search,
      authorId,
    } = query;

    const skip = (page - 1) * limit;

    const where: any = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (tagId) {
      where.tags = {
        some: {
          tagId,
        },
      };
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { excerpt: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (authorId) {
      where.authorId = authorId;
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              username: true,
              name: true,
              avatar: true,
            },
          },
          category: true,
          tags: {
            include: {
              tag: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    return {
      posts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  static async incrementViewCount(id: string) {
    await prisma.post.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });
  }

  // 分类相关方法
  static async createCategory(data: CreateCategoryFormValues) {
    const category = await prisma.category.create({
      data,
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    return category;
  }

  static async updateCategory(data: UpdateCategoryFormValues) {
    const { id, ...updateData } = data;
    
    const category = await prisma.category.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    return category;
  }

  static async deleteCategory(id: string) {
    await prisma.category.delete({
      where: { id },
    });
  }

  static async getCategories() {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return categories;
  }

  static async getCategoryById(id: string) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    return category;
  }

  static async getCategoryBySlug(slug: string) {
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    return category;
  }

  // 标签相关方法
  static async createTag(data: CreateTagFormValues) {
    const tag = await prisma.tag.create({
      data,
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    return tag;
  }

  static async updateTag(data: UpdateTagFormValues) {
    const { id, ...updateData } = data;
    
    const tag = await prisma.tag.update({
      where: { id },
      data: updateData,
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    return tag;
  }

  static async deleteTag(id: string) {
    await prisma.tag.delete({
      where: { id },
    });
  }

  static async getTags() {
    const tags = await prisma.tag.findMany({
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return tags;
  }

  static async getTagById(id: string) {
    const tag = await prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    return tag;
  }

  static async getTagBySlug(slug: string) {
    const tag = await prisma.tag.findUnique({
      where: { slug },
      include: {
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    return tag;
  }

  // 评论相关方法
  static async createComment(data: CreateCommentFormValues, authorId: string) {
    const comment = await prisma.comment.create({
      data: {
        ...data,
        authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true,
          },
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        _count: {
          select: {
            replies: true,
          },
        },
      },
    });

    return comment;
  }

  static async deleteComment(id: string) {
    await prisma.comment.delete({
      where: { id },
    });
  }

  static async getCommentsByPostId(postId: string) {
    // 递归获取评论的函数
    const getCommentsRecursive = async (parentId: string | null = null): Promise<any[]> => {
      const comments = await prisma.comment.findMany({
        where: {
          postId,
          parentId,
        },
        include: {
          author: {
            select: {
              id: true,
              username: true,
              name: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              replies: true,
            },
          },
        },
        orderBy: {
          createdAt: parentId ? 'asc' : 'desc', // 顶级评论按创建时间倒序，回复按正序
        },
      });

      // 为每个评论递归获取其回复
      const commentsWithReplies = await Promise.all(
        comments.map(async (comment) => {
          const replies = await getCommentsRecursive(comment.id);
          return {
            ...comment,
            replies,
          };
        })
      );

      return commentsWithReplies;
    };

    // 获取所有顶级评论及其嵌套回复
    const comments = await getCommentsRecursive();
    return comments;
  }

  static async getPostsCountByCategory(categoryId: string): Promise<number> {
    const count = await prisma.post.count({
      where: {
        categoryId,
      },
    });
    return count;
  }

  static async getPostsCountByTag(tagId: string): Promise<number> {
    const count = await prisma.post.count({
      where: {
        tags: {
          some: {
            tagId,
          },
        },
      },
    });
    return count;
  }

  // 统计相关方法
  static async getStats(): Promise<BlogStats> {
    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      totalCategories,
      totalTags,
      totalComments,
      totalViews,
    ] = await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { status: PostStatus.PUBLISHED } }),
      prisma.post.count({ where: { status: PostStatus.DRAFT } }),
      prisma.category.count(),
      prisma.tag.count(),
      prisma.comment.count(),
      prisma.post.aggregate({
        _sum: {
          viewCount: true,
        },
      }),
    ]);

    return {
      totalPosts,
      publishedPosts,
      draftPosts,
      totalCategories,
      totalTags,
      totalComments,
      totalViews: totalViews._sum.viewCount || 0,
    };
  }
}