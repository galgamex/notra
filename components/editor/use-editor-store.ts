import { create } from 'zustand';

type EditorStore = {
	slug: string | undefined;
	setSlug: (slug: string) => void;
	title: string;
	setTitle: (title: string | undefined) => void;
	updatedAt: Date;
	setUpdatedAt: (updatedAt: Date) => void;
	titleToUpdate: string | undefined;
	setTitleToUpdate: (title: string | undefined) => void;
	isSaving: boolean;
	setIsSaving: (isSaving: boolean) => void;
	isFirstLoad: boolean;
	setIsFirstLoad: (isFirstLoad: boolean) => void;
};

const useEditorStore = create<EditorStore>((set) => ({
	slug: void 0,
	setSlug: (slug) => set({ slug }),
	title: '',
	setTitle: (title) => set({ title }),
	updatedAt: new Date(0),
	setUpdatedAt: (updatedAt) => set({ updatedAt }),
	titleToUpdate: void 0,
	setTitleToUpdate: (titleToUpdate) => set({ titleToUpdate }),
	isSaving: false,
	setIsSaving: (isSaving) => set({ isSaving, isFirstLoad: false }),
	isFirstLoad: true,
	setIsFirstLoad: (isFirstLoad) => set({ isFirstLoad })
}));

export default useEditorStore;
