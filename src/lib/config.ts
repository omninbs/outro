import type { CardData } from './types';

/** 下面两条只作输入框里的占位提示，不会被填进内容 */
export const DEFAULT_TITLE = '标题';
export const DEFAULT_FOOTER = '底部一行字';

/**
 * 初始内容一律留空：工具不预设任何文案，元数据的名称与条目也不预填，
 * 写什么、加几条都由使用者在「摘要」步自己决定。
 */
export const DEFAULT_CARD: CardData = {
	title: '',
	meta: [],
	blocks: [],
	footerText: '',
};
