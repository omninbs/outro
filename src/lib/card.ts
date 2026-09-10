import { newId } from './id';
import type { CardData, MetaItem, TextBlock } from './types';

/** 一条新元数据。构造属于数据层，不跟编辑器组件绑在一起 */
export const newMetaItem = (label = '', value = ''): MetaItem => ({ id: newId('m'), label, value });

/** 一块新文本 */
export const newBlock = (label = '', text = ''): TextBlock => ({ id: newId('b'), label, text });

/** 按 id 改一条，返回新数组 */
export function updateById<T extends { id: string }>(items: T[], id: string, patch: Partial<T>): T[] {
	return items.map((item) => (item.id === id ? { ...item, ...patch } : item));
}

/** 按 id 删一条，返回新数组 */
export function removeById<T extends { id: string }>(items: T[], id: string): T[] {
	return items.filter((item) => item.id !== id);
}

/**
 * 内容里有没有用户写过的东西：标题、页脚、任一条元数据 / 文本块，有一处就不算空。
 *
 * 空白项不算——空元数据、空文本块印不到最终页上（同一把尺子在 `resolveOutro` 里）。
 * 「继续编辑」那份预设拿它当出现条件（`Survey.when`）：只点过「添加元数据」
 * 却没写字的草稿，不该被当成一份没写完的内容。
 */
export function hasContent(data: CardData): boolean {
	return (
		data.title.trim() !== '' ||
		data.footerText.trim() !== '' ||
		data.meta.some((item) => item.value.trim() !== '') ||
		data.blocks.some((block) => block.text.trim() !== '')
	);
}
