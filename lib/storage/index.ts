import 'server-only';
<<<<<<< HEAD
import S3Storage from './s3';
=======
>>>>>>> f2962736316efd5726c61050eac23356daea6ebd
import SupabaseStorage from './supabase';

export interface IStorage {
	upload(file: File, path: string): Promise<string>;
	delete(path: string): Promise<void>;
}

const storage: IStorage = (() => {
<<<<<<< HEAD
	// 优先使用 S3 存储
	if (
		process.env.KUN_VISUAL_NOVEL_S3_STORAGE_ACCESS_KEY_ID &&
		process.env.KUN_VISUAL_NOVEL_S3_STORAGE_SECRET_ACCESS_KEY &&
		process.env.KUN_VISUAL_NOVEL_S3_STORAGE_BUCKET_NAME &&
		process.env.KUN_VISUAL_NOVEL_S3_STORAGE_ENDPOINT &&
		process.env.NEXT_PUBLIC_KUN_VISUAL_NOVEL_S3_STORAGE_URL
	) {
		return new S3Storage();
	}

	// 回退到 Supabase 存储
=======
>>>>>>> f2962736316efd5726c61050eac23356daea6ebd
	if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
		return new SupabaseStorage();
	}

	return {
		upload: async () => {
			throw new Error('Storage not initialized');
		},
		delete: async () => {
			throw new Error('Storage not initialized');
		}
	};
})();

export default storage;
