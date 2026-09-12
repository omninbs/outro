import { newId } from './id';
import type { MetaItem, TextBlock } from './types';

// 一条新元数据：构造属于数据层，不跟编辑器组件绑在一起
export const newMetaItem = (label = '', value = ''): MetaItem => ({ id: newId('m'), label, value });

// 一块新文本
export const newBlock = (label = '', text = ''): TextBlock => ({ id: newId('b'), label, text });

// 按 id 改一条，返回新数组
export function updateById<T extends { id: string }>(items: T[], id: string, patch: Partial<T>): T[] {
	return items.map((item) => (item.id === id ? { ...item, ...patch } : item));
}

// 按 id 删一条，返回新数组
export function removeById<T extends { id: string }>(items: T[], id: string): T[] {
	return items.filter((item) => item.id !== id);
}
