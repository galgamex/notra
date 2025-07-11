import { auth } from '@/app/(auth)/auth';
import { getTranslations } from '@/i18n';
import { ServiceResult } from '@/lib/service-result';
import DocService from '@/services/doc';

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ slug: string }> }
) {
	const session = await auth();
	const t = getTranslations('app_api_common');

	if (!session) {
		return ServiceResult.fail(t('unauthorized')).nextResponse({
			status: 401
		});
	}

	const { slug } = await params;

	const result = await DocService.getDoc(slug);

	return result.nextResponse();
}
