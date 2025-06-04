import { ScrollArea } from '@radix-ui/react-scroll-area';
import { PropsWithChildren } from 'react';

export type NotraSidebarContentProps = PropsWithChildren;

export default function NotraSidebarContent({
	children
}: Readonly<NotraSidebarContentProps>) {
	return (
		<div className="flex-1 overflow-hidden">
			<ScrollArea className="h-full px-4 md:px-2.5">{children}</ScrollArea>
		</div>
	);
}
