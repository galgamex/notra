import { DocEntity } from '@prisma/client';

import { useFetcher } from '@/hooks/use-fetcher';
import { Nullable } from '@/types/common';
import { DocMetaVo, DocVo, RecentEditVo } from '@/types/doc';

export const useRecentEditsQuery = () =>
	useFetcher<RecentEditVo[]>('/api/recent/list');

export const useDocMetaQuery = ({
	slug,
	fallbackData
}: {
	slug?: DocEntity['slug'];
	fallbackData?: DocMetaVo;
}) =>
	useFetcher<DocMetaVo>(slug ? `/api/docs/${slug}/meta` : void 0, {
		fallbackData
	});

export const useDocQuery = (slug: Nullable<DocEntity['slug']>) =>
	useFetcher<DocVo>(slug ? `/api/docs/${slug}` : void 0);
