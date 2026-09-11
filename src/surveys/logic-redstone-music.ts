import type { Survey } from '../lib/survey/types';

/**
 * 逻辑红石音乐：这个类别作品的问卷。
 *
 * 名字不简写：标题、说明、id 都写全「逻辑红石音乐」——「逻辑红乐」是简称，
 * 地址和首页卡片上都用全称，认得出、也搜得到。
 *
 * 几处约定（看 `lib/survey/types.ts` 里 `Question` 的注释）：
 * - 每道题**先写 `into`**：一份问卷是拿结尾页倒着写出来的，先说这块答案印到哪儿，
 *   再是它的 id、题面、输入形态、预填值
 * - 「JE26.1+ / 单调（无分歧）」这类是**预填值**（`default`）：答题框里一开始就写着，
 *   用户不想要就自己改；删空了就不印这一行（留空没有兜底文案）。「默认不显示」用**不写**
 *   `default` 表达，不是预填一句「不显示」——「页面标题」和尾注都这样，一进问卷标题块整块不印
 * - 五道单选题都写了 `default`，所以一进问卷就是「JE26.1+ / 单调（无分歧）/
 *   无要求 / 无差异 / 禁止」，想换就点别的选项，或点「自定义」自己写一句；
 *   再点一下已选中的项就取消，那一行也就不印
 * - 「适用版本」倒序排（最新在前），预填取第一位 JE26.1+——默认值永远跟着第一位走；
 *   作者不表态时印出去的就是**收得最紧**的那条声明（只说最新那档），不替人把兼容范围放宽
 * - 「状态空间族」那题问的是**族**而不是单个状态空间：同一份作品的不同初始状态是各自走一套
 *   互不相通的状态空间（多族），还是只有单调的一条推进（无分歧）。括注里留的是**原来的说法**
 *   ——这两个词只有这份问卷在用，不标出来答题的人对不上
 * - 「转载和再制」的默认取最保守的那一项：作者不表态，就按「禁止」印，
 *   许可放宽是作者自己的事，反过来替人放宽可没人兜得住
 * - 两道文本块题（尾注、指南）都用「一条选项 + `default` 指向它」给出开箱即用的那段话：
 *   一进问卷它就是**选中状态**，不用先看见一个写满字的框；想写别的点「自定义」，
 *   再点一下已选中那条就是取消（那一段就不印）。段落题的预设竖着排成整宽的一块块，
 *   跟横排的单选小按钮是同一套两态互斥。文本块按题目顺序自上而下排，所以结尾页最下面
 *   那条是「指南」，尾注排在它前面（原来还有一道「特别说明」，已删）
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
			// 默认值以选项给出：`default` 指向第一条，一进问卷它是选中状态
			options: [
				'建造红石音乐所需要具备的基础知识请参考基础教学。',
				'建造红石音乐所需要具备的基础知识请参考基础教学；作品已发布，可查看和下载。',
			],
			default: '建造红石音乐所需要具备的基础知识请参考基础教学。',
		},
	],
};
