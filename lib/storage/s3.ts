import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

import { logger } from '@/lib/logger';

import { IStorage } from '.';

export default class S3Storage implements IStorage {
	private readonly s3Client: S3Client;
	private readonly bucketName: string;
	private readonly publicUrl: string;

	constructor() {
		if (
			!process.env.KUN_VISUAL_NOVEL_S3_STORAGE_ACCESS_KEY_ID ||
			!process.env.KUN_VISUAL_NOVEL_S3_STORAGE_SECRET_ACCESS_KEY ||
			!process.env.KUN_VISUAL_NOVEL_S3_STORAGE_BUCKET_NAME ||
			!process.env.KUN_VISUAL_NOVEL_S3_STORAGE_ENDPOINT ||
			!process.env.NEXT_PUBLIC_KUN_VISUAL_NOVEL_S3_STORAGE_URL
		) {
			throw new Error('S3 storage environment variables are not set');
		}

		this.bucketName = process.env.KUN_VISUAL_NOVEL_S3_STORAGE_BUCKET_NAME;
		this.publicUrl = process.env.NEXT_PUBLIC_KUN_VISUAL_NOVEL_S3_STORAGE_URL;

		this.s3Client = new S3Client({
			region: process.env.KUN_VISUAL_NOVEL_S3_STORAGE_REGION || 'auto',
			endpoint: process.env.KUN_VISUAL_NOVEL_S3_STORAGE_ENDPOINT,
			credentials: {
				accessKeyId: process.env.KUN_VISUAL_NOVEL_S3_STORAGE_ACCESS_KEY_ID,
				secretAccessKey: process.env.KUN_VISUAL_NOVEL_S3_STORAGE_SECRET_ACCESS_KEY
			},
			forcePathStyle: true // 对于 Cloudflare R2 需要设置为 true
		});
	}

	async upload(file: File, path: string): Promise<string> {
		try {
			const arrayBuffer = await file.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);

			const command = new PutObjectCommand({
				Bucket: this.bucketName,
				Key: path,
				Body: buffer,
				ContentType: file.type,
				ACL: 'public-read'
			});

			await this.s3Client.send(command);

			// 返回公共访问URL
			return `${this.publicUrl}/${path}`;
		} catch (error) {
			logger('S3 upload failed', error);
			throw error;
		}
	}

	async delete(path: string): Promise<void> {
		try {
			const command = new DeleteObjectCommand({
				Bucket: this.bucketName,
				Key: path
			});

			await this.s3Client.send(command);
		} catch (error) {
			logger('S3 delete failed', error);
			throw error;
		}
	}
}