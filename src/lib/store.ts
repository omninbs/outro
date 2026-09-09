import { useCallback, useEffect, useState } from 'preact/hooks';
import { DEFAULT_CARD, DEFAULT_FOOTER } from './config';
import type { CardData } from './types';

const STORAGE_KEY = 'colophon.card.v1';

/** 读取已保存的内容 */
function loadCard(): CardData {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return structuredClone(DEFAULT_CARD);
		const parsed = JSON.parse(raw) as Partial<CardData> & { footerOn?: boolean };
		const merged = { ...DEFAULT_CARD, ...parsed };
		if (!Array.isArray(merged.fields)) merged.fields = structuredClone(DEFAULT_CARD.fields);
		if (!merged.footerText.trim()) merged.footerText = DEFAULT_FOOTER;
		delete (merged as Record<string, unknown>).footerOn;
		return merged;
	} catch {
		return structuredClone(DEFAULT_CARD);
	}
}

export function useCard() {
	const [data, setData] = useState<CardData>(loadCard);

	// 立即写入，保证跳到生成页时拿到的就是最新内容
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
