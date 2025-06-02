'use client';

import { Progress } from '@bprogress/next';
import { ProgressProvider as ProgressProviderComponent } from '@bprogress/next/app';

import { ChildrenProps } from '@/types/common';

export type ProgressProviderProps = ChildrenProps;

export default function ProgressProvider({ children }: ProgressProviderProps) {
	return (
		<ProgressProviderComponent options={{ showSpinner: false, template: null }}>
			<Progress />
			{children}
		</ProgressProviderComponent>
	);
}
