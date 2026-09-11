import type { Survey } from '../lib/survey/types';

/**
 * 逻辑红石音乐：这个类别作品的问卷。
 *
 * 类别名写全，不简写——地址与卡片上都用全称，认得出、也搜得到；选项最新在前。
 *
 * 约定：每道题**先写 `into`**，一份问卷是拿结尾页倒着写出来的；预设值都是**真值**，
 * 一进问卷就填着（以选项给出的，那条就处于选中态），删空了那一行就不印；
 * 作者不表态的地方一律取**收得最紧**的那一档，替人放宽没人兜得住。
 */
export const logicRedstoneMusicSurvey: Survey = {
	id: 'logic-redstone-music',
	title: '逻辑红石音乐',
	description: '适用于逻辑红石音乐类别作品的问卷',
	questions: [
		{
			into: 'title',
			id: 'title',
			label: '页面标题',
			kind: 'text',
		},
		{
			into: 'meta',
			id: 'version',
			label: '适用版本',
			kind: 'choice',
			options: ['JE26.1+', 'JE1.21+', 'JE26.1+ & BE26.10+', 'JE1.21+ & BE1.21.0+', 'JE1.14+ & BE1.13.0+'],
			default: 'JE26.1+',
		},
		{
			into: 'meta',
			id: 'stateSpace',
			label: '状态空间族',
			kind: 'choice',
			// 问的是**族**：多族 = 不同初始状态各走一套互不相通的状态空间，
			// 无分歧 = 只有单调的一条推进；括注留的是答题的人认得的旧说法
			options: ['单调（无分歧）', '多族（状态编码）'],
			default: '单调（无分歧）',
		},
		{
			into: 'meta',
			id: 'buildRequirement',
			label: '建造要求',
			kind: 'choice',
			options: ['无要求', '不建议跨区块', '方向性', '位置性'],
			default: '无要求',
		},
		{
			into: 'meta',
			id: 'bedrock',
			label: '基岩版兼容',
			kind: 'choice',
			options: ['无差异', '需调整延时补偿', '请查看对应版本'],
			default: '无差异',
		},
		{
			into: 'meta',
			id: 'originalAuthor',
			label: '原曲作者',
			kind: 'text',
		},
		{
			into: 'meta',
			id: 'scoreAuthor',
			label: '乐谱作者',
			kind: 'text',
		},
		{
			into: 'meta',
			id: 'structureAuthor',
			label: '结构作者',
			kind: 'text',
		},
		{
			into: 'meta',
			id: 'videoAuthor',
			label: '视频作者',
			kind: 'text',
		},
		{
			into: 'meta',
			id: 'license',
			label: '转载和再制',
			kind: 'choice',
			options: ['禁止', '注明来源&非盈利', '注明来源'],
			default: '禁止',
		},
		{
			into: 'block',
			id: 'colophon',
			label: '尾注',
			kind: 'long',
			options: ['感谢参与贡献的全体群众与制作团队 uwu'],
			default: '感谢参与贡献的全体群众与制作团队 uwu',
		},
		{
			into: 'block',
			id: 'guide',
			label: '指南',
			kind: 'long',
			// 预设以选项给出，`default` 指向的那条一进来就是选中态
			options: [
				'建造红石音乐所需要具备的基础知识请参考基础教学。',
				'建造红石音乐所需要具备的基础知识请参考基础教学；作品已发布，可查看和下载。',
			],
			default: '建造红石音乐所需要具备的基础知识请参考基础教学。',
		},
	],
};
