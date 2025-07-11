import { SessionProvider } from 'next-auth/react';

import ProgressProvider from '@/app/_components/progress-provider';
import { ThemeProvider } from '@/app/_components/theme-provider';

export default function Providers({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<SessionProvider>
			<ProgressProvider>
				<ThemeProvider enableSystem attribute="class" defaultTheme="system">
					{children}
				</ThemeProvider>
			</ProgressProvider>
		</SessionProvider>
	);
}
