import Link from 'next/link';
import { CSSProperties } from 'react';

import { useBook } from '@/stores/use-book';
import { CatalogNodeVoWithLevel } from '@/types/catalog-node';
import { ChildrenProps } from '@/types/common';

export interface CatalogItemWrapperProps extends ChildrenProps {
	className?: string;
	style?: CSSProperties;
	item: CatalogNodeVoWithLevel;
	isEditingTitle?: boolean;
	onClick?: () => void;
}

export default function CatalogItemWrapper({
	children,
	item,
	className,
	style,
	isEditingTitle,
	onClick
}: CatalogItemWrapperProps) {
	const book = useBook();

	if (item.type === 'DOC' && !isEditingTitle) {
		return (
			<Link
				href={`/dashboard/${book.slug}/${item.url}`}
				className={className}
				style={style}
				onClick={onClick}
			>
				{children}
			</Link>
		);
	}

	return (
		<div
			className={className}
			style={style}
			onClick={isEditingTitle ? undefined : onClick}
		>
			{children}
		</div>
	);
}
