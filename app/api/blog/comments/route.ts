import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import { BlogService } from '@/services/blog';
import type { CreateCommentFormValues } from '@/types/blog';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: '请先登录' },
        { status: 401 }
      );
    }

    const data: CreateCommentFormValues = await request.json();

    // 验证必填字段
    if (!data.content || !data.postId) {
      return NextResponse.json(
        { error: '评论内容和文章ID不能为空' },
        { status: 400 }
      );
    }

    // 检查文章是否存在
    const post = await BlogService.getPostById(data.postId);
    if (!post) {
      return NextResponse.json(
        { error: '文章不存在' },
        { status: 404 }
      );
    }

    const comment = await BlogService.createComment(data, session.user.id);

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('创建评论失败:', error);
    return NextResponse.json(
      { error: '创建评论失败' },
      { status: 500 }
    );
  }
} 