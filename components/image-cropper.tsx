'use client';

import { Trash2, Upload } from 'lucide-react';
import { useRef, useState, ReactNode, MouseEventHandler } from 'react';
import { Cropper, ReactCropperElement } from 'react-cropper';
import { toast } from 'sonner';

import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogTitle,
	AlertDialogHeader,
	AlertDialogFooter,
	AlertDialogDescription
} from '@/components/ui/alert-dialog';
import { useTranslations } from '@/i18n';
import { canvasToFile, cn } from '@/lib/utils';
import { Nullable } from '@/types/common';

import { AspectRatio } from './ui/aspect-ratio';
import { Button } from '../components/ui/button';

import 'cropperjs/dist/cropper.css';

interface ImageCropperProps {
	title: string;
	placeholder: ReactNode;
	defaultImage?: Nullable<string>;
	aspectRatio: number;
	disabled?: boolean;
	maxSize?: number;
	onCrop: (croppedFile: File | null) => void;
}

export function ImageCropper({
	title,
	aspectRatio = 1,
	defaultImage,
	placeholder,
	disabled = false,
	maxSize = 2,
	onCrop
}: Readonly<ImageCropperProps>) {
	const t = useTranslations('components_image_cropper');
	const [croppedImage, setCroppedImage] = useState(defaultImage ?? null);
	const [image, setImage] = useState<string | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const cropperRef = useRef<ReactCropperElement>(null);

	const handleCrop = async () => {
		const cropper = cropperRef.current?.cropper;

		if (cropper) {
			const croppedCanvas = cropper.getCroppedCanvas();
			const croppedDataUrl = croppedCanvas.toDataURL();

			setCroppedImage(croppedDataUrl);

			const croppedFile = await canvasToFile(croppedCanvas, 'cropped.png');

			onCrop(croppedFile);
			setIsDialogOpen(false);
		}
	};

	const handleRemoveImage = (e: React.MouseEvent) => {
		e.stopPropagation();
		setCroppedImage(null);
		onCrop(null);
	};

	const handleSelectImage: MouseEventHandler<HTMLButtonElement> = (e) => {
		e.stopPropagation();
		e.preventDefault();

		const input = document.createElement('input');

		input.type = 'file';
		input.accept = 'image/*';

		input.onchange = (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];

			if (file) {
				if (file.size > maxSize * 1024 * 1024) {
					toast.warning(t('max_size').replace('{size}', `${maxSize}`));

					return;
				}

				const reader = new FileReader();

				reader.onload = () => {
					setImage(reader.result as string);
					setIsDialogOpen(true);
				};

				reader.readAsDataURL(file);
			}
		};

		input.click();
	};

	return (
		<>
			<AspectRatio className={disabled ? 'opacity-50' : ''} ratio={aspectRatio}>
				{croppedImage ? (
					<button
						className={cn(
							'size-full rounded-md border border-input p-2 relative group/cropper',
							!disabled && 'cursor-pointer'
						)}
						onClick={!disabled ? handleSelectImage : void 0}
					>
						<div className="size-full overflow-hidden">
							<picture>
								<img
									alt="preview"
									className="size-full object-cover"
									src={croppedImage}
								/>
							</picture>
						</div>
						<div className="absolute inset-0 p-2">
							{!disabled && (
								<div className="flex size-full items-center justify-center bg-black/65 text-primary-foreground opacity-0 transition-opacity group-hover/cropper:opacity-100 dark:bg-white/65">
									<Trash2
										className="size-4 text-white dark:text-black"
										onClick={handleRemoveImage}
									/>
								</div>
							)}
						</div>
					</button>
				) : (
					<button
						className={cn(
							'size-full flex items-center justify-center rounded-md border border-dashed border-input transition-colors duration-300 select-none',
							!disabled && 'cursor-pointer hover:border-primary'
						)}
						onClick={!disabled ? handleSelectImage : void 0}
					>
						{placeholder}
					</button>
				)}
			</AspectRatio>

			<AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>{title}</AlertDialogTitle>
					</AlertDialogHeader>
					<AlertDialogDescription></AlertDialogDescription>
					<AspectRatio ratio={aspectRatio}>
						{image && (
							<Cropper
								ref={cropperRef}
								aspectRatio={aspectRatio}
								autoCropArea={1}
								className="size-full"
								dragMode="move"
								src={image}
								viewMode={2}
							/>
						)}
					</AspectRatio>

					<Button
						className="w-fit cursor-pointer"
						variant="outline"
						onClick={handleSelectImage}
					>
						<Upload />
						{t('re_select')}
					</Button>

					<AlertDialogFooter className="mt-4">
						<Button
							className="cursor-pointer"
							variant="outline"
							onClick={() => setIsDialogOpen(false)}
						>
							{t('cancel')}
						</Button>
						<Button className="cursor-pointer" onClick={handleCrop}>
							{t('crop')}
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
