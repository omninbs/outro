import { DEFAULT_CARD, DEFAULT_FOOTER, DEFAULT_TITLE } from './config';
import { newId } from './id';
import type { CardData, MetaItem, TextBlock } from './types';

const STORAGE_KEY = 'outro.card.v2';
const LEGACY_KEY = 'outro.card.v1';

/** 改名前用过的键，读到就照旧接着用，不丢用户已有内容 */
const OLD_CURRENT_KEY = 'colophon.card.v2';
const OLD_LEGACY_KEY = 'colophon.card.v1';

/** v1 会把版权声明模板预填进输入框；模板本身已经删了，这两个字面量只用来认出旧档 */
const LEGACY_NOTICE_LABEL = '版权声明';
const LEGACY_NOTICE_TEXT =
	'本工程仅供学习交流与个人收藏使用。允许转载分享，转载时请注明原歌曲作者与本工程作者，并保留本声明。' +
	'禁止商用、售卖或用于付费订阅；如需二创或商业合作，请先取得授权。';

const str = (value: unknown, fallback = '') => (typeof value === 'string' ? value : fallback);

/** 旧版本把默认文案直接写进了输入框，迁移时把它当作「未填写」 */
const dropDefault = (value: string, fallback: string) => (value.trim() === fallback ? '' : value);

/**
 * 把存档 JSON 解析成当前结构，兼容 v2 之前的「字段 + 声明」写法。
 * 纯函数，便于直接拿 fixture 试迁移。
 */
export function parseCard(raw: string): CardData {
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
						label: str(old.noticeLabel, LEGACY_NOTICE_LABEL),
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

/** 读存档：当前版本 → 旧版本（迁移后顺手丢掉被预填的默认文案）→ 全新默认值 */
export function loadCard(): CardData {
	try {
		const current = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(OLD_CURRENT_KEY);
		if (current) return parseCard(current);

		const legacy = localStorage.getItem(LEGACY_KEY) ?? localStorage.getItem(OLD_LEGACY_KEY);
		if (!legacy) return structuredClone(DEFAULT_CARD);

		const card = parseCard(legacy);
		return {
			...card,
			title: dropDefault(card.title, DEFAULT_TITLE),
			footerText: dropDefault(card.footerText, DEFAULT_FOOTER),
			blocks: card.blocks.filter(
				(block) =>
					!(
						str(block.label).trim() === LEGACY_NOTICE_LABEL &&
						str(block.text).trim() === LEGACY_NOTICE_TEXT
					),
			),
		};
	} catch {
		return structuredClone(DEFAULT_CARD);
	}
}

/** 写存档；隐私模式下会抛错，忽略即可，不影响本次编辑 */
export function saveCard(data: CardData): void {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
	} catch {
		/* 忽略 */
	}
}
