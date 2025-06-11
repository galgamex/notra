import { CheckIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';

import type { SlateRenderElementProps } from '@udecode/plate';

export function TodoMarkerStatic(
	props: Readonly<Omit<SlateRenderElementProps, 'children'>>
) {
	return (
		<div contentEditable={false}>
			<CheckboxStatic
				checked={props.element.checked as boolean}
				className="pointer-events-none absolute top-1 -left-6"
			/>
		</div>
	);
}

export function TodoLiStatic(props: SlateRenderElementProps) {
	return (
		<li
			className={cn(
				'list-none',
				(props.element.checked as boolean) &&
					'text-muted-foreground line-through'
			)}
		>
			{props.children}
		</li>
	);
}

type CheckboxStaticProps = {
	checked: boolean;
	className?: string;
	style?: React.CSSProperties;
};

function CheckboxStatic(props: Readonly<CheckboxStaticProps>) {
	return (
		<button
			className={cn(
				'peer size-4 shrink-0 rounded-sm border border-primary bg-background ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
				props.className
			)}
			data-state={props.checked ? 'checked' : 'unchecked'}
			style={props.style}
			type="button"
		>
			<div className={cn('flex items-center justify-center text-current')}>
				{props.checked && <CheckIcon className="size-4" />}
			</div>
		</button>
	);
}
