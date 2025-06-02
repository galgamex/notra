import { PropsWithChildren } from 'react';

import NotraBackdrop from './notra-backdrop';

export type NotraLayoutProps = PropsWithChildren;

export default function NotraLayout({ children }: NotraLayoutProps) {
	return (
		<div className="min-h-dvh">
			<NotraBackdrop />
			{children}
		</div>
	);
}
