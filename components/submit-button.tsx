'use client';

import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { ChildrenProps } from '@/types/common';

import { Button } from './ui/button';

export interface SubmitButtonProps extends ChildrenProps {
	isPending: boolean;
	className?: string;
	disabled?: boolean;
}

export function SubmitButton({
	children,
	isPending,
	className,
	disabled
}: Readonly<SubmitButtonProps>) {
	return (
		<Button
			aria-disabled={isPending}
			className={cn(
				'cursor-pointer w-full h-12 px-6 py-3 !bg-black !text-white hover:!bg-black/90',
				className
			)}
			disabled={disabled || isPending}
			type={isPending ? 'button' : 'submit'}
		>
			{isPending && <Loader2 className="animate-spin !text-white" />}
			{children}
			<span aria-live="polite" className="sr-only">
				{isPending ? 'Loading' : 'Submit form'}
			</span>
		</Button>
	);
}
