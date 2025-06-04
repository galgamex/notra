import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { logger } from '@/lib/logger';

import { IStorage } from '.';

export default class SupabaseStorage implements IStorage {
	private readonly supabase: SupabaseClient;
	private readonly BUCKET_NAME = 'notra';
	private bucketCreated = false;

	constructor() {
		this.supabase = createClient(
			process.env.SUPABASE_URL!,
			process.env.SUPABASE_SERVICE_ROLE_KEY!
		);
	}

	private async createBucket() {
		if (this.bucketCreated) {
			return;
		}

		try {
			const { data: bucket } = await this.supabase.storage.getBucket(
				this.BUCKET_NAME
			);

			if (bucket) {
				this.bucketCreated = true;

				return;
			}

			await this.supabase.storage.createBucket(this.BUCKET_NAME, {
				public: true
			});

			this.bucketCreated = true;
		} catch (error) {
			logger('SupabaseStorage.createBucket', error);
		}
	}

	async upload(file: File, path: string): Promise<string> {
		await this.createBucket();

		const { data, error } = await this.supabase.storage
			.from(this.BUCKET_NAME)
			.upload(path, file);

		if (error) {
			throw error;
		}

		const {
			data: { publicUrl }
		} = this.supabase.storage.from(this.BUCKET_NAME).getPublicUrl(data.path);

		return publicUrl;
	}

	async delete(path: string): Promise<void> {
		const { error } = await this.supabase.storage
			.from(this.BUCKET_NAME)
			.remove([path]);

		if (error) {
			throw error;
		}
	}
}
