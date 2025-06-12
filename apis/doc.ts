import useEditorStore from '@/components/editor/use-editor-store';
import { useFetcher } from '@/hooks/use-fetcher';
import { DocMetaVo, DocVo, RecentEditVo } from '@/types/doc';

export const useRecentEditsQuery = () =>
	useFetcher<RecentEditVo[]>('/api/recent/list');

export const useDocMetaQuery = () => {
	const slug = useEditorStore((state) => state.slug);

	return useFetcher<DocMetaVo>(slug ? `/api/docs/${slug}/meta` : void 0);
};

export const useDocQuery = () => {
	const slug = useEditorStore((state) => state.slug);

	return useFetcher<DocVo>(slug ? `/api/docs/${slug}` : void 0);
};
