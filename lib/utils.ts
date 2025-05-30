import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge class names using clsx and tailwind-merge
 * @param inputs - The class values to merge
 * @returns The merged class names
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
