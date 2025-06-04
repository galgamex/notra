'use client';

import {
	ArrowUpRight,
	LinkIcon,
	MoreHorizontal,
	SlidersHorizontal,
	Trash2
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

import { deleteBook } from '@/actions/book';
import { useBooksQuery } from '@/apis/book';
import NotraSidebarButton from '@/components/notra/notra-sidebar-button';
import NotraSidebarGroup from '@/components/notra/notra-sidebar-group';
import NotraSidebarMenu from '@/components/notra/notra-sidebar-menu';
import NotraSidebarMenuItem from '@/components/notra/notra-sidebar-menu-item';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuSeparator,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { useTranslations } from '@/i18n';

export function NavBooks() {
	const t = useTranslations('app_dashboard_sidebar');

	const { data: books, isLoading, mutate } = useBooksQuery();
	const { copyToClipboard } = useCopyToClipboard();

	const handleCopyLink = (slug: string) => {
		copyToClipboard(`/dashboard/${slug}`);
	};

	const handleDeleteBook = async (id: number) => {
		try {
			await deleteBook(id);
			mutate();
			toast.success(t('delete_success'));
		} catch {
			toast.error(t('delete_error'));
		}
	};

	return (
		<NotraSidebarGroup group={t('books')}>
			<NotraSidebarMenu>
				{isLoading && (
					<div className="space-y-1 px-2">
						<div className="py-2">
							<Skeleton className="h-4" />
						</div>
						<div className="py-2">
							<Skeleton className="h-4" />
						</div>
						<div className="py-2">
							<Skeleton className="h-4" />
						</div>
					</div>
				)}

				{!books ||
					(books.length === 0 && (
						<div className="flex w-full items-center justify-center">
							<Image
								src="/empty-page.svg"
								alt="Empty"
								width={200}
								height={150}
							/>
						</div>
					))}

				{books?.map((item) => (
					<NotraSidebarMenuItem key={item.id}>
						<NotraSidebarButton
							href={`/dashboard/${item.slug}`}
							className="pr-1 pl-5"
						>
							<div className="flex w-full items-center justify-between">
								<span className="text-secondary-foreground">{item.name}</span>

								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											className="size-5 rounded-sm hover:bg-icon-hover hover:text-icon-hover-foreground md:opacity-0 md:group-hover/menu-item:opacity-100"
										>
											<MoreHorizontal />
											<span className="sr-only">More</span>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent
										className="w-56 rounded-lg"
										onClick={(e) => e.stopPropagation()}
									>
										<DropdownMenuItem asChild>
											<Link
												href={`/dashboard/${item.slug}/management/settings`}
												className="flex items-center gap-2"
											>
												<SlidersHorizontal className="text-muted-foreground" />
												<span>{t('settings')}</span>
											</Link>
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											onClick={() => handleCopyLink(item.slug)}
											className="cursor-pointer"
										>
											<LinkIcon className="text-muted-foreground" />
											<span>{t('copy_link')}</span>
										</DropdownMenuItem>
										<DropdownMenuItem asChild>
											<Link
												href={`/dashboard/${item.slug}`}
												target="_blank"
												className="flex items-center gap-2"
											>
												<ArrowUpRight className="text-muted-foreground" />
												<span>{t('open_in_new_tab')}</span>
											</Link>
										</DropdownMenuItem>
										<DropdownMenuSeparator />
										<DropdownMenuItem
											onClick={() => handleDeleteBook(item.id)}
											className="cursor-pointer"
										>
											<Trash2 className="text-muted-foreground" />
											<span>{t('delete')}</span>
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</NotraSidebarButton>
					</NotraSidebarMenuItem>
				))}
			</NotraSidebarMenu>
			{/* <SidebarMenu>
				{isLoading && (
					<div className="px-2 space-y-1">
						<div className="py-2">
							<Skeleton className="h-4" />
						</div>
						<div className="py-2">
							<Skeleton className="h-4" />
						</div>
						<div className="py-2">
							<Skeleton className="h-4" />
						</div>
					</div>
				)}

				{books?.map((item) => (
					<SidebarMenuItem key={item.id}>
						<SidebarMenuButton asChild tooltip={item.name}>
							<Link href={`/dashboard/${item.slug}`}>
								<BookText />
								<span>{item.name}</span>
							</Link>
						</SidebarMenuButton>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuAction showOnHover className="cursor-pointer">
									<MoreHorizontal />
									<span className="sr-only">More</span>
								</SidebarMenuAction>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="w-56 rounded-lg"
								side={isMobile ? 'bottom' : 'right'}
								align={isMobile ? 'end' : 'start'}
							>
								<DropdownMenuItem>
									<Link
										href={`/dashboard/${item.slug}/settings`}
										className="flex items-center gap-2"
									>
										<SlidersHorizontal className="text-muted-foreground" />
										<span>{t('settings')}</span>
									</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={() => handleCopyLink(item.slug)}>
									<LinkIcon className="text-muted-foreground" />
									<span>{t('copy_link')}</span>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<Link
										href={`/dashboard/${item.slug}`}
										target="_blank"
										className="flex items-center gap-2"
									>
										<ArrowUpRight className="text-muted-foreground" />
										<span>{t('open_in_new_tab')}</span>
									</Link>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={() => handleDeleteBook(item.id)}>
									<Trash2 className="text-muted-foreground" />
									<span>{t('delete')}</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				))}
			</SidebarMenu> */}
		</NotraSidebarGroup>
	);
}
