<<<<<<< HEAD
import { SessionProvider } from 'next-auth/react';

=======
>>>>>>> f2962736316efd5726c61050eac23356daea6ebd
import ProgressProvider from '@/app/_components/progress-provider';
import { ThemeProvider } from '@/app/_components/theme-provider';

export default function Providers({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
<<<<<<< HEAD
		<SessionProvider>
			<ProgressProvider>
				<ThemeProvider enableSystem attribute="class" defaultTheme="system">
					{children}
				</ThemeProvider>
			</ProgressProvider>
		</SessionProvider>
=======
		<ProgressProvider>
			<ThemeProvider enableSystem attribute="class" defaultTheme="system">
				{children}
			</ThemeProvider>
		</ProgressProvider>
>>>>>>> f2962736316efd5726c61050eac23356daea6ebd
	);
}
