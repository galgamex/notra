'use client';

import { useEditorRef } from '@udecode/plate/react';
import { FocusEventHandler, KeyboardEventHandler, useRef } from 'react';

import { Textarea } from '@/components/ui/textarea';
import { useEditDocTitle } from '@/hooks/use-edit-doc-title';

export default function TitleTextarea() {
	const { data, handleEditDocTitle } = useEditDocTitle();
	const ref = useRef<HTMLTextAreaElement>(null);
	const editor = useEditorRef();

	const handleBlur: FocusEventHandler<HTMLTextAreaElement> = (e) => {
		const newTitle = e.target.value;

		handleEditDocTitle(newTitle);
	};

	const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
		if (e.key === 'Enter') {
			ref.current?.blur();
			editor.tf.focus({ at: [0, 0], edge: 'start' });
		}
	};

	return (
		<div className="mt-6 px-16 pt-4 pb-1 text-base sm:px-[max(64px,calc(50%-350px))]">
			<Textarea
				key={data?.title}
				ref={ref}
				className="min-h-12.5 resize-none rounded-none border-none p-0 !text-4xl leading-12.5 font-bold shadow-none outline-none focus-visible:border-none focus-visible:shadow-none focus-visible:ring-0 focus-visible:outline-none"
				defaultValue={data?.title}
				rows={1}
				spellCheck={false}
				onBlur={handleBlur}
				onKeyDown={handleKeyDown}
			/>
		</div>
	);
}
