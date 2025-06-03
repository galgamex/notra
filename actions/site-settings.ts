'use server';

import SiteSettingsService from '@/services/site-settings';
import { UpdateAnalyticsDto, UpdateSiteInfoDto } from '@/types/site-settings';

export const updateSiteInfo = async (values: UpdateSiteInfoDto) => {
	const serviceResult = await SiteSettingsService.updateSiteSettings(values);

	return serviceResult.toPlainObject();
};

export const updateAnalytics = async (values: UpdateAnalyticsDto) => {
	const serviceResult = await SiteSettingsService.updateSiteSettings(values);

	return serviceResult.toPlainObject();
};
