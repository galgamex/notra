import { create } from 'zustand';

type EditorStore = {
	slug: string | undefined;
	setSlug: (slug: string | undefined) => void;
	titleToUpdate: string | undefined;
	setTitleToUpdate: (title: string | undefined) => void;
	isSaving: boolean;
	setIsSaving: (isSaving: boolean) => void;
	isFirstLoad: boolean;
	setIsFirstLoad: (isFirstLoad: boolean) => void;
};

const useEditorStore = create<EditorStore>((set, get) => ({
	slug: void 0,
	setSlug: (slug) =>
		set({
			slug,
			...(get().slug !== slug
				? { isFirstLoad: true, titleToUpdate: void 0, isSaving: false }
				: void 0)
		}),
	titleToUpdate: void 0,
	setTitleToUpdate: (titleToUpdate) => set({ titleToUpdate }),
	isSaving: false,
	setIsSaving: (isSaving) => set({ isSaving, isFirstLoad: false }),
	isFirstLoad: true,
	setIsFirstLoad: (isFirstLoad) => set({ isFirstLoad })
}));

export default useEditorStore;
