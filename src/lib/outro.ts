import type { CardData } from './types';

/** 最终页的一行元数据（宽档下在左边那一栏）：名称已去空白，值保证非空 */
export interface OutroMeta {
	id: string;
	label: string;
	value: string;
}

/** 最终页的一块文本（宽档下在右边那一栏）：正文保证非空 */
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
 * 「最终页会真正显示什么」的唯一实现：过滤空白项、去掉首尾空白。
 *
 * 没有兜底文案：留空就是不印——标题空着，标题块整个不渲染；页脚空着，那行署名不渲染。
 * 最终页和向导里的清单都从这里取数——清单就是最终页的预览，
 * 两边各写一套过滤迟早会长歪。
 */
export function resolveOutro(data: CardData): OutroContent {
	return {
		title: data.title.trim(),
		meta: data.meta
			.filter((item) => item.value.trim() !== '')
			.map((item) => ({ id: item.id, label: item.label.trim(), value: item.value.trim() })),
		blocks: data.blocks
			.filter((block) => block.text.trim() !== '')
			.map((block) => ({ id: block.id, label: block.label.trim(), text: block.text.trim() })),
		footer: data.footerText.trim(),
	};
}
