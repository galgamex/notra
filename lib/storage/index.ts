import 'server-only';
import SupabaseStorage from './supabase';

export interface IStorage {
	upload(file: File, path: string): Promise<string>;
	delete(path: string): Promise<void>;
}

let storage: IStorage = {
	upload: async () => {
		throw new Error('Storage not initialized');
	},
	delete: async () => {
		throw new Error('Storage not initialized');
	}
};

if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
	storage = new SupabaseStorage();
}

export default storage;
