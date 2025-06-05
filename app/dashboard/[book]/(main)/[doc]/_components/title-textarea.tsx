'use client';

import { usePathname } from 'next/navigation';
import { FocusEventHandler, KeyboardEventHandler, useRef } from 'react';

import { Textarea } from '@/components/ui/textarea';
import { useEditDocTitle } from '@/hooks/use-edit-doc-title';

export default function TitleTextarea() {
	const pathname = usePathname();
	const slug = pathname.split('/').pop();
	const { data, handleEditDocTitle } = useEditDocTitle(slug);
	const ref = useRef<HTMLTextAreaElement>(null);

	const handleBlur: FocusEventHandler<HTMLTextAreaElement> = (e) => {
		const newTitle = e.target.value;

		handleEditDocTitle(newTitle);
	};

	const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
		if (e.key === 'Enter') {
			ref.current?.blur();
		}
	};

	return (
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
	);
}
