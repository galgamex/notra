import NotraFooter from '@/components/notra/notra-footer';
import NotraHeader from '@/components/notra/notra-header';

export default function Layout({
	children
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<>
			<NotraHeader />
			<div className="pt-nav-height">{children}</div>
			<NotraFooter />
		</>
	);
}
