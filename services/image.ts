import { imageSize } from 'image-size';

import { getTranslations } from '@/i18n';
import { encryptFileMD5 } from '@/lib/crypto';
import { logger } from '@/lib/logger';
import prisma from '@/lib/prisma';
import { ServiceResult } from '@/lib/service-result';
import storage from '@/lib/storage';

export default class ImageService {
	static async uploadImage(file: File) {
		try {
			const arrayBuffer = await file.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);
			const hash = encryptFileMD5(buffer);

			let image = await prisma.imageEntity.findUnique({
				where: {
					hash
				}
			});

			if (image) {
				return ServiceResult.success(image);
			}

			const name = file.name;
			const url = await storage.upload(
				file,
				`images/${hash}.${name.split('.').pop()}`
			);

			const metadata = imageSize(buffer);
			const size = file.size;
			const mimeType = file.type;

			image = await prisma.imageEntity.create({
				data: {
					hash,
					url,
					width: metadata.width,
					height: metadata.height,
					size,
					mimeType
				}
			});

			return ServiceResult.success(image);
		} catch (error) {
			logger('ImageService.uploadImage', error);
			const t = getTranslations('services_image');

			return ServiceResult.fail(t('upload_error'));
		}
	}
}
