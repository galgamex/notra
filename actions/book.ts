'use server';

import BookService from '@/services/book';
import { CreateBookFormValues, UpdateBookInfoDto } from '@/types/book';

export const updateBookInfo = async (values: UpdateBookInfoDto) => {
	const serviceResult = await BookService.updateBookInfo(values);

	return serviceResult.toPlainObject();
};

export const createBook = async (values: CreateBookFormValues) => {
	const serviceResult = await BookService.createBook(values);

	return serviceResult.toPlainObject();
};

export const deleteBook = async (id: number) => {
	const serviceResult = await BookService.deleteBook(id);

	return serviceResult.toPlainObject();
};
