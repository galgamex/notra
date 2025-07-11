import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import { BlogService } from '@/services/blog';
import { PostStatus } from '@prisma/client';
import type { CreatePostFormValues, BlogListQuery } from '@/types/blog';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const query: BlogListQuery = {
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
      categoryId: searchParams.get('categoryId') || undefined,
      tagId: searchParams.get('tagId') || undefined,
      status: (searchParams.get('status') as PostStatus) || undefined,
      search: searchParams.get('search') || undefined,
      authorId: searchParams.get('authorId') || undefined,
    };

    const result = await BlogService.getPosts(query);

    return NextResponse.json(result);
  } catch (error) {
    console.error('获取文章列表失败:', error);
    return NextResponse.json(
      { error: '获取文章列表失败' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const data: CreatePostFormValues = await request.json();

    // 验证必填字段
    if (!data.title || !data.slug || !data.content) {
      return NextResponse.json(
        { error: '标题、别名和内容不能为空' },
        { status: 400 }
      );
    }

    const post = await BlogService.createPost(data, session.user.id);

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('创建文章失败:', error);
    return NextResponse.json(
      { error: '创建文章失败' },
      { status: 500 }
    );
  }
} 