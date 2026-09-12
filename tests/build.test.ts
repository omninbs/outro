import { describe, expect, it } from 'vitest';

import { DEFAULT_CARD } from '../src/lib/config';
import { buildCard, buildFrom } from '../src/lib/survey/build';
import type { Question, Survey } from '../src/lib/survey/types';

// 一份问卷：单测只关心题目与搬运方式，其余字段与内容无关
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
	it('moves answers to the destinations named by into, deriving ids from question ids', () => {
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

	it('writes an asked-but-empty title and footer as empty strings, which is "this section stays empty"', () => {
		const survey = surveyOf([q({ id: 't', into: 'title' }), q({ id: 'f', into: 'footer' })]);

		expect(buildCard(survey, { t: '   ', f: '' })).toEqual({ title: '', footerText: '', meta: [], blocks: [] });
	});

	it('drops empty metadata and text blocks entirely, leaving no empty label for unanswered questions', () => {
		const survey = surveyOf([q({ id: 'a', into: 'meta' }), q({ id: 'n', into: 'block' })]);

		expect(buildCard(survey, { a: '', n: '   ' })).toEqual({ meta: [], blocks: [] });
	});

	it('keeps a question without into for build only, never putting it into the content', () => {
		const survey = surveyOf([q({ id: 'helper' })]);

		expect(buildCard(survey, { helper: '只用来算标题' })).toEqual({ meta: [], blocks: [] });
	});
});

describe('buildFrom', () => {
	it('starts from the default content and overwrites only the destinations that were asked', () => {
		const card = buildFrom(surveyOf([q({ id: 'a', into: 'meta' })]), { a: '我' });

		expect(card.footerText).toBe(DEFAULT_CARD.footerText);
		expect(card.meta).toEqual([{ id: 'm-a', label: 'a', value: '我' }]);
	});

	it('lets a custom build override the default move', () => {
		const survey = surveyOf([q({ id: 'a', into: 'meta' })], (answers) => ({ title: `关于 ${answers.a}` }));
		const card = buildFrom(survey, { a: '我' });

		expect(card.title).toBe('关于 我');
		expect(card.meta).toEqual([]);
	});
});
