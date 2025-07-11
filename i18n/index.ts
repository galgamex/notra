import { ENV_LOCALE } from '@/constants/env';

import { Dictionary } from './dictionary';
import { en, zh } from './messages';

export const langMap: Record<string, Dictionary> = {
	en,
	zh
};

const messages = langMap[ENV_LOCALE] || en;

export const getTranslations = (module: keyof Dictionary) => (key: string) =>
	(messages[module][key as keyof (typeof messages)[typeof module]] ||
		key) as string;

export const useTranslations = (module: keyof Dictionary) =>
	getTranslations(module);
