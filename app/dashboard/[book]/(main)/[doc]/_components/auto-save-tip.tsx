'use client';

import dayjs from 'dayjs';

import { useDocMetaQuery } from '@/apis/doc';
import useEditorStore from '@/components/editor/use-editor-store';
import { getTranslations } from '@/i18n';

const t = getTranslations('notra_editor');

export default function AutoSaveTip() {
	const isSaving = useEditorStore((state) => state.isSaving);
	const isFirstLoad = useEditorStore((state) => state.isFirstLoad);
	const { data } = useDocMetaQuery();

	if (!data) {
		return null;
	}

	let tip = '';
	const updateAt = dayjs(data.updatedAt).format('YYYY-MM-DD HH:mm:ss');

	if (isSaving) {
		tip = t('auto_save_tip_saving');
	} else if (isFirstLoad) {
		tip = t('auto_save_tip_last_saved') + ' ' + updateAt;
	} else {
		tip = t('auto_save_tip_saved') + ' ' + updateAt;
	}

	return <span className="text-xs text-muted-foreground">{tip}</span>;
}
