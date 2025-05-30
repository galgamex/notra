import ProgressProvider from '@/components/progress-provider';
import { ThemeProvider } from '@/components/theme-provider';

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ProgressProvider>
			<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
				{children}
			</ThemeProvider>
		</ProgressProvider>
	);
}
