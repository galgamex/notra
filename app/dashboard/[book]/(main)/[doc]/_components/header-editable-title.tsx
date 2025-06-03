'use client';

import { usePathname } from 'next/navigation';
import {
	FocusEventHandler,
	KeyboardEventHandler,
	useEffect,
	useRef,
	useState
} from 'react';

import { Input } from '@/components/ui/input';
import { useEditDocTitle } from '@/hooks/use-edit-doc-title';

export default function HeaderEditableTitle() {
	const pathname = usePathname();
	const slug = pathname.split('/').pop();
	const { data, handleEditDocTitle } = useEditDocTitle(slug);
	const [isEditing, setIsEditing] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (isEditing) {
			inputRef.current?.select();
		}
	}, [isEditing]);

	if (!data) {
		return null;
	}

	const handleBlur: FocusEventHandler<HTMLInputElement> = (e) => {
		const newTitle = e.target.value;

		handleEditDocTitle(newTitle);
		setIsEditing(false);
	};

	const handleClick = () => {
		setIsEditing(true);
	};

	const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
		if (e.key === 'Enter') {
			inputRef.current?.blur();
		}
	};

	if (isEditing) {
		return (
			<Input
				ref={inputRef}
				className="w-[200px]"
				autoFocus
				maxLength={128}
				onBlur={handleBlur}
				defaultValue={data.title}
				onKeyDown={handleKeyDown}
			/>
		);
	}

	return (
		<div
			className="max-w-[400px] min-w-[100px] cursor-pointer truncate text-sm text-secondary-foreground"
			onClick={handleClick}
		>
			{data.title}
		</div>
	);
}
