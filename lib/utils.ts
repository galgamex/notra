import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { uploadImage as uploadImageAction } from '@/actions/files';

/**
 * Merge class names using clsx and tailwind-merge
 * @param inputs - The class values to merge
 * @returns The merged class names
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/**
 * Upload a file to the server
 * @param file - The file to upload
 * @returns The result of the upload
 */
export async function uploadImage(file: File) {
	const formData = new FormData();

	formData.append('file', file);

	const result = await uploadImageAction(formData);

	if (result.success) {
		return result.data;
	}

	throw new Error(result.message);
}

/**
 * Convert a canvas element to a file
 * @param canvas - The canvas element to convert
 * @param fileName - The name of the file
 * @param mimeType - The mime type of the file
 * @param quality - The quality of the file
 */
export const canvasToFile = (
	canvas: HTMLCanvasElement,
	fileName: string,
	mimeType = 'image/png',
	quality = 1
): Promise<File> => {
	return new Promise((resolve, reject) => {
		canvas.toBlob(
			(blob) => {
				if (blob) {
					resolve(new File([blob], fileName, { type: mimeType }));
				} else {
					reject(new Error('Canvas toBlob failed'));
				}
			},
			mimeType,
			quality
		);
	});
};
