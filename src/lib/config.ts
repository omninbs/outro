import type { CardData } from './types';

/** 标题的占位提示，也是标题留空时最终页的兜底 */
export const DEFAULT_TITLE = '标题';

/** 页脚那行的占位提示与兜底：没写，最终页就替工具署个名 */
export const DEFAULT_FOOTER = '由 omninbs/outro 生成';

/**
 * 初始内容一律留空：工具不预设任何文案，元数据的名称与条目也不预填，
 * 写什么、加几条都由使用者在「摘要」步自己决定。
 * 唯一的例外是页脚——留空时最终页会补上 DEFAULT_FOOTER 那行署名。
 */
export const DEFAULT_CARD: CardData = {
	title: '',
	meta: [],
	blocks: [],
	footerText: '',
};
