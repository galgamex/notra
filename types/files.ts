import { z } from 'zod';

export const ImageFileSchema = z.object({
	file: z
		.instanceof(File)
		.refine((file) => file.size <= 5 * 1024 * 1024, {
			message: 'size_error'
		})
		.refine(
			(file) =>
				['image/jpeg', 'image/png', 'image/svg+xml'].includes(file.type),
			{
				message: 'type_error'
			}
		)
});
