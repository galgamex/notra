import ProgressProvider from '@/app/_components/progress-provider';
import { ThemeProvider } from '@/app/_components/theme-provider';

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ProgressProvider>
			<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
				{children}
			</ThemeProvider>
		</ProgressProvider>
	);
}
