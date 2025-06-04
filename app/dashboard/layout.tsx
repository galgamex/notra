import NotraLayout from '@/components/notra/notra-layout';

export default function Layout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return <NotraLayout>{children}</NotraLayout>;
}
