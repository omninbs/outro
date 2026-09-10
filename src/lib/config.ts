import type { CardData } from './types';

/**
 * 初始内容一律留空：工具不预设任何文案，元数据的名称与条目也不预填，
 * 写什么、加几条都由使用者在「摘要」步自己决定。
 * 唯一的例外是页脚——留空时最终页会补上 `COPY.fallback.footer` 那行署名，
 * 而占位提示与兜底文案都在 lib/copy.ts，这里只管「初始内容」。
 */
export const DEFAULT_CARD: CardData = {
	title: '',
	meta: [],
	blocks: [],
	footerText: '',
};
