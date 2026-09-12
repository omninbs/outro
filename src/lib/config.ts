import type { CardData } from './types';

// 初始内容：工具不预设文案；页脚那行署名是唯一真值，删掉就是真的不要页脚。
export const DEFAULT_CARD: CardData = {
	title: '',
	meta: [],
	blocks: [],
	footer_text: '由 omninbs/outro 生成',
};
