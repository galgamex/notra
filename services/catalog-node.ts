import { CatalogNodeEntity, CatalogNodeType } from '@prisma/client';

import { getTranslations } from '@/i18n';
import {
	deleteNodeWithChildren,
	moveNode
} from '@/lib/catalog-node-utils/server';
import { logger } from '@/lib/logger';
import prisma from '@/lib/prisma';
import { ServiceResult } from '@/lib/service-result';
import { flattenCatalogNodes } from '@/lib/utils';
import { Nullable } from '@/types/common';

export default class CatalogNodeService {
	static async getCatalogNodes(bookId: CatalogNodeEntity['bookId']) {
		try {
			const nodes = await prisma.catalogNodeEntity.findMany({
				where: {
					bookId
				},
				select: {
					id: true,
					parentId: true,
					prevId: true,
					siblingId: true,
					childId: true,
					title: true,
					type: true,
					url: true,
					openWindow: true,
					docId: true,
					bookId: true
				}
			});

			return ServiceResult.success(flattenCatalogNodes(nodes));
		} catch (error) {
			logger('CatalogNodeService.getCatalogNodes', error);
			const t = getTranslations('services_catalog_node_service');

			return ServiceResult.fail(t('get_catalog_nodes_error'));
		}
	}

	static async createNode(
		bookId: CatalogNodeEntity['bookId'],
		parentId: CatalogNodeEntity['parentId'],
		type: CatalogNodeType
	) {
		try {
			const t = getTranslations('services_catalog_node_service');
			const node = await prisma.$transaction(async (tx) => {
				const parentNode = parentId
					? await tx.catalogNodeEntity.findUnique({
							where: {
								id: parentId
							}
						})
					: null;

				const firstNode = await tx.catalogNodeEntity.findFirst({
					where: {
						bookId,
						parentId,
						prevId: parentId
					}
				});

				let doc =
					type === CatalogNodeType.DOC
						? await tx.docEntity.create({
								data: {
									title: t('new_doc_default_name'),
									bookId
								}
							})
						: null;

				if (doc) {
					doc = await tx.docEntity.update({
						where: { id: doc.id },
						data: {
							slug: (doc.id * 10000).toString(36)
						}
					});
				}

				const node = await tx.catalogNodeEntity.create({
					data: {
						title:
							type === CatalogNodeType.STACK
								? t('new_stack_default_name')
								: t('new_doc_default_name'),
						type,
						bookId,
						parentId: parentNode ? parentNode.id : null,
						prevId: parentNode ? parentNode.id : null,
						siblingId: firstNode ? firstNode.id : null,
						docId: doc ? doc.id : null,
						url: doc ? doc.slug : null
					}
				});

				await Promise.all([
					firstNode
						? tx.catalogNodeEntity.update({
								where: { id: firstNode.id },
								data: { prevId: node.id }
							})
						: null,
					parentNode
						? tx.catalogNodeEntity.update({
								where: { id: parentNode.id },
								data: { childId: node.id }
							})
						: null
				]);
			});

			return ServiceResult.success(node);
		} catch (error) {
			const t = getTranslations('services_catalog_node_service');

			if (type === CatalogNodeType.DOC) {
				logger('CatalogNodeService.createDoc', error);

				return ServiceResult.fail(t('create_doc_error'));
			} else {
				logger('CatalogNodeService.createStack', error);

				return ServiceResult.fail(t('create_stack_error'));
			}
		}
	}

	static async createStack(
		bookId: CatalogNodeEntity['bookId'],
		parentId: CatalogNodeEntity['parentId']
	) {
		return CatalogNodeService.createNode(
			bookId,
			parentId,
			CatalogNodeType.STACK
		);
	}

	static async createDoc(
		bookId: CatalogNodeEntity['bookId'],
		parentId: CatalogNodeEntity['parentId']
	) {
		return CatalogNodeService.createNode(bookId, parentId, CatalogNodeType.DOC);
	}

	static async deleteWithChildren({
		nodeId,
		bookId
	}: {
		nodeId: CatalogNodeEntity['id'];
		bookId: CatalogNodeEntity['bookId'];
	}) {
		try {
			await prisma.$transaction(async (tx) => {
				await deleteNodeWithChildren(tx, nodeId);
			});

			return CatalogNodeService.getCatalogNodes(bookId);
		} catch (error) {
			logger('CatalogNodeService.deleteWithChildren', error);
			const t = getTranslations('services_catalog_node_service');

			return ServiceResult.fail(t('delete_with_children_error'));
		}
	}

	static async prependChild({
		bookId,
		nodeId,
		targetId
	}: {
		bookId: CatalogNodeEntity['bookId'];
		nodeId: CatalogNodeEntity['id'];
		targetId: Nullable<CatalogNodeEntity['id']>;
	}) {
		try {
			await prisma.$transaction(async (tx) => {
				await moveNode(tx, {
					bookId,
					nodeId,
					newParentId: targetId ?? null,
					newPrevId: targetId ?? null
				});
			});

			return CatalogNodeService.getCatalogNodes(bookId);
		} catch (error) {
			logger('CatalogNodeService.prependChild', error);
			const t = getTranslations('services_catalog_node_service');

			return ServiceResult.fail(t('prepend_child_error'));
		}
	}

	static async moveAfter({
		bookId,
		nodeId,
		targetId
	}: {
		bookId: CatalogNodeEntity['bookId'];
		nodeId: CatalogNodeEntity['id'];
		targetId: CatalogNodeEntity['id'];
	}) {
		try {
			await prisma.$transaction(async (tx) => {
				const newPrevNode = await tx.catalogNodeEntity.findUnique({
					where: {
						id: targetId
					}
				});

				await moveNode(tx, {
					bookId,
					nodeId,
					newParentId: newPrevNode?.parentId ?? null,
					newPrevId: targetId ?? null
				});
			});

			return CatalogNodeService.getCatalogNodes(bookId);
		} catch (error) {
			logger('CatalogNodeService.moveAfter', error);
			const t = getTranslations('services_catalog_node_service');

			return ServiceResult.fail(t('move_after_error'));
		}
	}

	static async updateTitle({
		id,
		title
	}: {
		id: CatalogNodeEntity['id'];
		title: CatalogNodeEntity['title'];
	}) {
		try {
			const node = await prisma.$transaction(async (tx) => {
				const node = await tx.catalogNodeEntity.update({
					where: { id },
					data: { title }
				});

				if (node.docId !== null) {
					await tx.docEntity.update({
						where: { id: node.docId },
						data: { title }
					});
				}

				return node;
			});

			return CatalogNodeService.getCatalogNodes(node.bookId);
		} catch (error) {
			logger('CatalogNodeService.updateTitle', error);
			const t = getTranslations('services_catalog_node_service');

			return ServiceResult.fail(t('update_title_error'));
		}
	}
}
