'use client';

import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { MessageCircle, Reply, User } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { CommentWithDetails } from '@/types/blog';

interface CommentSectionProps {
	postId: string;
	comments: CommentWithDetails[];
}

interface CommentItemProps {
	comment: CommentWithDetails;
	onReply: (parentId: string) => void;
	level?: number;
}

function CommentItem({ comment, onReply, level = 0 }: CommentItemProps) {
	const maxLevel = 2; // 最大嵌套层级，改为2级
	const canReply = level < maxLevel;
	// 限制缩进层级，超过2级的评论都以2级的样式显示
	const displayLevel = Math.min(level, 2);

	return (
		<div className={`${displayLevel > 0 ? 'mt-4 ml-8' : 'mb-6'}`}>
			<div className="flex space-x-3">
				<Avatar className="h-8 w-8">
					<AvatarImage src={comment.author.avatar || undefined} />
					<AvatarFallback>
						<User className="h-4 w-4" />
					</AvatarFallback>
				</Avatar>

				<div className="flex-1">
					<div className="bg-gray-50 p-4">
						<div className="mb-2 flex items-center justify-between">
							<span className="text-sm font-medium text-gray-900">
								{comment.author.name || comment.author.username}
							</span>
							<span className="text-xs text-gray-500">
								{formatDistanceToNow(new Date(comment.createdAt), {
									addSuffix: true,
									locale: zhCN
								})}
							</span>
						</div>
						<p className="text-sm leading-relaxed text-gray-700">
							{comment.content}
						</p>
					</div>

					{canReply && (
						<Button
							className="mt-2 text-xs text-gray-500 hover:text-gray-700"
							size="sm"
							variant="ghost"
							onClick={() => onReply(comment.id)}
						>
							<Reply className="mr-1 h-3 w-3" />
							回复
						</Button>
					)}

					{/* 渲染回复 */}
					{comment.replies && comment.replies.length > 0 && (
						<div className="mt-4">
							{comment.replies.map((reply) => (
								<CommentItem
									key={reply.id}
									comment={reply}
									level={level + 1}
									onReply={onReply}
								/>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default function CommentSection({
	postId,
	comments
}: CommentSectionProps) {
	const [newComment, setNewComment] = useState('');
	const [replyTo, setReplyTo] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [commentList, setCommentList] = useState(comments);

	// 递归计算所有评论的总数（包括嵌套回复）
	const getTotalCommentCount = (comments: CommentWithDetails[]): number => {
		let count = 0;

		for (const comment of comments) {
			count += 1; // 当前评论

			if (comment.replies && comment.replies.length > 0) {
				count += getTotalCommentCount(comment.replies); // 递归计算回复
			}
		}

		return count;
	};

	const totalCommentCount = getTotalCommentCount(commentList);

	const handleSubmitComment = async () => {
		if (!newComment.trim()) {
			toast.error('请输入评论内容');

			return;
		}

		setIsSubmitting(true);

		try {
			const response = await fetch('/api/blog/comments', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					content: newComment,
					postId,
					parentId: replyTo
				})
			});

			if (response.ok) {
				const newCommentData = await response.json();

				// 更新评论列表
				if (replyTo) {
					// 如果是回复，重新获取完整的评论列表以包含新回复
					try {
						const commentsResponse = await fetch(
							`/api/blog/posts/${postId}/comments`
						);

						if (commentsResponse.ok) {
							const updatedComments = await commentsResponse.json();

							setCommentList(updatedComments);
						}
					} catch (error) {
						console.error('获取更新后的评论列表失败:', error);
						// 如果获取失败，至少显示成功消息
					}

					toast.success('回复成功');
				} else {
					// 如果是新评论，添加到列表顶部
					setCommentList([newCommentData, ...commentList]);
					toast.success('评论成功');
				}

				setNewComment('');
				setReplyTo(null);
			} else {
				const error = await response.json();

				toast.error(error.error || '评论失败');
			}
		} catch (error) {
			console.error('提交评论失败:', error);
			toast.error('评论失败，请稍后重试');
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleReply = (parentId: string) => {
		setReplyTo(parentId);
		// 可以在这里滚动到评论输入框
	};

	const handleCancelReply = () => {
		setReplyTo(null);
	};

	return (
		<div>
			<div className="mb-6">
				<h3 className="flex items-center space-x-2 text-lg font-semibold">
					<MessageCircle className="h-5 w-5" />
					<span>评论 ({totalCommentCount})</span>
				</h3>
			</div>
			<div>
				{/* 评论输入框 */}
				<div className="mb-6">
					{replyTo && (
						<div className="mb-2 text-sm text-gray-600">
							正在回复评论
							<Button
								className="ml-2 text-xs"
								size="sm"
								variant="ghost"
								onClick={handleCancelReply}
							>
								取消
							</Button>
						</div>
					)}
					<Textarea
						className="mb-3"
						placeholder={replyTo ? '写下你的回复...' : '写下你的评论...'}
						rows={3}
						value={newComment}
						onChange={(e) => setNewComment(e.target.value)}
					/>
					<div className="flex justify-end">
						<Button
							disabled={isSubmitting || !newComment.trim()}
							onClick={handleSubmitComment}
						>
							{isSubmitting ? '提交中...' : replyTo ? '回复' : '发表评论'}
						</Button>
					</div>
				</div>

				{/* 评论列表 */}
				<div>
					{commentList.length === 0 ? (
						<div className="py-8 text-center text-gray-500">
							<MessageCircle className="mx-auto mb-4 h-12 w-12 text-gray-300" />
							<p>暂无评论，来发表第一条评论吧！</p>
						</div>
					) : (
						<div>
							{commentList.map((comment) => (
								<CommentItem
									key={comment.id}
									comment={comment}
									onReply={handleReply}
								/>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
