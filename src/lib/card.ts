import { new_id } from './id';
import type { MetaItem, TextBlock } from './types';

// 一条新元数据：构造属于数据层，不跟编辑器组件绑在一起
export const new_meta_item = (label = '', value = ''): MetaItem => ({ id: new_id('m'), label, value });

// 一块新文本
export const new_block = (label = '', text = ''): TextBlock => ({ id: new_id('b'), label, text });

// 按 id 改一条，返回新数组
export function update_by_id<T extends { id: string }>(items: T[], id: string, patch: Partial<T>): T[] {
	return items.map((item) => (item.id === id ? { ...item, ...patch } : item));
}

// 按 id 删一条，返回新数组
export function remove_by_id<T extends { id: string }>(items: T[], id: string): T[] {
	return items.filter((item) => item.id !== id);
}
