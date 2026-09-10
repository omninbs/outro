import type { Survey } from '../lib/survey/types';

/**
 * 逻辑红乐：这个类别作品的问卷。
 *
 * 几处约定（看 `lib/survey/types.ts` 里 `Question` 的注释）：
 * - 「默认：作品名称 / 通用 / 无分歧」这类是**预填值**（`default`）：答题框里一开始就写着，
 *   用户不想要就自己改；不填也能一路走到结尾页上
 * - 「默认：不显示」不是预填值，而是**不写 `default` + 占位提示写「不显示」**：
 *   空答案本来就不会印到结尾页，靠这一点表达「不问就不显示这一行」
 * - 三道单选题都写了 `default`，所以一进问卷就是「无分歧 / 无要求 / 无差异」，
 *   想换就点别的选项，或在下方的输入框里自己写
 */
export const logicRedMusicSurvey: Survey = {
	id: 'logic-red-music',
	title: '逻辑红乐',
	description: '适用于逻辑红乐类别作品的问卷',
	questions: [
		{
			id: 'title',
			label: '页面标题',
			kind: 'text',
			default: '作品名称',
			into: { kind: 'title' },
		},
		{
			id: 'version',
			label: '适用版本',
			kind: 'text',
			default: '通用',
			into: { kind: 'meta' },
		},
		{
			id: 'stateSpace',
			label: '状态空间',
			kind: 'choice',
			options: ['无分歧', '有状态编码', '有限动力系统', '流式状态机'],
			default: '无分歧',
			into: { kind: 'meta' },
		},
		{
			id: 'buildHint',
			label: '建造提示',
			kind: 'choice',
			options: ['无要求', '不建议跨区块'],
			default: '无要求',
			into: { kind: 'meta' },
		},
		{
			id: 'bedrock',
			label: '基岩版兼容',
			kind: 'choice',
			options: ['无差异', '需同步延时', '专版'],
			default: '无差异',
			into: { kind: 'meta' },
		},
		{
			id: 'originalAuthor',
			label: '原曲作者',
			kind: 'text',
			placeholder: '不显示',
			into: { kind: 'meta' },
		},
		{
			id: 'scoreAuthor',
			label: '乐谱作者',
			kind: 'text',
			placeholder: '不显示',
			into: { kind: 'meta' },
		},
		{
			id: 'structureAuthor',
			label: '结构作者',
			kind: 'text',
			placeholder: '不显示',
			into: { kind: 'meta' },
		},
	],
};
