import ProgressProvider from '@/app/_components/progress-provider';
import { ThemeProvider } from '@/app/_components/theme-provider';

export default function Providers({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ProgressProvider>
			<ThemeProvider enableSystem attribute="class" defaultTheme="system">
				{children}
			</ThemeProvider>
		</ProgressProvider>
	);
}
