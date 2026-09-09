import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { DEFAULT_CARD } from './config';
import type { CardData } from './types';

const STORAGE_KEY = 'colophon.card.v1';

function readStored(): CardData {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return structuredClone(DEFAULT_CARD);
		const parsed = JSON.parse(raw) as Partial<CardData>;
		const merged = { ...DEFAULT_CARD, ...parsed };
		if (!Array.isArray(merged.fields)) merged.fields = structuredClone(DEFAULT_CARD.fields);
		return merged;
	} catch {
		return structuredClone(DEFAULT_CARD);
	}
}

export function useCard() {
	const [data, setData] = useState<CardData>(readStored);
	const timer = useRef<number | undefined>(undefined);

	useEffect(() => {
		clearTimeout(timer.current);
		timer.current = window.setTimeout(() => {
			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
			} catch {
				/* 隐私模式下写入会失败，忽略即可 */
			}
		}, 300);
		return () => clearTimeout(timer.current);
	}, [data]);

	const patch = useCallback((next: Partial<CardData>) => {
		setData((prev) => ({ ...prev, ...next }));
	}, []);

	const reset = useCallback(() => {
		setData(structuredClone(DEFAULT_CARD));
	}, []);

	return { data, patch, reset };
}
