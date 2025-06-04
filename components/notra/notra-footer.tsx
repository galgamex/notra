import { getTranslations } from '@/i18n';

export default function NotraFooter() {
	const t = getTranslations('components_notra_footer');

	return (
		<footer className="border-t p-6 text-center text-xs leading-5 text-muted-foreground">
			<h2 className="sr-only">Footer</h2>
			<p>{t('copyright').replace('{copyright}', '2024-2025 Notra')}</p>
			<p
				dangerouslySetInnerHTML={{
					__html: t('powered_by')
				}}
			></p>
		</footer>
	);
}
