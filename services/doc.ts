import { PartialBlock } from '@blocknote/core';
import { DocEntity } from '@prisma/client';
import { InputJsonArray } from '@prisma/client/runtime/library';
import { cache } from 'react';

import { getTranslations } from '@/i18n';
import { logger } from '@/lib/logger';
import prisma from '@/lib/prisma';
import { ServiceResult } from '@/lib/service-result';

export default class DocService {
	static async getRecentEdits() {
		try {
			const recentEdits = await prisma.docEntity.findMany({
				where: {
					NOT: {
						catalogNode: null
					}
				},
				orderBy: { updatedAt: 'desc' },
				take: 100,
				select: {
					id: true,
					title: true,
					slug: true,
					book: true,
					updatedAt: true
				}
			});

			return ServiceResult.success(recentEdits);
		} catch (error) {
			logger('DocService.getRecentEdits', error);
			const t = getTranslations('services_doc_service');

			return ServiceResult.fail(t('get_recent_edits_error'));
		}
	}

	static async getDocMeta(slug: string) {
		try {
			const doc = await prisma.docEntity.findUnique({
				where: { slug },
				select: {
					id: true,
					title: true,
					slug: true,
					bookId: true
				}
			});

			return ServiceResult.success(doc);
		} catch (error) {
			logger('DocService.getDocMeta', error);
			const t = getTranslations('services_doc_service');

			return ServiceResult.fail(t('get_doc_meta_error'));
		}
	}

	static async updateDocTitle(docId: DocEntity['id'], title: string) {
		try {
			const doc = await prisma.$transaction(async (tx) => {
				const [doc] = await Promise.all([
					tx.docEntity.update({
						where: { id: docId },
						data: { title }
					}),
					tx.catalogNodeEntity.update({
						where: { docId: docId },
						data: {
							title
						}
					})
				]);

				return doc;
			});

			return DocService.getDocMeta(doc.slug);
		} catch (error) {
			logger('DocService.updateDocTitle', error);
			const t = getTranslations('services_doc_service');

			return ServiceResult.fail(t('update_doc_title_error'));
		}
	}

	static async updateDocContent(
		docId: DocEntity['id'],
		content: PartialBlock[]
	) {
		try {
			const doc = await prisma.docEntity.update({
				where: { id: docId },
				data: { blockJson: content as InputJsonArray }
			});

			return ServiceResult.success(doc);
		} catch (error) {
			logger('DocService.updateDocContent', error);
			const t = getTranslations('services_doc_service');

			return ServiceResult.fail(t('update_doc_content_error'));
		}
	}

	static readonly getDoc = cache(async (slug: string) => {
		try {
			const doc = await prisma.docEntity.findUnique({
				where: { slug },
				select: {
					id: true,
					title: true,
					slug: true,
					blockJson: true,
					bookId: true,
					catalogNode: true
				}
			});

			return ServiceResult.success(doc);
		} catch (error) {
			logger('DocService.getDoc', error);
			const t = getTranslations('services_doc_service');

			return ServiceResult.fail(t('get_doc_error'));
		}
	});
}
