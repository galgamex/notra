'use client';

import dynamic from 'next/dynamic';

import { useIsDark } from '@/hooks/use-is-dark';
import { useMounted } from '@/hooks/use-mounted';

const DynamicBlockNoteEditor = dynamic(() => import('./block-note-editor'), {
	ssr: false,
	loading: () => (
		<div className="flex min-h-[400px] w-full items-center justify-center">
			<div className="text-muted-foreground">加载编辑器中...</div>
		</div>
	)
});

interface EditorProps {
	initialContent?: string;
	onContentChange?: (content: string) => void;
}

export default function Editor({
	initialContent,
	onContentChange
}: EditorProps) {
	const isDark = useIsDark();
	const mounted = useMounted();

	return (
		<DynamicBlockNoteEditor
			initialContent={initialContent}
			isDark={mounted ? isDark : false}
			onContentChange={onContentChange}
		/>
	);
}
