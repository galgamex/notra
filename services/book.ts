import { BookEntity } from '@prisma/client';
import { cache } from 'react';

import { getTranslations } from '@/i18n';
import prisma from '@/lib/prisma';
import { ServiceResult } from '@/lib/service-result';
import { CreateBookFormValues, UpdateBookInfoDto } from '@/types/book';

export default class BookService {
	static async updateBookInfo(values: UpdateBookInfoDto) {
		try {
			const book = await prisma.bookEntity.update({
				where: { id: values.id },
				data: {
					name: values.name,
					slug: values.slug
				}
			});

			return ServiceResult.success(book);
		} catch (error) {
			console.log('BookService.updateBookInfo: ', error);
			const t = getTranslations('services_book_service');

			return ServiceResult.fail(t('update_book_info_error'));
		}
	}

	static async createBook(values: CreateBookFormValues) {
		try {
			const book = await prisma.$transaction(async (tx) => {
				const book = await tx.bookEntity.create({
					data: {
						name: values.name
					}
				});

				return await tx.bookEntity.update({
					where: { id: book.id },
					data: {
						slug: (book.id * 100000).toString(36)
					}
				});
			});

			return ServiceResult.success(book);
		} catch (error) {
			console.log('BookService.createBook: ', error);
			const t = getTranslations('services_book_service');

			return ServiceResult.fail(t('create_book_error'));
		}
	}

	static async deleteBook(id: BookEntity['id']) {
		try {
			await prisma.bookEntity.delete({
				where: { id }
			});

			return ServiceResult.success(true);
		} catch (error) {
			console.log('BookService.deleteBook: ', error);
			const t = getTranslations('services_book_service');

			return ServiceResult.fail(t('delete_book_error'));
		}
	}

	static getBooks = cache(async () => {
		try {
			const books = await prisma.bookEntity.findMany({
				select: { id: true, slug: true, name: true }
			});

			return ServiceResult.success(books);
		} catch (error) {
			console.log('BookService.getBooks: ', error);
			const t = getTranslations('services_book_service');

			return ServiceResult.fail(t('get_books_error'));
		}
	});

	static getBook = cache(async (slug: BookEntity['slug']) => {
		try {
			const book = await prisma.bookEntity.findUnique({
				where: { slug },
				select: {
					id: true,
					name: true,
					slug: true
				}
			});

			return ServiceResult.success(book);
		} catch (error) {
			console.log('BookService.getBook: ', error);
			const t = getTranslations('services_book_service');

			return ServiceResult.fail(t('get_book_error'));
		}
	});
}
