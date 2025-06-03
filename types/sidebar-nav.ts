import { LucideIcon } from 'lucide-react';

export interface SidebarNavItem {
	title: string;
	url: string;
	icon?: LucideIcon;
	subItems?: SidebarNavItem[];
}
