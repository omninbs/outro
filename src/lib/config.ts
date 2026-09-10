import type { CardData } from './types';

export const NOTICE_TEMPLATES = [
	{
		id: 'study',
		label: '学习交流 · 允许转载',
		text:
			'本工程仅供学习交流与个人收藏使用。允许转载分享，转载时请注明原歌曲作者与本工程作者，并保留本声明。' +
			'禁止商用、售卖或用于付费订阅；如需二创或商业合作，请先取得授权。',
	},
	{
		id: 'open',
		label: '开放转载 · 注明出处',
		text:
			'本工程允许自由转载与二次创作，只需在转载或创作处注明原歌曲作者与本工程作者。' +
			'禁止将本工程用于任何形式的商业售卖。',
	},
	{
		id: 'strict',
		label: '严格保留 · 仅限个人学习',
		text:
			'本工程版权归原歌曲作者与本工程作者所有，保留所有权利。' +
			'禁止转载、禁止商用、禁止二次扒谱与再发布；仅供个人学习参考。',
	},
];

/** 常用元数据条目，也就是默认就填上的那几条；删掉之后还能在摘要里点回来 */
export const DEFAULT_META_LABELS = ['原歌曲作者', 'NBS 作者', '结构设计者'];

export const DEFAULT_TITLE = '作品标题';
export const DEFAULT_NOTICE_LABEL = '版权声明';
export const DEFAULT_NOTICE = NOTICE_TEMPLATES[0].text;
export const DEFAULT_FOOTER = '由 kemiamu/colophon 生成';

/** 初始内容一律留空，默认文案只作占位提示，不预填 */
export const DEFAULT_CARD: CardData = {
	title: '',
	meta: DEFAULT_META_LABELS.map((label, i) => ({ id: `m${i + 1}`, label, value: '' })),
	blocks: [],
	footerText: '',
};
