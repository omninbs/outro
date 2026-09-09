import type { CardData, RatioId } from './types';

export interface Ratio {
	id: RatioId;
	label: string;
	note: string;
	w: number;
	h: number;
}

export const RATIOS: Ratio[] = [
	{ id: '16:9', label: '16:9', note: '横屏', w: 1280, h: 720 },
	{ id: '21:9', label: '21:9', note: '影院', w: 1470, h: 630 },
	{ id: '1:1', label: '1:1', note: '方形', w: 1080, h: 1080 },
	{ id: '4:3', label: '4:3', note: '横屏', w: 1440, h: 1080 },
	{ id: '9:16', label: '9:16', note: '竖屏', w: 720, h: 1280 },
];

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

export const QUICK_FIELDS = [
	{ label: '原曲链接', placeholder: 'https://… 或 BV 号' },
	{ label: '扒谱日期', placeholder: '如 2026-09-09' },
	{ label: '工程版本', placeholder: '如 NBS 3.1' },
	{ label: '联系/授权渠道', placeholder: '邮箱、私信或主页' },
	{ label: '参与人员', placeholder: '调教 / 混音 / 校对…' },
];

export const DEFAULT_TITLE = '歌曲信息';
export const DEFAULT_NOTICE_LABEL = '版权声明';
export const DEFAULT_NOTICE = NOTICE_TEMPLATES[0].text;
export const DEFAULT_FOOTER = '由 kemiamu/colophon 生成';

export const DEFAULT_CARD: CardData = {
	title: '',
	fields: [
		{ id: 'f1', label: '原歌曲作者', value: '' },
		{ id: 'f2', label: 'NBS 作者', value: '' },
		{ id: 'f3', label: '结构设计者', value: '' },
	],
	noticeLabel: '',
	notice: '',
	flavor: 'mocha',
	accent: 'mauve',
	textScale: 100,
	ratio: '16:9',
	footerOn: true,
	footerText: '',
};

export function ratioOf(id: RatioId): Ratio {
	return RATIOS.find((r) => r.id === id) ?? RATIOS[0];
}
