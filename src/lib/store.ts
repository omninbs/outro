import { useCallback, useEffect, useState } from 'preact/hooks';
import { DEFAULT_CARD, DEFAULT_FOOTER, DEFAULT_NOTICE, DEFAULT_NOTICE_LABEL } from './config';
import { newId } from './id';
import type { CardData, MetaItem, TextBlock } from './types';

const STORAGE_KEY = 'colophon.card.v1';

const str = (value: unknown, fallback = '') => (typeof value === 'string' ? value : fallback);

/** 读取已保存的内容，并兼容旧的「字段 + 声明」结构 */
function loadCard(): CardData {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return structuredClone(DEFAULT_CARD);
		const old = JSON.parse(raw) as Record<string, unknown>;

		const meta: MetaItem[] = Array.isArray(old.meta)
			? (old.meta as MetaItem[])
			: Array.isArray(old.fields)
				? (old.fields as MetaItem[])
				: structuredClone(DEFAULT_CARD.meta);

		const blocks: TextBlock[] = Array.isArray(old.blocks)
			? (old.blocks as TextBlock[])
			: [
					{
						id: newId('b'),
						label: str(old.noticeLabel, DEFAULT_NOTICE_LABEL),
						text: str(old.notice).trim() || DEFAULT_NOTICE,
					},
				];

		return {
			title: str(old.title, DEFAULT_CARD.title),
			meta,
			blocks,
			footerText: str(old.footerText).trim() || DEFAULT_FOOTER,
		};
	} catch {
		return structuredClone(DEFAULT_CARD);
	}
}

export function useCard() {
	const [data, setData] = useState<CardData>(loadCard);

	// 立即写入，保证刷新后内容不丢
	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
		} catch {
			/* 隐私模式下写入会失败，忽略即可 */
		}
	}, [data]);

	const patch = useCallback((next: Partial<CardData>) => {
		setData((prev) => ({ ...prev, ...next }));
	}, []);

	const reset = useCallback(() => {
		setData(structuredClone(DEFAULT_CARD));
	}, []);

	return { data, patch, reset };
}
