import { DocEntity, CatalogNodeEntity, BookEntity } from '@prisma/client';

export type RecentEditVo = {
	id: DocEntity['id'];
	title: DocEntity['title'];
	slug: DocEntity['slug'];
	book: BookEntity;
	updatedAt: DocEntity['updatedAt'];
};

export type DocMetaVo = {
	id: DocEntity['id'];
	title: DocEntity['title'];
	slug: DocEntity['slug'];
	bookId: DocEntity['bookId'];
	updatedAt: DocEntity['updatedAt'];
};

export type DocVo = Omit<
	DocEntity & { catalogNode: CatalogNodeEntity | null },
	'createdAt' | 'updatedAt'
>;
