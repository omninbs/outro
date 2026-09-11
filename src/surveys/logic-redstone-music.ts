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
 * - 「作品名称 / 通用 / 单调（无分歧）」这类是**预填值**（`default`）：答题框里一开始就写着，
 *   用户不想要就自己改；删空了就不印这一行（留空没有兜底文案）
 * - 四道单选题都写了 `default`，所以一进问卷就是「单调（无分歧）/ 无要求 / 无差异 / 禁止」，
 *   想换就点别的选项，或点「自定义」自己写一句；再点一下已选中的项就取消，那一行也就不印
 * - 「状态空间族」那题问的是**族**而不是单个状态空间：同一份作品的不同初始状态是各自走一套
 *   互不相通的状态空间（多族），还是只有单调的一条推进（无分歧）。括注里留的是**原来的说法**
 *   ——这两个词只有这份问卷在用，不标出来答题的人对不上
 * - 「转载和再制」的默认取最保守的那一项：作者不表态，就按「禁止」印，
 *   许可放宽是作者自己的事，反过来替人放宽可没人兜得住
 * - 两道文本块题（「特别说明」「尾注」）内容留空：不写 `default`，写了才印出来，
 *   两块按题目顺序自上而下排，所以「尾注」永远在最下面
 * - 「尾注」那两条预设是 demo（`options`）：段落题的预设竖着排成整宽的一块块，
 *   点一条就整段填进多行框，想写别的就点「自定义」；预设不是 `default`，
 *   所以进来时框里还是空的——预设要人点一下才算数
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
			default: '作品名称',
		},
		{
			into: 'meta',
			id: 'version',
			label: '适用版本',
			kind: 'text',
			default: '通用',
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
			options: ['无要求', '不建议跨区块'],
			default: '无要求',
		},
		{
			into: 'meta',
			id: 'bedrock',
			label: '基岩版兼容',
			kind: 'choice',
			options: ['无差异', '需同步延时', '专版'],
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
			id: 'license',
			label: '转载和再制',
			kind: 'choice',
			options: ['禁止', '注明来源&非盈利', '注明来源'],
			default: '禁止',
		},
		{
			into: 'block',
			id: 'notes',
			label: '特别说明',
			kind: 'long',
		},
		{
			into: 'block',
			id: 'colophon',
			label: '尾注',
			kind: 'long',
			// demo 用的两条：真实问卷照这一份改写就行
			options: ['存档与结构图见视频简介，可直接取用', '原曲版权归原作者所有\n本作品仅为技术演示'],
		},
	],
};
