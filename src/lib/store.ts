import { useCallback, useEffect, useState } from 'preact/hooks';
import { DEFAULT_CARD } from './config';
import { loadCard, saveCard } from './persist';
import type { CardData, Patch } from './types';

// 内容状态：读写与旧版迁移都在 persist 里，这里只管状态与动作
export function useCard() {
	const [data, setData] = useState<CardData>(loadCard);

	// 立即写入，保证刷新后内容不丢
	useEffect(() => {
		saveCard(data);
	}, [data]);

	const patch = useCallback<Patch>((next) => {
		setData((prev) => ({ ...prev, ...next }));
	}, []);

	const reset = useCallback(() => {
		setData(structuredClone(DEFAULT_CARD));
	}, []);

	return { data, patch, reset };
}
