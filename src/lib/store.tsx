import { createContext } from 'preact';
import type { ComponentChildren } from 'preact';
import { useCallback, useContext, useEffect, useMemo, useState } from 'preact/hooks';

import { DEFAULT_CARD } from './config';
import { load_card, save_card } from './persist';
import type { CardData, Patch } from './types';

type CardValue = {
	data: CardData;
	patch: Patch;
	reset: () => void;
};

const CARD_CONTEXT = createContext<CardValue>({
	data: DEFAULT_CARD,
	patch: () => {},
	reset: () => {},
});

// 内容状态：读写与旧版迁移都在 persist 里，这里只管状态与动作
export function CardProvider({ children }: { children: ComponentChildren }) {
	const [data, set_data] = useState<CardData>(load_card);

	// 立即写入，保证刷新后内容不丢
	useEffect(() => {
		save_card(data);
	}, [data]);

	const patch = useCallback<Patch>((next) => {
		set_data((prev) => ({ ...prev, ...next }));
	}, []);

	const reset = useCallback(() => {
		set_data(structuredClone(DEFAULT_CARD));
	}, []);

	const value = useMemo(() => ({ data, patch, reset }), [data, patch, reset]);

	return <CARD_CONTEXT.Provider value={value}>{children}</CARD_CONTEXT.Provider>;
}

export function use_card() {
	return useContext(CARD_CONTEXT);
}
