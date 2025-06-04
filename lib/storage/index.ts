import 'server-only';
import SupabaseStorage from './supabase';

export interface IStorage {
	upload(file: File, path: string): Promise<string>;
	delete(path: string): Promise<void>;
}

const storage: IStorage = (() => {
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
