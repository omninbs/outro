import { useState } from 'preact/hooks';

import { COPY } from '../lib/copy';
import type { Answers, Survey } from '../lib/survey/types';
import { QuestionInput } from '../components/widgets/QuestionInput';
import { Button, Panel, ActionRow } from '../components/ui';
import { PageHeader } from './PageHeader';

// 问卷页：把一份问卷渲染成题面，答案就地攒着、交回调用方搬成内容
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
		// 预填值是真值：写了预填的题一进来就带着答案，不想要就自己改掉
		Object.fromEntries(survey.questions.map((question) => [question.id, question.default ?? ''])),
	);

	const answer = (questionId: string, value: string) =>
		setAnswers((prev) => ({ ...prev, [questionId]: value }));

	return (
		<div class="flex flex-col gap-6">
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
					{COPY.action.finish}
				</Button>
			</ActionRow>
		</div>
	);
}
