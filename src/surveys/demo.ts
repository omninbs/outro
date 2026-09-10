import type { Survey } from '../lib/survey/types';

/**
 * 示例问卷：三种题型各一道，用来试通路。
 *
 * 真实问卷照这个形状写；这份跑通之后就可以删——
 * 记得同时在 `_registry.ts` 里删掉它那一行。
 */
export const demoSurvey: Survey = {
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
};
