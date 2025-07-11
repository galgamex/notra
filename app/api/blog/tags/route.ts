import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import { BlogService } from '@/services/blog';
import type { CreateTagFormValues } from '@/types/blog';

export async function GET() {
  try {
    const tags = await BlogService.getTags();
    return NextResponse.json(tags);
  } catch (error) {
    console.error('获取标签列表失败:', error);
    return NextResponse.json(
      { error: '获取标签列表失败' },
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

    // 检查是否为管理员
    if ((session.user as any).role !== 'ADMIN') {
      return NextResponse.json(
        { error: '只有管理员可以创建标签' },
        { status: 403 }
      );
    }

    const data: CreateTagFormValues = await request.json();

    // 验证必填字段
    if (!data.name || !data.slug) {
      return NextResponse.json(
        { error: '标签名称和别名不能为空' },
        { status: 400 }
      );
    }

    const tag = await BlogService.createTag(data);

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    console.error('创建标签失败:', error);
    return NextResponse.json(
      { error: '创建标签失败' },
      { status: 500 }
    );
  }
}