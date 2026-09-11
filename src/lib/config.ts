import type { CardData } from './types';

/**
 * 初始内容：工具不预设文案，写什么、加几条都由使用者自己决定。
 *
 * 唯一的例外是页脚那行署名——它是一份**真值**：预填进输入框、会一路印到结尾页，
 * 删掉它就是真的不要页脚。
 */
export const DEFAULT_CARD: CardData = {
	title: '',
	meta: [],
	blocks: [],
	footerText: '由 omninbs/outro 生成',
};
