import { useEffect } from 'react';
import { create } from 'zustand';

import { BookVo } from '@/types/book';

type BookStore = {
	book: BookVo;
	setBook: (book: BookVo) => void;
};

const useBookStore = create<BookStore>((set) => ({
	book: {
		id: -1,
		name: '',
		slug: ''
	},
	setBook: (book) => set({ book })
}));

export default useBookStore;

export const useBook = () => useBookStore((state) => state.book);

export const useSetBook = (book: BookVo) => {
	const setBook = useBookStore((state) => state.setBook);

	useEffect(() => {
		if (useBookStore.getState().book !== book) {
			setBook(book);
		}
	}, [book, setBook]);
};
