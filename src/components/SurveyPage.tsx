import { useState } from 'preact/hooks';

import { COPY } from '../lib/copy';
import type { Answers, Survey } from '../lib/survey/types';
import { PageHeader } from './PageHeader';
import { QuestionInput } from './QuestionInput';
import { Button, Panel, ActionRow } from './ui';

/**
 * 问卷页：把一份问卷（数据）渲染成题面，答案就地攒在组件状态里。
 *
 * 这里只管答题，不管答卷长什么样——答案交回调用方，由它搬成内容。
 * 所以页面上没有清单：问卷是「带引导的填写」，填完回表单继续，预览在那边看就够了。
 */
export function SurveyPage({
	survey,
	onFinish,
	onExit,
}: {
	survey: Survey;
	onFinish: (answers: Answers) => void;
	onExit: () => void;
}) {
	const [answers, setAnswers] = useState<Answers>(() =>
		// 先铺一层预填值：写了 `default` 的题一进来就带着答案，不想要就自己改掉
		Object.fromEntries(survey.questions.map((question) => [question.id, question.default ?? ''])),
	);

	const answer = (questionId: string, value: string) =>
		setAnswers((prev) => ({ ...prev, [questionId]: value }));

	return (
		<div>
			<PageHeader title={survey.title} description={survey.description} />

			<Panel>
				{survey.questions.map((question) => (
					<QuestionInput
						key={question.id}
						question={question}
						value={answers[question.id] ?? ''}
						onChange={(value) => answer(question.id, value)}
					/>
				))}
			</Panel>

			<ActionRow>
				<Button onClick={onExit}>{COPY.action.backHome}</Button>
				<Button variant="primary" onClick={() => onFinish(answers)}>
					完成
				</Button>
			</ActionRow>
		</div>
	);
}
