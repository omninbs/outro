import type { Survey } from '../lib/survey/types';

/**
 * 逻辑红石音乐：这个类别作品的问卷。
 *
 * 名字不简写：标题、说明、id 都写全「逻辑红石音乐」——「逻辑红乐」是简称，
 * 地址和首页卡片上都用全称，认得出、也搜得到。
 *
 * 几处约定（看 `lib/survey/types.ts` 里 `Question` 的注释）：
 * - 「默认：作品名称 / 通用 / 无分歧」这类是**预填值**（`default`）：答题框里一开始就写着，
 *   用户不想要就自己改；不填也能一路走到结尾页上
 * - 「默认：不显示」不是预填值，而是**不写 `default` + 占位提示写「不显示」**：
 *   空答案本来就不会印到结尾页，靠这一点表达「不问就不显示这一行」
 * - 四道单选题都写了 `default`，所以一进问卷就是「无分歧 / 无要求 / 无差异 / 禁止」，
 *   想换就点别的选项，或点「自定义」自己写一句；再点一下已选中的项就取消，那一行也就不印
 * - 「转载和再制」的默认取最保守的那一项：作者不表态，就按「禁止」印，
 *   许可放宽是作者自己的事，反过来替人放宽可没人兜得住
 * - 两道文本块题（「特别说明」「尾注」）内容留空：不写 `default`，写了才在结尾页右栏印出来，
 *   两块按题目顺序自上而下排，所以「尾注」永远在最下面
 */
export const logicRedstoneMusicSurvey: Survey = {
	id: 'logic-redstone-music',
	title: '逻辑红石音乐',
	description: '适用于逻辑红石音乐类别作品的问卷',
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
			id: 'buildRequirement',
			label: '建造要求',
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
		{
			id: 'license',
			label: '转载和再制',
			kind: 'choice',
			options: ['禁止', '注明来源/非盈利', '注明来源'],
			default: '禁止',
			into: { kind: 'meta' },
		},
		{
			id: 'notes',
			label: '特别说明',
			kind: 'long',
			placeholder: '不显示',
			into: { kind: 'block' },
		},
		{
			id: 'colophon',
			label: '尾注',
			kind: 'long',
			placeholder: '不显示',
			into: { kind: 'block' },
		},
	],
};
