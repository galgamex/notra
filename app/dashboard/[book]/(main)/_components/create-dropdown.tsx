'use client';

import { CatalogNodeEntity, CatalogNodeType } from '@prisma/client';
import { Plus, File, Folder } from 'lucide-react';
import { PropsWithChildren } from 'react';
import { toast } from 'sonner';

import { createDoc, createStack } from '@/actions/catalog-node';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useMutateCatalog } from '@/hooks/use-mutate-catalog';
import { useTranslations } from '@/i18n';
import { useBook } from '@/stores/use-book';
import useCatalog from '@/stores/use-catalog';

export interface CreateDropdownProps extends PropsWithChildren {
	parentCatalogNodeId: CatalogNodeEntity['parentId'];
}

export default function CreateDropdown({
	parentCatalogNodeId,
	children
}: Readonly<CreateDropdownProps>) {
	const t = useTranslations('app_dashboard_book_main_layout');
	const book = useBook();
	const mutateCatalog = useMutateCatalog(book.id);
	const expandedKeys = useCatalog((state) => state.expandedKeys);
	const setExpandedKeys = useCatalog((state) => state.setExpandedKeys);

	const create = async (type: CatalogNodeType) => {
		if (
			parentCatalogNodeId !== null &&
			!expandedKeys.has(parentCatalogNodeId)
		) {
			expandedKeys.add(parentCatalogNodeId);
			setExpandedKeys(expandedKeys);
		}

		const result =
			type === 'DOC'
				? await createDoc(book.id, parentCatalogNodeId)
				: await createStack(book.id, parentCatalogNodeId);

		if (!result.success) {
			toast.error(result.message);

			return;
		}

		mutateCatalog();
	};

	const handleCreateDocument = async () => {
		create('DOC');
	};

	const handleCreateStack = async () => {
		create('STACK');
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				{children ?? (
					<Button className="size-8" size="icon" variant="outline">
						<Plus size={16} />
					</Button>
				)}
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start" onClick={(e) => e.stopPropagation()}>
				<DropdownMenuItem onClick={handleCreateDocument}>
					<File />
					{t('new_document')}
				</DropdownMenuItem>

				<DropdownMenuItem onClick={handleCreateStack}>
					<Folder />
					{t('new_stack')}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
