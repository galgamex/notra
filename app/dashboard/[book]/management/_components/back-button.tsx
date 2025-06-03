import { ChevronLeft } from 'lucide-react';

import NotraBackButton from '@/components/notra/notra-back-button';

export interface BackButtonProps {
	bookName: string;
}

export default function BackButton({ bookName }: BackButtonProps) {
	return (
		<NotraBackButton>
			<ChevronLeft className="size-4" />
			<span>{bookName}</span>
		</NotraBackButton>
	);
}
