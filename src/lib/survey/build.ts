import { DEFAULT_CARD } from '../config';
import type { CardData, MetaItem, TextBlock } from '../types';
import type { Answers, Question, Survey } from './types';

/**
 * 内容里那条元数据 / 文本块的 id 由题目 id 推出来，不用随机 id。
 *
 * 两个原因：一是答案每改一个字都要重算一遍预览，随机 id 会让清单每次都换 key、
 * 整列重挂载；二是 id 稳定，改完答案再回表单编辑时，行的身份前后一致。
 * 前缀带横杠（`m-` / `b-`）是为了跟随机 id（`m` + 时间戳）区分开，不会撞。
 */
const metaId = (question: Question) => `m-${question.id}`;
const blockId = (question: Question) => `b-${question.id}`;

/**
 * 按每道题的 `into` 把答案搬成内容——纯函数，不碰状态也不碰 DOM。
 *
 * 返回的是**局部**内容：只有问卷问到的去处才出现在结果里，没问到的（比如没有页脚题的问卷
 * 就不该给出 `footerText`）留给 `buildFrom` 拿默认内容补上——「答完问卷」不等于「抹掉默认」。
 *
 * 问到却答空的标题 / 页脚写成空串：那是「这一块就是要空着」，跟「没问过」不是一回事。
 * 元数据与文本块不同，空白答案整条丢掉——没答的题不该在结尾页留一行空标签。
 * 同一去处写多次时后者覆盖前者（标题、页脚），元数据与文本块则按题目顺序堆叠。
 */
export function buildCard(survey: Survey, answers: Answers): Partial<CardData> {
	const meta: MetaItem[] = [];
	const blocks: TextBlock[] = [];
	const said: Partial<CardData> = { meta, blocks };

	for (const question of survey.questions) {
		const into = question.into;
		if (!into) continue;
		const value = (answers[question.id] ?? '').trim();

		switch (into) {
			case 'title':
				said.title = value;
				break;
			case 'footer':
				said.footerText = value;
				break;
			case 'meta':
				if (value) meta.push({ id: metaId(question), label: question.label, value });
				break;
			case 'block':
				if (value) {
					blocks.push({
						id: blockId(question),
						label: question.label,
						text: value,
					});
				}
				break;
		}
	}

	return said;
}

/**
 * 问卷的答案 → 内容：**以默认内容（`DEFAULT_CARD`）为底，问卷答到的部分盖在上面**。
 *
 * 「答完问卷」是换一份内容，不是清空内容：问卷没问到的去处保持默认值——没有页脚题的问卷
 * 答完，那行署名还得在。（2026-09 修的就是这个：当年 `buildCard` 从全空字面量起步，
 * 结果 `footerText` 被写成空串，默认署名白设了。）
 */
export function buildFrom(survey: Survey, answers: Answers): CardData {
	const said = survey.build ? survey.build(answers) : buildCard(survey, answers);
	return { ...structuredClone(DEFAULT_CARD), ...said };
}
