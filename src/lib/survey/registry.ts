import type { Survey } from './types';

/**
 * 问卷清单：首页按这个顺序铺卡片，第一份固定是「空预设」。
 *
 * 加一份新问卷 = 在这里加一条数据，组件不用动：
 * - `questions[].kind`：`text` 单行 · `long` 多行 · `choice` 单选（配 `options`）
 * - `questions[].into`：答案落到结尾页哪里——`title` / `footer` /
 *   `meta`（左栏一行，配 `label`）/ `block`（右栏一块，配 `label`）；
 *   不写就只给 `build` 用，不进内容
 * - 要拼接、要算标题，就给这份问卷写 `build(answers)` 覆盖默认搬运
 */
export const SURVEYS: Survey[] = [
	{
		id: 'blank',
		title: '空预设',
		description: '从一张白纸开始：标题、元数据、文本块都由你自己写。',
		questions: [],
	},
	{
		id: 'demo',
		title: '示例问卷',
		description: '用来试通路的示例：三种题型各一道。真实问卷照这个形状写，这份可以直接删。',
		questions: [
			{
				id: 'title',
				label: '这份结尾页的标题',
				kind: 'text',
				placeholder: '比如作品名',
				into: { kind: 'title' },
			},
			{
				id: 'version',
				label: '适用版本',
				kind: 'text',
				placeholder: '比如 1.21',
				into: { kind: 'meta', label: '适用版本' },
			},
			{
				id: 'tone',
				label: '整体语气',
				kind: 'choice',
				options: ['正式', '轻松'],
				into: { kind: 'meta', label: '语气' },
			},
			{
				id: 'thanks',
				label: '想感谢的人或事',
				kind: 'long',
				rows: 4,
				placeholder: '一句话也行，几行也行',
				into: { kind: 'block', label: '鸣谢' },
			},
		],
	},
];

/** 按 id 找问卷；找不到返回 undefined——hash 是手写的，认不出就当没有这份 */
export const findSurvey = (id: string) => SURVEYS.find((survey) => survey.id === id);
