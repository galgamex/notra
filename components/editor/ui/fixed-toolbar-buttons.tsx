'use client';

import { useEditorReadOnly } from '@udecode/plate/react';

export function FixedToolbarButtons() {
	const readOnly = useEditorReadOnly();

	return <div className="flex w-full">{!readOnly && <></>}</div>;
}
