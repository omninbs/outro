import { DEFAULT_CARD } from '../config';
import type { CardData, MetaItem, TextBlock } from '../types';
import type { Answers, Question, Survey } from './types';

// 内容的 id 由题目 id 推出来：随机 id 会让清单每次换一批身份、整列重挂载。
const metaId = (question: Question) => `m-${question.id}`;
const blockId = (question: Question) => `b-${question.id}`;

// 按每道题的 into 把答案搬成内容；纯函数，只返回问到的去处，没问到的留给默认值。
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

// 问卷答案 → 内容：以默认内容为底，问卷答到的部分盖在上面；答完不等于清空。
export function buildFrom(survey: Survey, answers: Answers): CardData {
	const said = survey.build ? survey.build(answers) : buildCard(survey, answers);
	return { ...structuredClone(DEFAULT_CARD), ...said };
}
