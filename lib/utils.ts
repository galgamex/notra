import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { uploadImage as uploadImageAction } from '@/actions/files';
import { CatalogNodeVo, CatalogNodeVoWithLevel } from '@/types/catalog-node';

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

/**
 * Flatten catalog nodes
 * @param nodes - The catalog nodes to flatten
 * @returns The flattened catalog nodes
 */
export const flattenCatalogNodes = (
	nodes: CatalogNodeVo[]
): CatalogNodeVoWithLevel[] => {
	const result: CatalogNodeVoWithLevel[] = [];
	const nodeMap = new Map<number, CatalogNodeVoWithLevel>();
	let headNode: CatalogNodeVo | null = null;

	nodes.forEach((node) => {
		const nodeWithLevel = { ...node, level: 0 };

		nodeMap.set(node.id, nodeWithLevel);

		if (!headNode && !nodeWithLevel.prevId && !nodeWithLevel.parentId) {
			headNode = nodeWithLevel;
		}
	});

	if (!headNode) {
		return result;
	}

	const processNode = (node: CatalogNodeVoWithLevel) => {
		result.push(node);

		if (node.parentId) {
			const parentNode = nodeMap.get(node.parentId);

			if (parentNode) {
				node.level = parentNode.level + 1;
			}
		}

		if (node.childId) {
			const childNode = nodeMap.get(node.childId);

			if (childNode) {
				processNode(childNode);
			}
		}

		if (node.siblingId) {
			const siblingNode = nodeMap.get(node.siblingId);

			if (siblingNode) {
				processNode(siblingNode);
			}
		}
	};

	processNode(headNode);

	return result;
};
