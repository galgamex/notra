'use client';

import { DocEntity } from '@prisma/client';
import dynamic from 'next/dynamic';

import { useDocQuery } from '@/apis/doc';

const DynamicEditor = dynamic(() => import('./editor-core'), { ssr: false });

export interface EditorProps {
	slug: DocEntity['slug'];
}

export default function Editor({ slug }: Readonly<EditorProps>) {
	const { data: doc } = useDocQuery(slug);

	if (!doc) {
		return null;
	}

	return <DynamicEditor doc={doc} />;
}
