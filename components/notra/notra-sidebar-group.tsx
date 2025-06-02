import { PropsWithChildren } from 'react';

export interface NotraSidebarGroupProps extends PropsWithChildren {
	group: string;
}

export default function NotraSidebarGroup({
	children,
	group
}: NotraSidebarGroupProps) {
	return (
		<div className="pt-4">
			<p className="py-2 pl-4 text-sm text-muted-foreground">{group}</p>
			{children}
		</div>
	);
}
