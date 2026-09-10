import type { CardData } from './types';

/**
 * 初始内容：标题、元数据、文本块一律留空——工具不预设文案，写什么、加几条都由使用者
 * 在「摘要」与「描述」两步自己决定。
 *
 * 唯一的例外是页脚那行署名，它是一份**真值**：预填进输入框、会一路印到结尾页，
 * 就像问卷里的预填答案一样。删掉它就是真的不要页脚，结尾页上那行跟着不渲染——
 * 留空没有兜底文案（见 lib/copy.ts 的 `placeholder`）。
 */
export const DEFAULT_CARD: CardData = {
	title: '',
	meta: [],
	blocks: [],
	footerText: '由 omninbs/outro 生成',
};
