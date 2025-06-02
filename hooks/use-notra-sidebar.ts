import { create } from 'zustand';

type NotraSidebarStore = {
	mobileOpen: boolean;
	toggleMobileOpen: () => void;
	isResizing: boolean;
	setIsResizing: (isResizing: boolean) => void;
};

export const useNotraSidebar = create<NotraSidebarStore>((set) => ({
	mobileOpen: false,
	toggleMobileOpen: () => set((state) => ({ mobileOpen: !state.mobileOpen })),
	isResizing: false,
	setIsResizing: (isResizing) => set({ isResizing })
}));
