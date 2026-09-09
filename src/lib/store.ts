import { useCallback, useEffect, useState } from 'preact/hooks';
import {
	DEFAULT_CARD,
	DEFAULT_FOOTER,
	DEFAULT_NOTICE,
	DEFAULT_NOTICE_LABEL,
	DEFAULT_TITLE,
} from './config';
import { newId } from './id';
import type { CardData, MetaItem, TextBlock } from './types';

const STORAGE_KEY = 'colophon.card.v2';
const LEGACY_KEY = 'colophon.card.v1';

const str = (value: unknown, fallback = '') => (typeof value === 'string' ? value : fallback);

/** 旧版本把默认文案直接写进了输入框，迁移时把它当作「未填写」 */
const dropDefault = (value: string, fallback: string) => (value.trim() === fallback ? '' : value);

/** 解析已保存的内容，并兼容旧的「字段 + 声明」结构 */
function parseCard(raw: string): CardData {
	const old = JSON.parse(raw) as Record<string, unknown>;

	const meta: MetaItem[] = Array.isArray(old.meta)
		? (old.meta as MetaItem[])
		: Array.isArray(old.fields)
			? (old.fields as MetaItem[])
			: structuredClone(DEFAULT_CARD.meta);

	const blocks: TextBlock[] = Array.isArray(old.blocks)
		? (old.blocks as TextBlock[])
		: str(old.notice).trim()
			? [
					{
						id: newId('b'),
						label: str(old.noticeLabel, DEFAULT_NOTICE_LABEL),
						text: str(old.notice),
					},
				]
			: [];

	return {
		title: str(old.title),
		meta,
		blocks,
		footerText: str(old.footerText),
	};
}

function loadCard(): CardData {
	try {
		const current = localStorage.getItem(STORAGE_KEY);
		if (current) return parseCard(current);

		const legacy = localStorage.getItem(LEGACY_KEY);
		if (!legacy) return structuredClone(DEFAULT_CARD);

		const card = parseCard(legacy);
		return {
			...card,
			title: dropDefault(card.title, DEFAULT_TITLE),
			footerText: dropDefault(card.footerText, DEFAULT_FOOTER),
			blocks: card.blocks.filter(
				(block) =>
					!(
						str(block.label).trim() === DEFAULT_NOTICE_LABEL &&
						str(block.text).trim() === DEFAULT_NOTICE
					),
			),
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
