import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import { BlogService } from '@/services/blog';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    // 检查是否为管理员
    if ((session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: '只有管理员可以删除标签' },
        { status: 403 }
      );
    }

    // 检查标签是否存在
    const tag = await BlogService.getTagById(params.id);
    if (!tag) {
      return NextResponse.json(
        { error: '标签不存在' },
        { status: 404 }
      );
    }

    // 检查标签下是否有文章
    const postsCount = await BlogService.getPostsCountByTag(params.id);
    if (postsCount > 0) {
      return NextResponse.json(
        { error: `该标签下还有 ${postsCount} 篇文章，无法删除` },
        { status: 400 }
      );
    }

    await BlogService.deleteTag(params.id);

    return NextResponse.json({ message: '标签删除成功' });
  } catch (error) {
    console.error('删除标签失败:', error);
    return NextResponse.json(
      { error: '删除标签失败' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    // 检查是否为管理员
    if ((session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: '只有管理员可以编辑标签' },
        { status: 403 }
      );
    }

    const data = await request.json();

    // 验证必填字段
    if (!data.name || !data.slug) {
      return NextResponse.json(
        { error: '标签名称和别名不能为空' },
        { status: 400 }
      );
    }

    const tag = await BlogService.updateTag({ id: params.id, ...data });

    return NextResponse.json(tag);
  } catch (error) {
    console.error('更新标签失败:', error);
    return NextResponse.json(
      { error: '更新标签失败' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tag = await BlogService.getTagById(params.id);
    
    if (!tag) {
      return NextResponse.json(
        { error: '标签不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json(tag);
  } catch (error) {
    console.error('获取标签失败:', error);
    return NextResponse.json(
      { error: '获取标签失败' },
      { status: 500 }
    );
  }
}