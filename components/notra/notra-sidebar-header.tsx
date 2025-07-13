import { PropsWithChildren } from 'react';

export type NotraSidebarHeaderProps = PropsWithChildren;

export default function NotraSidebarHeader({
	children
}: Readonly<NotraSidebarHeaderProps>) {
	return children;
}
