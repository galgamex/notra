import { SiteSettingsEntity } from '@prisma/client';
import { z } from 'zod';

import { Nullable } from './common';

export const SiteInfoFormSchema = z.object({
	title: z.string().nullable().optional(),
	description: z.string().nullable().optional(),
<<<<<<< HEAD
=======
	keywords: z.string().nullable().optional(),
>>>>>>> f2962736316efd5726c61050eac23356daea6ebd
	logo: z.instanceof(File).nullable().optional(),
	darkLogo: z.instanceof(File).nullable().optional(),
	copyright: z.string().nullable().optional()
});

export type SiteInfoFormValues = z.infer<typeof SiteInfoFormSchema>;

export type UpdateSiteInfoDto = {
	title?: Nullable<SiteSettingsEntity['title']>;
	description?: Nullable<SiteSettingsEntity['description']>;
<<<<<<< HEAD
=======
	keywords?: Nullable<SiteSettingsEntity['keywords']>;
>>>>>>> f2962736316efd5726c61050eac23356daea6ebd
	logo?: Nullable<SiteSettingsEntity['logo']>;
	darkLogo?: Nullable<SiteSettingsEntity['darkLogo']>;
	copyright?: Nullable<SiteSettingsEntity['copyright']>;
	googleAnalyticsId?: Nullable<SiteSettingsEntity['googleAnalyticsId']>;
};

export const AnalyticsFormSchema = z.object({
	googleAnalyticsId: z.string()
});

export type AnalyticsFormValues = z.infer<typeof AnalyticsFormSchema>;
