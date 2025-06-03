'use server';

import { PartialBlock } from '@blocknote/core';
import { DocEntity } from '@prisma/client';

import DocService from '@/services/doc';

export const updateDocTitle = async (docId: DocEntity['id'], title: string) => {
	const serviceResult = await DocService.updateDocTitle(docId, title);

	return serviceResult.toPlainObject();
};

export const updateDocContent = async (
	docId: DocEntity['id'],
	content: PartialBlock[]
) => {
	const serviceResult = await DocService.updateDocContent(docId, content);

	return serviceResult.toPlainObject();
};
