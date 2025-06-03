'use server';

import { getTranslations } from '@/i18n';
import { ServiceResult } from '@/lib/service-result';
import ImageService from '@/services/image';
import { ImageFileSchema } from '@/types/files';

export const uploadImage = async (formData: FormData) => {
	const t = getTranslations('actions_files');
	const file = formData.get('file') as File;

	if (!file) {
		return ServiceResult.fail(t('no_file_uploaded')).toPlainObject();
	}

	const validatedFile = ImageFileSchema.safeParse({ file });

	if (!validatedFile.success) {
		return ServiceResult.fail(t(validatedFile.error.message)).toPlainObject();
	}

	const serviceResult = await ImageService.uploadImage(validatedFile.data.file);

	return serviceResult.toPlainObject();
};
