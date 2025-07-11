'use server';

import SiteSettingsService from '@/services/site-settings';
import { UpdateSiteInfoDto } from '@/types/site-settings';

export const updateSiteInfo = async (values: UpdateSiteInfoDto) => {
	const serviceResult = await SiteSettingsService.updateSiteSettings(values);

	return serviceResult.toPlainObject();
};
