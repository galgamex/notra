'use client';

import {
	FocusEventHandler,
	KeyboardEventHandler,
	useEffect,
	useRef,
	useState
} from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useEditDocTitle } from '@/hooks/use-edit-doc-title';

export default function HeaderEditableTitle() {
	const { data, handleEditDocTitle } = useEditDocTitle();
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
				autoFocus
				className="w-[200px]"
				defaultValue={data.title}
				maxLength={128}
				onBlur={handleBlur}
				onKeyDown={handleKeyDown}
			/>
		);
	}

	return (
		<Button
			className="inline-block max-w-[120px] min-w-[100px] cursor-pointer truncate px-0 text-start text-sm font-normal text-secondary-foreground hover:bg-transparent hover:text-secondary-foreground md:max-w-[400px]"
			variant="ghost"
			onClick={handleClick}
		>
			{data.title}
		</Button>
	);
}
