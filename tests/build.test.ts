import { describe, expect, it } from 'vitest';

import { DEFAULT_CARD } from '../src/lib/config';
import { buildCard, buildFrom } from '../src/lib/survey/build';
import type { Question, Survey } from '../src/lib/survey/types';

/** 一份问卷：单测只关心题目与搬运方式，其余字段与内容无关 */
const surveyOf = (questions: Question[], build?: Survey['build']): Survey => ({
	id: 'test',
	title: '测试',
	description: '',
	questions,
	build,
});

const q = (question: Partial<Question> & { id: string }): Question => ({
	label: question.id,
	kind: 'text',
	...question,
});

describe('buildCard', () => {
	it('按 into 把答案搬到对应的去处，id 由题目 id 推出来', () => {
		const survey = surveyOf([
			q({ id: 't', into: 'title' }),
			q({ id: 'f', into: 'footer' }),
			q({ id: 'a', into: 'meta', label: '作者' }),
			q({ id: 'n', into: 'block', label: '说明' }),
		]);

		expect(buildCard(survey, { t: '标题', f: '署名', a: '我', n: '正文' })).toEqual({
			title: '标题',
			footerText: '署名',
			meta: [{ id: 'm-a', label: '作者', value: '我' }],
			blocks: [{ id: 'b-n', label: '说明', text: '正文' }],
		});
	});

	it('问到却答空的标题与页脚写成空串——那正是「这一块就要空着」', () => {
		const survey = surveyOf([q({ id: 't', into: 'title' }), q({ id: 'f', into: 'footer' })]);

		expect(buildCard(survey, { t: '   ', f: '' })).toEqual({ title: '', footerText: '', meta: [], blocks: [] });
	});

	it('空的元数据与文本块整条丢掉，没答的题不留空标签', () => {
		const survey = surveyOf([q({ id: 'a', into: 'meta' }), q({ id: 'n', into: 'block' })]);

		expect(buildCard(survey, { a: '', n: '   ' })).toEqual({ meta: [], blocks: [] });
	});

	it('没写 into 的题只给 build 用，自己不进内容', () => {
		const survey = surveyOf([q({ id: 'helper' })]);

		expect(buildCard(survey, { helper: '只用来算标题' })).toEqual({ meta: [], blocks: [] });
	});
});

describe('buildFrom', () => {
	it('以默认内容为底，只有问到的去处被盖掉', () => {
		const card = buildFrom(surveyOf([q({ id: 'a', into: 'meta' })]), { a: '我' });

		expect(card.footerText).toBe(DEFAULT_CARD.footerText);
		expect(card.meta).toEqual([{ id: 'm-a', label: 'a', value: '我' }]);
	});

	it('自定义 build 顶掉默认搬运', () => {
		const survey = surveyOf([q({ id: 'a', into: 'meta' })], (answers) => ({ title: `关于 ${answers.a}` }));
		const card = buildFrom(survey, { a: '我' });

		expect(card.title).toBe('关于 我');
		expect(card.meta).toEqual([]);
	});
});
