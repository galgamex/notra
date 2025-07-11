import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import { BlogService } from '@/services/blog';
import type { UpdatePostFormValues } from '@/types/blog';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const post = await BlogService.getPostById(params.id);

    if (!post) {
      return NextResponse.json(
        { error: '文章不存在' },
        { status: 404 }
      );
    }

    // 增加浏览次数
    await BlogService.incrementViewCount(params.id);

    return NextResponse.json(post);
  } catch (error) {
    console.error('获取文章失败:', error);
    return NextResponse.json(
      { error: '获取文章失败' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    // 检查文章是否存在
    const existingPost = await BlogService.getPostById(params.id);
    if (!existingPost) {
      return NextResponse.json(
        { error: '文章不存在' },
        { status: 404 }
      );
    }

    // 检查权限（只有作者或管理员可以编辑）
    if (existingPost.authorId !== session.user.id && (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: '没有权限编辑此文章' },
        { status: 403 }
      );
    }

    const data: UpdatePostFormValues = await request.json();

    // 验证必填字段
    if (!data.title || !data.slug || !data.content) {
      return NextResponse.json(
        { error: '标题、别名和内容不能为空' },
        { status: 400 }
      );
    }

    const post = await BlogService.updatePost(data);

    return NextResponse.json(post);
  } catch (error) {
    console.error('更新文章失败:', error);
    return NextResponse.json(
      { error: '更新文章失败' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    // 检查文章是否存在
    const existingPost = await BlogService.getPostById(params.id);
    if (!existingPost) {
      return NextResponse.json(
        { error: '文章不存在' },
        { status: 404 }
      );
    }

    // 检查权限（只有作者或管理员可以删除）
    if (existingPost.authorId !== session.user.id && (session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: '没有权限删除此文章' },
        { status: 403 }
      );
    }

    await BlogService.deletePost(params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除文章失败:', error);
    return NextResponse.json(
      { error: '删除文章失败' },
      { status: 500 }
    );
  }
} 