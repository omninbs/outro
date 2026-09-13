import type { Survey } from '../lib/survey/types';

// 逻辑红石音乐：这个类别作品的问卷，类别名写全，选项最新在前
export const logic_redstone_music_survey: Survey = {
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
			id: 'state_space',
			label: '状态空间族',
			kind: 'choice',
			// 问的是**族**：多族 = 不同初始状态各走一套互不相通的状态空间，无分歧 = 只有单调的一条推进
			options: ['单调（无分歧）', '多族（状态编码）'],
			default: '单调（无分歧）',
		},
		{
			into: 'meta',
			id: 'build_requirement',
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
			id: 'original_author',
			label: '原曲作者',
			kind: 'text',
		},
		{
			into: 'meta',
			id: 'score_author',
			label: '乐谱作者',
			kind: 'text',
		},
		{
			into: 'meta',
			id: 'structure_author',
			label: '结构作者',
			kind: 'text',
		},
		{
			into: 'meta',
			id: 'video_author',
			label: '视频作者',
			kind: 'text',
		},
		{
			into: 'meta',
			id: 'license',
			label: '转载和再制',
			kind: 'choice',
			options: ['禁止', '要求可溯源且非营利', '要求可溯源'],
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
