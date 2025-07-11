import { auth } from '@/app/(auth)/auth';
import { getTranslations } from '@/i18n';
import { ServiceResult } from '@/lib/service-result';
import BookService from '@/services/book';

export async function GET() {
	const session = await auth();
	const t = getTranslations('app_api_common');

	if (!session) {
		return ServiceResult.fail(t('unauthorized')).nextResponse({
			status: 401
		});
	}

	const result = await BookService.getBooks();

	return result.nextResponse();
}
