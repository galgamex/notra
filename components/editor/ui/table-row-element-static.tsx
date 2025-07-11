import { SlateElement } from '@udecode/plate';

import type { SlateElementProps } from '@udecode/plate';

export function TableRowElementStatic(props: SlateElementProps) {
	return (
		<SlateElement {...props} as="tr" className="h-full">
			{props.children}
		</SlateElement>
	);
}
