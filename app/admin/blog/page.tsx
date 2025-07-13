import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const generateMetadata = async (): Promise<Metadata> => {
	return {
		title: '文章管理 - Notra'
	};
};

export default function BlogPage() {
	// 重定向到文章列表页面
	redirect('/admin/blog/posts');
}
