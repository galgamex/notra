import { BookEntity } from '@prisma/client';
import { z } from 'zod';

export const BookInfoFormSchema = z.object({
	name: z.string().min(1, { message: 'name_required' }),
	slug: z
		.string()
		.min(2, { message: 'slug_required' })
		.regex(/^[a-z0-9-_.]+$/, {
			message: 'slug_required'
		})
});

export type BookInfoFormValues = z.infer<typeof BookInfoFormSchema>;

export type UpdateBookInfoDto = {
	id: BookEntity['id'];
	name: BookEntity['name'];
	slug: BookEntity['slug'];
};

export const CreateBookFormSchema = z.object({
	name: z.string()
});

export type CreateBookFormValues = z.infer<typeof CreateBookFormSchema>;

export type BookVo = Omit<BookEntity, 'createdAt' | 'updatedAt'>;
