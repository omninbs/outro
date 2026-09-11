import { DEFAULT_CARD } from './config';
import { newId } from './id';
import type { CardData, MetaItem, TextBlock } from './types';

const STORAGE_KEY = 'outro.card.v2';
const LEGACY_KEY = 'outro.card.v1';

/** 改名前用过的键：认得出来就接着读，别让用户已有的内容没了 */
const OLD_CURRENT_KEY = 'colophon.card.v2';
const OLD_LEGACY_KEY = 'colophon.card.v1';

/** 旧档预填过的一段声明文本：模板本身已经删了，这两个字面量只用来认出旧档 */
const LEGACY_NOTICE_LABEL = '版权声明';
const LEGACY_NOTICE_TEXT =
	'本工程仅供学习交流与个人收藏使用。允许转载分享，转载时请注明原歌曲作者与本工程作者，并保留本声明。' +
	'禁止商用、售卖或用于付费订阅；如需二创或商业合作，请先取得授权。';

/** 旧档当年预填的默认文案：迁移认的是旧档里写着什么，不是今天默认显示什么 */
const LEGACY_DEFAULT_TITLE = '标题';
const LEGACY_DEFAULT_FOOTER = '底部一行字';

const str = (value: unknown, fallback = '') => (typeof value === 'string' ? value : fallback);

/** 旧档把默认文案直接预填进了框里，迁移时那等于「没填」 */
const dropDefault = (value: string, fallback: string) => (value.trim() === fallback ? '' : value);

/** 存档里的一列：形状对不上的整条丢掉——存档是外面来的，不能拿它当类型使 */
function rows(value: unknown): Record<string, unknown>[] {
	return Array.isArray(value)
		? value.filter((row): row is Record<string, unknown> => !!row && typeof row === 'object' && !Array.isArray(row))
		: [];
}

const asMeta = (value: unknown): MetaItem[] =>
	rows(value).map((row) => ({ id: str(row.id) || newId('m'), label: str(row.label), value: str(row.value) }));

const asBlocks = (value: unknown): TextBlock[] =>
	rows(value).map((row) => ({ id: str(row.id) || newId('b'), label: str(row.label), text: str(row.text) }));

/** 存档 JSON → 当前结构，顺带兼容旧写法；纯函数，迁移可以单独试 */
export function parseCard(raw: string): CardData {
	const old = JSON.parse(raw) as Record<string, unknown>;

	const meta = asMeta(Array.isArray(old.meta) ? old.meta : Array.isArray(old.fields) ? old.fields : DEFAULT_CARD.meta);

	const blocks: TextBlock[] = Array.isArray(old.blocks)
		? asBlocks(old.blocks)
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

/** 读存档：当前版本优先，其次是旧版本（迁移时把当年预填的默认当成没填），都没有才起一份全新的 */
export function loadCard(): CardData {
	try {
		const current = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(OLD_CURRENT_KEY);
		if (current) return parseCard(current);

		const legacy = localStorage.getItem(LEGACY_KEY) ?? localStorage.getItem(OLD_LEGACY_KEY);
		if (!legacy) return structuredClone(DEFAULT_CARD);

		const card = parseCard(legacy);
		return {
			...card,
			title: dropDefault(card.title, LEGACY_DEFAULT_TITLE),
			footerText: dropDefault(card.footerText, LEGACY_DEFAULT_FOOTER),
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

/** 写存档：存不上（比如隐私模式）也不该影响这一轮编辑 */
export function saveCard(data: CardData): void {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
	} catch {
		/* 忽略 */
	}
}
