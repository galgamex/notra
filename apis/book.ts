import { useFetcher } from '@/hooks/use-fetcher';
import { BookVo } from '@/types/book';

export const useBooksQuery = () => useFetcher<BookVo[]>('/api/books');
