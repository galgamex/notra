'use client';

import dayjs from 'dayjs';
import Link from 'next/link';

import { useRecentEditsQuery } from '@/apis/doc';
import { Skeleton } from '@/components/ui/skeleton';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

export default function RecentEditsTable() {
	const { data, isLoading } = useRecentEditsQuery();

	const renderUpdatedAt = (updatedAt: Date) => {
		const date = dayjs(updatedAt);
		const now = dayjs();

		if (date.year() === now.year()) {
			return date.format('MM-DD HH:mm');
		} else {
			return date.format('YYYY-MM-DD');
		}
	};

	return (
		<Table>
			<TableHeader className="hidden">
				<TableRow>
					<TableHead></TableHead>
					<TableHead></TableHead>
					<TableHead></TableHead>
					<TableHead></TableHead>
				</TableRow>
			</TableHeader>
			<TableBody className="text-sm leading-8">
				{isLoading &&
					Array.from({ length: 6 }).map((_, i) => {
						const isOdd = (i + 1) % 2 === 1;

						return (
							<TableRow key={i}>
								<TableCell className="px-px py-4">
									<div className="h-8 py-2">
										<Skeleton
											className={cn('h-4', isOdd ? 'w-1/3' : 'w-1/2')}
										/>
									</div>
								</TableCell>
								<TableCell className="w-[32%] min-w-59 px-px py-4">
									<div className="h-8 py-2">
										<Skeleton
											className={cn('h-4', isOdd ? 'w-1/3' : 'w-1/2')}
										/>
									</div>
								</TableCell>
								<TableCell className="w-[17%] px-px py-4">
									<div className="h-8 py-2">
										<Skeleton className="h-4 w-30" />
									</div>
								</TableCell>
								<TableCell className="w-8.5 px-px py-4"></TableCell>
							</TableRow>
						);
					})}

				{!isLoading &&
					data?.map((recentEdit) => (
						<TableRow key={recentEdit.id}>
							<TableCell className="px-px py-4">
								<Link
									href={`/dashboard/${recentEdit.book.slug}/${recentEdit.slug}`}
								>
									{recentEdit.title}
								</Link>
							</TableCell>
							<TableCell className="w-[32%] min-w-59 px-px py-4">
								<Link
									href={`/dashboard/${recentEdit.book.slug}`}
									className="text-sm leading-8"
								>
									{recentEdit.book.name}
								</Link>
							</TableCell>
							<TableCell className="w-[17%] px-px py-4">
								{renderUpdatedAt(recentEdit.updatedAt)}
							</TableCell>
							<TableCell className="w-8.5 px-px py-4">
								{/* {recentEdit.updatedAt} */}
							</TableCell>
						</TableRow>
					))}
			</TableBody>
		</Table>
	);
}
