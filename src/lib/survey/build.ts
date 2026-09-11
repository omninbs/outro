import { DEFAULT_CARD } from '../config';
import type { CardData, MetaItem, TextBlock } from '../types';
import type { Answers, Question, Survey } from './types';

/**
 * 内容的 id 由题目 id 推出来，不用随机 id：预览每改一个字都要重算一遍，
 * 随机 id 会让清单每次换一批身份、整列重挂载；取值特意跟随机 id 岔开，撞不上。
 */
const metaId = (question: Question) => `m-${question.id}`;
const blockId = (question: Question) => `b-${question.id}`;

/**
 * 按每道题的 `into` 把答案搬成内容——纯函数，不碰状态也不碰 DOM。
 *
 * 返回的是**局部**内容：只有问卷问到的去处才出现，没问到的留给默认值补上——
 * 「答完问卷」不等于「抹掉默认」。问到却答空的标题 / 页脚写成空串，那是「这一块就要空着」；
 * 元数据与文本块的空答案则整条丢掉，没答的题不该在结尾页留一行空标签。
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
 * 问卷答案 → 内容：**以默认内容为底，问卷答到的部分盖在上面**。
 *
 * 「答完问卷」是换一份内容，不是清空内容——问卷没问到的去处保持默认值。
 */
export function buildFrom(survey: Survey, answers: Answers): CardData {
	const said = survey.build ? survey.build(answers) : buildCard(survey, answers);
	return { ...structuredClone(DEFAULT_CARD), ...said };
}
