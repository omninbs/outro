import { DEFAULT_FOOTER, DEFAULT_TITLE } from './config';
import type { CardData } from './types';

/** 最终页左栏的一行：名称已去空白，值保证非空 */
export interface OutroMeta {
	id: string;
	label: string;
	value: string;
}

/** 最终页右栏的一块：正文保证非空 */
export interface OutroBlock {
	id: string;
	label: string;
	text: string;
}

export interface OutroContent {
	title: string;
	meta: OutroMeta[];
	blocks: OutroBlock[];
	footer: string;
}

/**
 * 「最终页会真正显示什么」的唯一实现：过滤空白项、按默认文案兜底、去掉首尾空白。
 *
 * 最终页和向导里的清单都从这里取数——清单就是最终页的预览，
 * 两边各写一套过滤和兜底迟早会长歪。
 */
export function resolveOutro(data: CardData): OutroContent {
	return {
		title: data.title.trim() || DEFAULT_TITLE,
		meta: data.meta
			.filter((item) => item.value.trim() !== '')
			.map((item) => ({ id: item.id, label: item.label.trim(), value: item.value.trim() })),
		blocks: data.blocks
			.filter((block) => block.text.trim() !== '')
			.map((block) => ({ id: block.id, label: block.label.trim(), text: block.text.trim() })),
		footer: data.footerText.trim() || DEFAULT_FOOTER,
	};
}
