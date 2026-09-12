import { useState } from 'preact/hooks';

import { COPY } from '../lib/copy';
import type { Answers, Survey } from '../lib/survey/types';
import { QuestionInput } from '../components/widgets/QuestionInput';
import { Button, Panel, ActionRow } from '../components/ui';
import { PageHeader } from './PageHeader';

// 问卷页：把一份问卷渲染成题面，答案就地攒着、交回调用方搬成内容
export function SurveyPage({
	survey,
	on_finish,
	on_exit,
}: {
	survey: Survey;
	on_finish: (answers: Answers) => void;
	on_exit: () => void;
}) {
	const [answers, set_answers] = useState<Answers>(() =>
		// 预填值是真值：写了预填的题一进来就带着答案，不想要就自己改掉
		Object.fromEntries(survey.questions.map((question) => [question.id, question.default ?? ''])),
	);

	const answer = (question_id: string, value: string) =>
		set_answers((prev) => ({ ...prev, [question_id]: value }));

	return (
		<div class="flex flex-col gap-6">
			<PageHeader title={survey.title} description={survey.description} />

			<Panel>
				{survey.questions.map((question) => (
					<QuestionInput
						key={question.id}
						label={question.label}
						long={question.kind === 'long'}
						options={question.options}
						value={answers[question.id] ?? ''}
						on_change={(value) => answer(question.id, value)}
						placeholder={COPY.placeholder}
					/>
				))}
			</Panel>

			<ActionRow>
				<Button on_click={on_exit}>{COPY.action.back_home}</Button>
				<Button variant="primary" on_click={() => on_finish(answers)}>
					{COPY.action.finish}
				</Button>
			</ActionRow>
		</div>
	);
}
