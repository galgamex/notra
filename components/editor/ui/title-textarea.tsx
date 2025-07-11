'use client';

import { useEditorRef } from '@udecode/plate/react';
import { FocusEventHandler, KeyboardEventHandler, useRef } from 'react';

import { Textarea } from '@/components/ui/textarea';
import { getTranslations } from '@/i18n';

import useEditorStore from '../use-editor-store';

const t = getTranslations('notra_editor');

export default function TitleTextarea() {
	const ref = useRef<HTMLTextAreaElement>(null);
	const editor = useEditorRef();
	const title = useEditorStore((state) => state.title);
	const setTitle = useEditorStore((state) => state.setTitle);
	const setUpdatedAt = useEditorStore((state) => state.setUpdatedAt);

	const handleBlur: FocusEventHandler<HTMLTextAreaElement> = (e) => {
		const newTitle = e.target.value;

		setTitle(newTitle.length === 0 ? t('untitled') : newTitle);
		setUpdatedAt(new Date());
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
				key={title}
				ref={ref}
				className="min-h-12.5 resize-none rounded-none border-none p-0 !text-4xl leading-12.5 font-bold shadow-none outline-none focus-visible:border-none focus-visible:shadow-none focus-visible:ring-0 focus-visible:outline-none"
				defaultValue={title}
				rows={1}
				spellCheck={false}
				onBlur={handleBlur}
				onKeyDown={handleKeyDown}
			/>
		</div>
	);
}
