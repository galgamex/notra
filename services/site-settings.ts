import { SiteSettingsEntity } from '@prisma/client';
import { cache } from 'react';

import { getTranslations } from '@/i18n';
import { logger } from '@/lib/logger';
import prisma from '@/lib/prisma';
import { ServiceResult } from '@/lib/service-result';
import { Nullable } from '@/types/common';

export default class SiteSettingsService {
	static getSiteSettings = cache(async () => {
		try {
			const siteSettings = await prisma.siteSettingsEntity.findUnique({
				where: { id: 'default' },
				select: {
					title: true,
					description: true,
					keywords: true,
					logo: true,
					darkLogo: true,
					googleAnalyticsId: true
				}
			});

			return ServiceResult.success(siteSettings);
		} catch (error) {
			logger('SiteSettingsService.getSiteSettings', error);
			const t = getTranslations('services_site_settings');

			return ServiceResult.fail(t('get_site_settings_error'));
		}
	});

	static updateSiteSettings = async (values: {
		title?: Nullable<SiteSettingsEntity['title']>;
		description?: Nullable<SiteSettingsEntity['description']>;
		keywords?: Nullable<SiteSettingsEntity['keywords']>;
		logo?: Nullable<SiteSettingsEntity['logo']>;
		darkLogo?: Nullable<SiteSettingsEntity['darkLogo']>;
		googleAnalyticsId?: Nullable<SiteSettingsEntity['googleAnalyticsId']>;
	}) => {
		try {
			const siteSettings = await prisma.siteSettingsEntity.upsert({
				where: { id: 'default' },
				update: values,
				create: values
			});

			return ServiceResult.success(siteSettings);
		} catch (error) {
			logger('SiteSettingsService.updateSiteSettings', error);
			const t = getTranslations('services_site_settings');

			return ServiceResult.fail(t('update_site_settings_error'));
		}
	};
}
