import type { CardData } from './types';

/** 默认就带上的元数据条目，前面的偏工程信息，后面的是作者署名 */
const DEFAULT_META_LABELS = [
	'适用版本',
	'状态空间',
	'建造要求',
	'基岩版兼容',
	'原歌曲作者',
	'NBS 作者',
	'结构设计者',
];

/** 下面两条只作输入框里的占位提示，不会被填进内容 */
export const DEFAULT_TITLE = '标题';
export const DEFAULT_FOOTER = '底部一行字';

/** 初始内容一律留空：工具不预设任何文案，写什么由使用者决定 */
export const DEFAULT_CARD: CardData = {
	title: '',
	meta: DEFAULT_META_LABELS.map((label, i) => ({ id: `m${i + 1}`, label, value: '' })),
	blocks: [],
	footerText: '',
};
